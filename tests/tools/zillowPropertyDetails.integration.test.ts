import { zillowPropertyDetailsTool } from '../../src/tools/zillowPropertyDetails';

describe('zillowPropertyDetailsTool', () => {
  it('returns structured property details for valid ZPID', async () => {
    const result = await zillowPropertyDetailsTool('12345678');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    // Add more assertions as needed
  });

  it('throws for invalid ZPID', async () => {
    await expect(zillowPropertyDetailsTool('abc123')).rejects.toThrow('Invalid ZPID');
    await expect(zillowPropertyDetailsTool('')).rejects.toThrow('Invalid ZPID');
  });

  // Add more tests for robots.txt, network, and parsing errors as the implementation is completed
});
