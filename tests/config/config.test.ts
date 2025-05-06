import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { loadConfig, type Config } from '../../src/config.js';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('loads default configuration when no env vars are set', () => {
    const config = loadConfig();
    expect(config).toBeDefined();
    expect(config.port).toBe(3000);
    expect(config.logLevel).toBe('info');
  });

  test('overrides defaults with environment variables', () => {
    process.env.PORT = '4000';
    process.env.LOG_LEVEL = 'debug';
    
    const config = loadConfig();
    expect(config.port).toBe(4000);
    expect(config.logLevel).toBe('debug');
  });

  test('validates configuration values', () => {
    process.env.PORT = 'invalid';
    
    expect(() => loadConfig()).toThrow('Invalid port configuration');
  });

  test('loads configuration from environment variables', () => {
    process.env.ZILLOW_API_KEY = 'test-key';
    
    const config = loadConfig();
    expect(config.zillowApiKey).toBe('test-key');
  });

  test('throws error if required environment variables are missing', () => {
    delete process.env.ZILLOW_API_KEY;
    
    expect(() => loadConfig()).toThrow('ZILLOW_API_KEY environment variable is required');
  });
}); 