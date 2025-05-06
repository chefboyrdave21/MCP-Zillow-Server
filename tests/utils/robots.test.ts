import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { RobotsHandler, RobotsParser } from '../../src/utils/robots';

// Remove node-fetch import and mock
// import fetch, { Response } from 'node-fetch';
// jest.mock('node-fetch', ...);
// const mockFetch = jest.mocked(fetch);

describe('RobotsHandler', () => {
  const baseUrl = 'https://example.com';
  const userAgent = 'TestBot/1.0';

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn() as jest.MockedFunction<any>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchRobotsTxt', () => {
    test('fetches and caches robots.txt content', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /private/';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new globalThis.Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      const result = await handler.fetchRobotsTxt();
      expect(result).toBe(robotsTxt);
      expect(globalThis.fetch).toHaveBeenCalledWith(`${baseUrl}/robots.txt`, expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': userAgent,
          'Accept-Language': expect.any(String)
        })
      }));
    });

    test('handles fetch error', async () => {
      (globalThis.fetch as jest.MockedFunction<any>).mockRejectedValueOnce(new Error('Network error'));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();

      expect(globalThis.fetch).toHaveBeenCalledWith(`${baseUrl}/robots.txt`, expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': userAgent,
          'Accept-Language': expect.any(String)
        })
      }));
    });

    test('handles non-200 response', async () => {
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();

      expect(globalThis.fetch).toHaveBeenCalledWith(`${baseUrl}/robots.txt`, expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': userAgent,
          'Accept-Language': expect.any(String)
        })
      }));
    });

    test('uses cached content on subsequent calls', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /private/';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();
      await handler.fetchRobotsTxt();

      expect((globalThis.fetch as jest.Mock).mock.calls.length).toBe(1);
    });
  });

  describe('isPathAllowed', () => {
    test('returns true for allowed path', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /private/';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();
      const isAllowed = await handler.isPathAllowed('/public');

      expect(isAllowed).toBe(true);
    });

    test('returns false for disallowed path', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /private/';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();
      const isAllowed = await handler.isPathAllowed('/private/secret');

      expect(isAllowed).toBe(false);
    });
  });

  describe('getCrawlDelay and getWaitTime', () => {
    test('returns correct crawl delay', async () => {
      const robotsTxt = 'User-agent: *\nCrawl-delay: 5';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();
      const delay = await handler.getCrawlDelay();

      expect(delay).toBe(5000);
    });

    test('returns default wait time when no crawl delay specified', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /private/';
      (globalThis.fetch as jest.MockedFunction<any>).mockResolvedValueOnce(new Response(robotsTxt, { status: 200 }));

      const handler = new RobotsHandler(baseUrl, userAgent);
      await handler.fetchRobotsTxt();
      const waitTime = await handler.getWaitTime();

      expect(waitTime).toBe(1000); // Default wait time
    });
  });
});

describe('RobotsParser', () => {
  let parser: RobotsParser;
  const testUrl = 'https://example.com/robots.txt';

  beforeEach(() => {
    parser = new RobotsParser();
  });

  describe('parse', () => {
    it('should parse basic allow/disallow rules', () => {
      const content = `
        User-agent: *
        Allow: /allowed-path
        Disallow: /forbidden-path
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/allowed-path')).toBe(true);
      expect(parser.isAllowed('/forbidden-path')).toBe(false);
    });

    it('should handle multiple user agents', () => {
      const content = `
        User-agent: bot1
        Allow: /path1
        Disallow: /path2

        User-agent: bot2
        Allow: /path2
        Disallow: /path1
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/path1', 'bot1')).toBe(true);
      expect(parser.isAllowed('/path2', 'bot1')).toBe(false);
      expect(parser.isAllowed('/path1', 'bot2')).toBe(false);
      expect(parser.isAllowed('/path2', 'bot2')).toBe(true);
    });

    it('should handle wildcard patterns', () => {
      const content = `
        User-agent: *
        Allow: /*.html
        Disallow: /private/*
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/page.html')).toBe(true);
      expect(parser.isAllowed('/private/file.txt')).toBe(false);
    });

    it('should parse crawl delays', () => {
      const content = `
        User-agent: bot1
        Crawl-delay: 5

        User-agent: bot2
        Crawl-delay: 10
      `;
      parser.parse(content, testUrl);
      expect(parser.getCrawlDelay('bot1')).toBe(5);
      expect(parser.getCrawlDelay('bot2')).toBe(10);
    });

    it('should handle sitemaps', () => {
      const content = `
        User-agent: *
        Sitemap: https://example.com/sitemap1.xml
        Sitemap: https://example.com/sitemap2.xml
      `;
      parser.parse(content, testUrl);
      expect(parser.getSitemaps()).toEqual([
        'https://example.com/sitemap1.xml',
        'https://example.com/sitemap2.xml'
      ]);
    });

    it('should handle empty or malformed content', () => {
      parser.parse('', testUrl);
      expect(parser.isAllowed('/any-path')).toBe(true);

      parser.parse('Invalid:Content\nNot:Valid', testUrl);
      expect(parser.isAllowed('/any-path')).toBe(true);
    });

    it('should handle comments and empty lines', () => {
      const content = `
        # This is a comment
        User-agent: *
        
        # Another comment
        Allow: /path
        
        Disallow: /private
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/path')).toBe(true);
      expect(parser.isAllowed('/private')).toBe(false);
    });

    it('should handle case insensitivity in user agents', () => {
      const content = `
        User-agent: TestBot
        Allow: /path
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/path', 'testbot')).toBe(true);
      expect(parser.isAllowed('/path', 'TESTBOT')).toBe(true);
    });

    it('should handle pattern matching edge cases', () => {
      const content = `
        User-agent: *
        Allow: /path?param=*
        Disallow: /*.pdf
        Allow: /special/*.html
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/path?param=value')).toBe(true);
      expect(parser.isAllowed('/document.pdf')).toBe(false);
      expect(parser.isAllowed('/special/page.html')).toBe(true);
    });

    it('should handle URL query parameters', () => {
      const content = `
        User-agent: *
        Allow: /search?q=*
        Disallow: /search?private=*
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/search?q=test')).toBe(true);
      expect(parser.isAllowed('/search?private=true')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle invalid URLs in sitemaps', () => {
      const content = `
        Sitemap: not-a-url
        Sitemap: https://valid-url.com/sitemap.xml
      `;
      parser.parse(content, testUrl);
      expect(parser.getSitemaps()).toEqual(['https://valid-url.com/sitemap.xml']);
    });

    it('should handle invalid crawl delay values', () => {
      const content = `
        User-agent: *
        Crawl-delay: invalid
        Crawl-delay: 5
      `;
      parser.parse(content, testUrl);
      expect(parser.getCrawlDelay('*')).toBe(5);
    });

    it('should handle malformed user agent blocks', () => {
      const content = `
        User-agent: bot1
        Allow: /path1
        User-agent: bot2
        User-agent: bot3
        Disallow: /path2
      `;
      parser.parse(content, testUrl);
      expect(parser.isAllowed('/path1', 'bot1')).toBe(true);
      expect(parser.isAllowed('/path2', 'bot3')).toBe(false);
    });
  });
});
