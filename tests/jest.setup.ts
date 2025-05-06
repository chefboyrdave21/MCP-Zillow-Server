// Jest setup file
import { jest } from '@jest/globals';

// Increase timeout for all tests
jest.setTimeout(10000);

// Add any global test setup here
beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global cleanup after all tests
});

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here
}); 