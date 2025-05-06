import { ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL, handleZillowSearch, handleZillowPropertyDetails } from '../tools';

const toolRegistry = {
  zillow_search: {
    schema: ZILLOW_SEARCH_TOOL.inputSchema,
    handler: handleZillowSearch
  },
  zillow_property_details: {
    schema: ZILLOW_PROPERTY_DETAILS_TOOL.inputSchema,
    handler: handleZillowPropertyDetails
  }
};

/**
 * Executes a registered tool by name with parameter validation and error handling.
 * @param toolName - Name of the tool to execute
 * @param params - Parameters to pass to the tool
 * @returns Tool response or error object
 */
export async function executeTool(toolName: string, params: any): Promise<any> {
  const entry = toolRegistry[toolName as keyof typeof toolRegistry];
  if (!entry) {
    return { error: `Tool '${toolName}' not found.` };
  }
  // TODO: Integrate robust schema validation (e.g., with zod or ajv)
  try {
    return await entry.handler(params);
  } catch (err: any) {
    return { error: err.message || 'Unknown error', details: err };
  }
}
