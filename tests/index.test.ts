import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL, handleZillowSearch, handleZillowPropertyDetails } from '../src/tools.js';
import type { Property, PropertyDetails } from '../src/types.js';

jest.mock('node-fetch');

describe('Zillow MCP Server', () => {
  let server: Server;
  let transport: StdioServerTransport;
  const serverConfig = {
    name: 'zillow-mcp-server',
    version: '1.0.0',
    capabilities: {},
    tools: [ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL]
  };
  const handlers = {
    list_tools: async () => ({
      tools: [ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL]
    }),
    call_tool: async (params: { name: string; parameters: Record<string, unknown> }): Promise<Property[] | PropertyDetails | null> => {
      switch (params.name) {
        case 'zillow_search':
          return handleZillowSearch(params.parameters) as Promise<Property[]>;
        case 'zillow_property_details':
          return handleZillowPropertyDetails(params.parameters) as Promise<PropertyDetails>;
        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown tool: ${params.name}`);
      }
    }
  };

  beforeEach(() => {
    server = new Server({
      ...serverConfig,
      handlers
    });
    transport = new StdioServerTransport();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Server Lifecycle', () => {
    test('should initialize server with config', () => {
      expect(server).toBeDefined();
      expect(server).toBeInstanceOf(Server);
    });

    test('should initialize transport', () => {
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(StdioServerTransport);
    });

    test('should have correct configuration', () => {
      expect(serverConfig.name).toBe('zillow-mcp-server');
      expect(serverConfig.version).toBe('1.0.0');
      expect(serverConfig.tools).toHaveLength(2);
    });
  });

  describe('Tool Registration', () => {
    test('should register Zillow search tool', async () => {
      const { tools } = await handlers.list_tools();
      const searchTool = tools.find(t => t.name === 'zillow_search') as Tool;
      expect(searchTool).toBeDefined();
      expect(searchTool.description).toBeDefined();
      expect(searchTool.inputSchema.type).toBe('object');
      expect(searchTool.inputSchema.required).toContain('location');
    });

    test('should register Zillow property details tool', async () => {
      const { tools } = await handlers.list_tools();
      const detailsTool = tools.find(t => t.name === 'zillow_property_details') as Tool;
      expect(detailsTool).toBeDefined();
      expect(detailsTool.description).toBeDefined();
      expect(detailsTool.inputSchema.type).toBe('object');
      expect(detailsTool.inputSchema.required).toContain('zpid');
    });
  });

  describe('Tool Execution', () => {
    test('should handle valid search with all parameters', async () => {
      const params = {
        location: 'Seattle, WA',
        minPrice: 500000,
        maxPrice: 1000000,
        beds: 3,
        baths: 2,
        propertyType: 'house'
      };

      const response = await handlers.call_tool({
        name: 'zillow_search',
        parameters: params
      }) as Property[];

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    test('should handle search with only required parameters', async () => {
      const params = {
        location: 'Seattle, WA'
      };

      const response = await handlers.call_tool({
        name: 'zillow_search',
        parameters: params
      }) as Property[];

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    test('should handle property details request', async () => {
      const params = {
        zpid: '12345'
      };

      const response = await handlers.call_tool({
        name: 'zillow_property_details',
        parameters: params
      }) as PropertyDetails;

      expect(response).toBeNull(); // Currently returns null as it's a placeholder
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid tool name', async () => {
      await expect(handlers.call_tool({
        name: 'invalid_tool',
        parameters: {}
      })).rejects.toThrow(McpError);
    });

    test('should handle missing required search parameters', async () => {
      await expect(handlers.call_tool({
        name: 'zillow_search',
        parameters: {
          minPrice: 500000 // missing required 'location'
        }
      })).rejects.toThrow('Location is required');
    });

    test('should handle missing required property details parameters', async () => {
      await expect(handlers.call_tool({
        name: 'zillow_property_details',
        parameters: {}
      })).rejects.toThrow('Zillow property ID (zpid) is required');
    });

    test('should handle invalid parameter types', async () => {
      await expect(handlers.call_tool({
        name: 'zillow_search',
        parameters: {
          location: 'Seattle, WA',
          minPrice: 'invalid' // should be a number
        }
      })).rejects.toThrow();
    });
  });

  describe('Transport Handling', () => {
    test('should create transport instance', () => {
      expect(transport).toBeDefined();
      expect(transport.constructor.name).toBe('StdioServerTransport');
    });

    test('should have required transport methods', () => {
      expect(typeof transport.start).toBe('function');
    });
  });
});