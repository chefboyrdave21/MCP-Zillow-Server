import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Server } from '@modelcontextprotocol/sdk';
import { mockFetch, createMockResponse } from '../setup.js';

describe('Example Integration Test', () => {
  let server: Server;

  beforeEach(() => {
    // Initialize server before each test
    server = new Server({
      name: 'test-server',
      version: '1.0.0',
      capabilities: {}
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  it('should demonstrate server initialization and tool registration', () => {
    const testTool = {
      name: 'test_tool',
      description: 'A test tool',
      parameters: {
        type: 'object',
        properties: {
          test: { type: 'string' }
        },
        required: ['test']
      }
    };

    server.registerTool(testTool);
    const tools = server.listTools();

    expect(tools).toHaveLength(1);
    expect(tools[0]).toEqual(testTool);
  });

  it('should demonstrate tool execution with mocked API call', async () => {
    const mockData = { result: 'success' };
    mockFetch.mockResolvedValueOnce(createMockResponse({ data: mockData }));

    const testTool = {
      name: 'test_tool',
      description: 'A test tool',
      parameters: {
        type: 'object',
        properties: {
          test: { type: 'string' }
        },
        required: ['test']
      },
      handler: async () => {
        const response = await fetch('https://api.example.com/test');
        return response.json();
      }
    };

    server.registerTool(testTool);
    const result = await server.executeTool('test_tool', { test: 'value' });

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test');
    expect(result).toEqual(mockData);
  });
}); 