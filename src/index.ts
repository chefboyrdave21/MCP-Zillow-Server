#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import fetch from "node-fetch";
import * as cheerio from "cheerio";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const robotsParser = require("robots-parser");
import { ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL } from './tools.js';
import { config } from './config/index.js';
import { z } from 'zod';
import { searchParamsSchema } from './validation/searchParamsSchema.js';
import { buildSearchUrl } from './utils/buildSearchUrl.js';
import { fetchWithUserAgent, DEFAULT_USER_AGENT } from './utils/http.js';
import { parsePropertyDetails } from './utils/parsePropertyDetails.js';

// Tool definitions
const ZILLOW_TOOLS = [
  ZILLOW_SEARCH_TOOL,
  ZILLOW_PROPERTY_DETAILS_TOOL,
] as const;

// Utility functions
const BASE_URL = "https://www.zillow.com";
const SEARCH_API_URL = "https://www.zillow.com/search/GetSearchPageState.htm";

const args = process.argv.slice(2);
const IGNORE_ROBOTS_TXT = args.includes("--ignore-robots-txt");

const robotsErrorMessage = "This path is disallowed by Zillow's robots.txt to this User-agent. You may or may not want to run the server with '--ignore-robots-txt' args";
let robotsTxtContent = "";

// Simple robots.txt fetch
async function fetchRobotsTxt() {
  if (IGNORE_ROBOTS_TXT) {
    return;
  }

  try {
    const response = await fetchWithUserAgent(`${BASE_URL}/robots.txt`);
    robotsTxtContent = await response.text();
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
    robotsTxtContent = ""; // Empty robots.txt means everything is allowed
  }
}

function isPathAllowed(path: string) {  
  if (!robotsTxtContent) {
    return true; // If we couldn't fetch robots.txt, assume allowed
  }

  try {
    const robots = robotsParser(BASE_URL, robotsTxtContent);
    return robots ? robots.isAllowed(path, DEFAULT_USER_AGENT) : true;
  } catch (error) {
    console.error('Error parsing robots.txt:', error);
    return true; // If we can't parse robots.txt, assume allowed
  }
}

interface SearchResult {
  zpid: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  url: string;
}

interface PropertyDetails extends SearchResult {
  description: string;
  yearBuilt: number;
  lotSize: number;
  parking: string;
  heating: string;
  cooling: string;
  images: string[];
}

/**
 * Handles the Zillow property search tool logic.
 *
 * Validates parameters, checks robots.txt compliance, builds the search URL,
 * fetches results, and returns structured property data.
 *
 * Args:
 *   params (any): Raw search parameters (should match searchParamsSchema)
 *
 * Returns:
 *   { results: SearchResult[], nextCursor?: string }
 *
 * Throws:
 *   McpError if validation fails, robots.txt disallows, or fetch/parsing fails.
 */
async function handleZillowSearch(params: any): Promise<{ results: SearchResult[]; nextCursor?: string }> {
  // Validate parameters using zod schema
  let validatedParams;
  try {
    validatedParams = searchParamsSchema.parse(params);
  } catch (error: any) {
    // Return a detailed error if validation fails
    throw new McpError(ErrorCode.InvalidRequest, "Invalid search parameters", error.errors || error.message);
  }

  // Allow bypassing robots.txt for internal/test use
  const { ignoreRobotsText = false } = validatedParams;

  // Check robots.txt compliance unless explicitly ignored
  if (!ignoreRobotsText && !isPathAllowed("/search")) {
    throw new McpError(ErrorCode.InvalidRequest, robotsErrorMessage);
  }

  try {
    // Build the Zillow search URL using validated parameters
    const searchUrl = await buildSearchUrl(validatedParams);
    const response = await fetchWithUserAgent(searchUrl);
    
    if (!response.ok) {
      throw new McpError(ErrorCode.InternalError, `Failed to fetch search results: ${response.statusText}`);
    }

    const data = await response.json() as any;
    
    if (!data?.cat1?.searchResults?.listResults) {
      throw new McpError(ErrorCode.InternalError, "Invalid search response format");
    }

    // Map raw results to structured SearchResult objects
    const searchResults = data.cat1.searchResults.listResults;
    const results: SearchResult[] = searchResults.map((result: any) => ({
      zpid: result.zpid,
      address: result.address,
      price: result.price,
      beds: result.beds,
      baths: result.baths,
      sqft: result.area,
      type: result.homeType,
      url: `${BASE_URL}/homedetails/${result.zpid}_zpid/`,
    }));

    // Determine if there is a next page/cursor
    const nextCursor = data.cat1?.searchList?.pagination?.nextUrl
      ? String(data.cat1.searchList.pagination.currentPage + 1)
      : undefined;

    return {
      results,
      nextCursor,
    };
  } catch (error: any) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Search failed: ${error?.message || 'Unknown error'}`);
  }
}

async function handleZillowPropertyDetails(params: any): Promise<PropertyDetails> {
  const { zpid, ignoreRobotsText = false } = params;

  if (!zpid) {
    throw new McpError(ErrorCode.InvalidRequest, "Missing required parameter: zpid");
  }

  const propertyUrl = `/homedetails/${zpid}_zpid/`;

  if (!ignoreRobotsText && !isPathAllowed(propertyUrl)) {
    throw new McpError(ErrorCode.InvalidRequest, robotsErrorMessage);
  }

  try {
    const response = await fetchWithUserAgent(`${BASE_URL}${propertyUrl}`);
    
    if (!response.ok) {
      throw new McpError(ErrorCode.InternalError, `Failed to fetch property details: ${response.statusText}`);
    }

    const html = await response.text();
    return parsePropertyDetails(html, BASE_URL);
  } catch (error: any) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Failed to get property details: ${error?.message || 'Unknown error'}`);
  }
}

// Run server
async function runServer() {
  await fetchRobotsTxt();

  const serverConfig = {
    name: 'mcp-server-zillow',
    version: '1.0.0',
    capabilities: {},
    tools: [
      ZILLOW_SEARCH_TOOL,
      ZILLOW_PROPERTY_DETAILS_TOOL
    ],
    call_tool: async (params: { name: string; parameters: Record<string, unknown> }) => {
      switch (params.name) {
        case 'zillow_search':
          return handleZillowSearch(params.parameters);
        case 'zillow_property_details':
          return handleZillowPropertyDetails(params.parameters);
        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown tool: ${params.name}`);
      }
    }
  };

  // TODO: The Server class does not have a 'start' method. Refer to the @modelcontextprotocol/sdk documentation for correct startup.
  // const server = new Server(serverConfig);
  // await server.start(new StdioServerTransport());
  // try {
  //   await server.start();
  // } catch (error) {
  //   console.error("Error starting server:", error);
  //   process.exit(1);
  // }
}

runServer(); 