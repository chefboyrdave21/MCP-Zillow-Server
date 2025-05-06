import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL } from '@app/tools.js';
import type { CallToolParams } from '@modelcontextprotocol/sdk/server/types';

export interface TestServerConfig {
  tools?: boolean;
  transport?: boolean;
}

export const createTestServer = async (config: TestServerConfig = { tools: true, transport: true }) => {
  const server = new Server({
    name: 'mcp-server-zillow-test',
    version: '1.0.0',
    capabilities: {},
    tools: config.tools ? [ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL] : [],
    handlers: {
      list_tools: async () => ({
        tools: config.tools ? [ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL] : []
      }),
      call_tool: async (params: CallToolParams) => {
        throw new Error('Tool execution not mocked');
      }
    }
  });

  if (config.transport) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }

  return server;
}; 