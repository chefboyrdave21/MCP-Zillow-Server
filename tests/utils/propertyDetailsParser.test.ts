import { parsePropertyDetails } from '../../src/utils/propertyDetailsParser';

const sampleHtml = `
<html>
  <body>
    <h1 data-testid="home-details-summary-headline">123 Main St, Springfield, IL 62704</h1>
    <span data-testid="price">$350,000</span>
    <span data-testid="bed-bath-beyond-bedroom">3 beds</span>
    <span data-testid="bed-bath-beyond-bathroom">2 baths</span>
    <span data-testid="bed-bath-beyond-floorSpace">1,800 sqft</span>
    <span data-testid="bed-bath-beyond-lotSize">7,500 sqft lot</span>
    <span data-testid="year-built-value">1995</span>
    <span data-testid="home-type-chip">Single Family</span>
    <div data-testid="home-description-text">Beautiful home with lots of updates.</div>
    <ul>
      <li data-testid="feature-list-item">Fireplace</li>
      <li data-testid="feature-list-item">Garage</li>
    </ul>
    <table data-testid="price-history-table">
      <tr><td>2021</td><td>$340,000</td></tr>
      <tr><td>2020</td><td>$330,000</td></tr>
    </table>
    <table data-testid="tax-history-table">
      <tr><td>2021</td><td>$5,000</td></tr>
      <tr><td>2020</td><td>$4,800</td></tr>
    </table>
    <div data-testid="media-stream-photo"><img src="/img1.jpg" /></div>
    <div data-testid="media-stream-photo"><img src="/img2.jpg" /></div>
    <a data-testid="virtual-tour-link" href="/tour1">Tour 1</a>
    <meta property="zillow:zpid" content="12345678" />
  </body>
</html>
`;

describe('parsePropertyDetails', () => {
  it('parses all expected fields from sample HTML', () => {
    const details = parsePropertyDetails(sampleHtml);
    expect(details.zpid).toBe('12345678');
    expect(details.address).toBe('123 Main St, Springfield, IL 62704');
    expect(details.price).toBe('$350,000');
    expect(details.beds).toBe('3 beds');
    expect(details.baths).toBe('2 baths');
    expect(details.sqft).toBe('1,800 sqft');
    expect(details.lotSize).toBe('7,500 sqft lot');
    expect(details.yearBuilt).toBe('1995');
    expect(details.propertyType).toBe('Single Family');
    expect(details.description).toBe('Beautiful home with lots of updates.');
    expect(details.features).toEqual(['Fireplace', 'Garage']);
    expect(details.priceHistory.length).toBe(2);
    expect(details.taxHistory.length).toBe(2);
    expect(details.photos).toEqual(['/img1.jpg', '/img2.jpg']);
    expect(details.virtualTours).toEqual(['/tour1']);
  });

  it('handles missing fields gracefully', () => {
    const html = '<html><body><h1 data-testid="home-details-summary-headline">No Price</h1></body></html>';
    const details = parsePropertyDetails(html);
    expect(details.address).toBe('No Price');
    expect(details.price).toBe('');
    expect(details.features).toEqual([]);
    expect(details.priceHistory).toEqual([]);
    expect(details.taxHistory).toEqual([]);
    expect(details.photos).toEqual([]);
    expect(details.virtualTours).toEqual([]);
  });

  it('throws for invalid HTML input', () => {
    expect(() => parsePropertyDetails(undefined as any)).toThrow('Invalid HTML input');
    expect(() => parsePropertyDetails(123 as any)).toThrow('Invalid HTML input');
  });
});
