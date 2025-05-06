import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RobotsHandler } from '../utils/robotsHandler';




const BASE_URL = 'https://example.com';
const USER_AGENT = 'TestBot/1.0';

const robotsTxtAllow = 'User-agent: *\nDisallow:';

// Mock globalThis.fetch for all tests
beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});
const robotsTxtDisallow = 'User-agent: *\nDisallow: /private/';
const robotsTxtMalformed = 'Invalid robots content';


describe('RobotsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and caches robots.txt content', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ text: async () => robotsTxtAllow }));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.isPathAllowed('/')).toBe(true);
  });

  it('handles disallowed path', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ text: async () => robotsTxtDisallow }));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.isPathAllowed('/private/secret')).toBe(false);
    expect(handler.isPathAllowed('/public')).toBe(true);
  });

  it('handles fetch error gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.isPathAllowed('/')).toBe(true); // fallback to allowed
  });

  it('handles malformed robots.txt', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ text: async () => robotsTxtMalformed }));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.isPathAllowed('/')).toBe(true); // fallback to allowed
  });

  it('returns crawl delay if set', async () => {
    const robotsTxtWithDelay = 'User-agent: *\nCrawl-delay: 5';
    fetch.mockImplementationOnce(() => Promise.resolve({ text: async () => robotsTxtWithDelay }));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.getCrawlDelay()).toBe(5000);
  });

  it('returns undefined if no crawl delay', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ text: async () => robotsTxtAllow }));
    const handler = new RobotsHandler(BASE_URL, USER_AGENT);
    await handler.fetchRobotsTxt();
    expect(handler.getCrawlDelay()).toBeUndefined();
  });
});
