# Zillow MCP Server

A Model Context Protocol (MCP) server for searching Zillow properties and retrieving detailed property information. This server provides a standardized interface for AI agents to interact with Zillow's real estate data.

## Features

- 🏠 Search properties by location, price range, bedrooms, bathrooms, and more
- 📊 Get detailed property information including price history and tax data
- 🤖 Respects robots.txt rules by default (configurable per request)
- 🚀 Built with TypeScript for type safety
- ⚡ Fast HTML parsing with Cheerio
- 📝 Structured JSON responses
- ⏱️ Built-in rate limiting and robots.txt crawl-delay support
- 🔄 Pagination support
- 🧪 Comprehensive test coverage (80%+)
- 🧩 Modular codebase with clear separation of concerns
- 🛠️ Task Master workflow for AI-driven development and traceable task management

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager

### For Users

Install globally to use with Claude Desktop or other AI agents:

```bash
npm install -g @mcp/server-zillow
```

Or use directly with npx:

```bash
npx @mcp/server-zillow
```

### For Developers

Clone and install dependencies:

```bash
git clone https://github.com/your-username/mcp-server-zillow.git
cd mcp-server-zillow
npm install
```

Build the project:

```bash
npm run build
```

## Configuration

### Claude Desktop Setup

1. Go to: Settings > Developer > Edit Config

2. Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zillow": {
      "command": "npx",
      "args": [
        "-y",
        "@mcp/server-zillow"
      ]
    }
  }
}
```

To ignore robots.txt rules (use with caution):

```json
{
  "mcpServers": {
    "zillow": {
      "command": "npx",
      "args": [
        "-y",
        "@mcp/server-zillow",
        "--ignore-robots-txt"
      ]
    }
  }
}
```

### n8n Integration

To use this MCP server with n8n during local development:

1. Build the package:
```bash
cd mcp-server-zillow
npm run build
```

2. In n8n, add a new "MCP Client" node to your workflow

3. Create new credentials with these settings:
   - **Transport Type**: STDIO
   - **Command**: `node`
   - **Arguments**: `/path/to/mcp-server-zillow/dist/src/index.js`

   Replace `/path/to` with the absolute path to your project directory.
   
   **Troubleshooting:**
   - If you see `require is not defined in ES module scope`, make sure you are using the correct path (`dist/src/index.js`) and that your `package.json` has `"type": "module"`.
   - Ensure all environment variables (e.g., API keys) are available to the n8n process. If running n8n in Docker or another environment, copy your `.env` file or set variables accordingly.

4. Available Tools:
   - `zillow_search`: Search for properties
   - `zillow_property_details`: Get detailed property information

## Available Tools

### 1. zillow_search

Search for properties with various filters.

**Required Parameters:**
- `location` (string): Location to search for (city, state, zip code, etc.)

**Optional Parameters:**
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `beds` (number): Number of bedrooms
- `baths` (number): Number of bathrooms
- `homeType` (string): Type of property (house, apartment, condo, etc.)
- `cursor` (string): Pagination cursor for next page of results
- `ignoreRobotsText` (boolean): Override robots.txt rules for this request

**Example Response:**
```json
{
  "results": [
    {
      "zpid": "12345678",
      "address": "123 Main St, City, State 12345",
      "price": 500000,
      "beds": 3,
      "baths": 2,
      "sqft": 2000,
      "homeType": "Single Family",
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  ],
  "nextCursor": "abc123xyz",
  "totalResults": 150
}
```

### 2. zillow_property_details

Get detailed information about a specific property.

**Required Parameters:**
- `zpid` (string): Zillow Property ID

**Optional Parameters:**
- `ignoreRobotsText` (boolean): Override robots.txt rules for this request

**Example Response:**
```json
{
  "basic": {
    "zpid": "12345678",
    "address": "123 Main St, City, State 12345",
    "price": 500000,
    "beds": 3,
    "baths": 2,
    "sqft": 2000,
    "lotSize": 5000,
    "yearBuilt": 1990,
    "homeType": "Single Family"
  },
  "description": "Beautiful home with modern updates...",
  "features": ["Central Air", "Garage", "Fireplace"],
  "priceHistory": [
    {
      "date": "2023-01-15",
      "price": 495000,
      "event": "Listed"
    }
  ],
  "taxHistory": [
    {
      "year": 2023,
      "amount": 5000
    }
  ],
  "schools": [
    {
      "name": "Local Elementary",
      "rating": 8,
      "distance": 0.5
    }
  ]
}
```

## Development

### Available Scripts

- `npm run build` - Build the TypeScript project
- `npm run start` - Start the server
- `npm run dev` - Start the server in development mode with hot reload
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests

### Project Structure

```
mcp-server-zillow/
├── src/
│   ├── index.ts        # Server entry point
│   └── utils/
│       └── robots.ts   # Robots.txt handling
├── tests/
│   ├── index.test.ts
│   └── utils/
│       └── robots.test.ts
├── dist/               # Compiled JavaScript
└── package.json
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Error Handling

The server returns structured error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message.",
    "details": { /* optional, context-specific */ }
  }
}
```

Common error codes:
- `INVALID_PARAMETERS` - Missing or invalid input parameters
- `RATE_LIMIT_EXCEEDED` - Too many requests in a short time
- `ROBOTS_TXT_DISALLOWED` - Path is disallowed by robots.txt
- `NOT_FOUND` - Property or resource not found
- `PARSING_ERROR` - Error parsing Zillow's HTML response
- `VALIDATION_ERROR` - Data failed schema validation
- `API_ERROR` - Upstream or network error
- `CACHE_MISS` - Requested data not found in cache

## Rate Limiting & Robots.txt Compliance

The server implements rate limiting and robots.txt compliance:
1. Respects Zillow's robots.txt crawl-delay directive (per user-agent)
2. Built-in safeguards to prevent aggressive scraping
3. Per-request override for robots.txt (for development/testing)

Default limits:
- Maximum 1 request per second (configurable)
- Respects crawl-delay if specified in robots.txt
- Automatic retry with exponential backoff
- Returns a structured error if robots.txt disallows a request (unless overridden)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Legal Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Zillow Group. Zillow® is a registered trademark of Zillow, Inc. Use of this server should comply with Zillow's terms of service and robots.txt directives.

## Support

For bugs and feature requests, please [open an issue](https://github.com/your-username/mcp-server-zillow/issues).