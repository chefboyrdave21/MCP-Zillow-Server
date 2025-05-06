const robotsParser = require('robots-parser');

export class RobotsHandler {
  private baseUrl: string;
  private userAgent: string;
  private robotsTxtContent: string = '';
  private robots: any = null;

  constructor(baseUrl: string, userAgent: string) {
    this.baseUrl = baseUrl;
    this.userAgent = userAgent;
  }

  /**
   * Fetches and caches robots.txt content for the base URL.
   * Returns the robots.txt content string.
   */
  async fetchRobotsTxt(): Promise<string> {
    try {
      const response = await globalThis.fetch(`${this.baseUrl}/robots.txt`);
      this.robotsTxtContent = await response.text();
      this.robots = robotsParser(this.baseUrl, this.robotsTxtContent);
      return this.robotsTxtContent;
    } catch (error) {
      this.robotsTxtContent = '';
      this.robots = null;
      return '';
    }
  }

  /**
   * Checks if a path is allowed for the configured user agent.
   * Returns true if allowed, false if disallowed, or true if robots.txt could not be fetched/parsed.
   */
  isPathAllowed(path: string): boolean {
    if (!this.robots) return true;
    try {
      return this.robots.isAllowed(path, this.userAgent);
    } catch {
      return true;
    }
  }

  /**
   * Returns the crawl delay in milliseconds for the user agent, or undefined if not set.
   */
  getCrawlDelay(): number | undefined {
    if (!this.robots) return undefined;
    const delay = this.robots.getCrawlDelay(this.userAgent);
    return typeof delay === 'number' ? delay * 1000 : undefined;
  }

  /**
   * Returns the crawl delay in ms if set, otherwise returns 1000.
   */
  getWaitTime(): number {
    const delay = this.getCrawlDelay();
    return typeof delay === 'number' ? delay : 1000;
  }
}
