import { handleZillowSearch } from '../../src/tools.js';

describe('handleZillowSearch error handling', () => {
  it('returns validation error for missing location', async () => {
    const params = { search: {}, pagination: {} };
    const result = await handleZillowSearch(params as any);
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('validation_error');
    expect(result.error.message).toMatch(/Location is required/);
  });

  it('returns validation error for wrong type', async () => {
    const params = { search: { location: 123 }, pagination: {} };
    const result = await handleZillowSearch(params as any);
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('validation_error');
    expect(result.error.message).toMatch(/location must be a string/);
  });

  it('returns robots.txt disallowed error', async () => {
    // Mock RobotsHandler to disallow path
    jest.resetModules();
    jest.doMock('../../src/utils/robots.js', () => ({
      RobotsHandler: jest.fn().mockImplementation(() => ({
        fetchRobotsTxt: jest.fn().mockResolvedValue(undefined),
        isPathAllowed: jest.fn().mockResolvedValue(false)
      }))
    }));
    const { handleZillowSearch: mockedHandleZillowSearch } = await import('../../src/tools.js');
    const params = { search: { location: 'NYC' }, pagination: {} };
    const result = await mockedHandleZillowSearch(params as any);
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('robots_disallowed');
    expect(result.error.message).toMatch(/disallowed by Zillow's robots\.txt/);
  });

  it('returns success for valid input and allowed robots.txt', async () => {
    // Mock RobotsHandler to allow path
    jest.resetModules();
    jest.doMock('../../src/utils/robots.js', () => ({
      RobotsHandler: jest.fn().mockImplementation(() => ({
        fetchRobotsTxt: jest.fn().mockResolvedValue(undefined),
        isPathAllowed: jest.fn().mockResolvedValue(true)
      }))
    }));
    const { handleZillowSearch: mockedHandleZillowSearch } = await import('../../src/tools.js');
    const params = { search: { location: 'NYC' }, pagination: {} };
    const result = await mockedHandleZillowSearch(params as any);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });
});
