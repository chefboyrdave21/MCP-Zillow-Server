import { describe, it, expect } from '@jest/globals';
import { executeTool } from '../tools/executeTool';

describe('Integration: executeTool', () => {
  it('executes zillow_search tool (stub)', async () => {
    const result = await executeTool('zillow_search', { search: { location: 'San Francisco, CA' }, pagination: {} });
    expect(Array.isArray(result)).toBe(true);
  });

  it('executes zillow_property_details tool with valid zpid', async () => {
    const result = await executeTool('zillow_property_details', { zpid: '123456' });
    expect(result).toHaveProperty('zpid', '123456');
  });

  it('returns error for missing zpid', async () => {
    const result = await executeTool('zillow_property_details', {});
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toMatch(/zpid/);
  });

  it('returns error for unknown tool', async () => {
    const result = await executeTool('unknown_tool', {});
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toMatch(/not found/);
  });
});
