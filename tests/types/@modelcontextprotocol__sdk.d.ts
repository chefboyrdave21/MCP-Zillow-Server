// Minimal stub for @modelcontextprotocol/sdk types for test compatibility

declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(config: any);
    registerTool: (tool: any) => void;
    listTools: () => any[];
    executeTool: (name: string, params: any) => Promise<any>;
  }
}

declare module '@modelcontextprotocol/sdk/server/types' {
  export type CallToolParams = any;
}
