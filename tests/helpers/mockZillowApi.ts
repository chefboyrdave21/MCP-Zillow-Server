import { createMockResponse } from '../setup.js';
import type { Property, PropertyDetails } from '../../src/types.js';
import { Headers } from 'node-fetch';

export function createMockSearchResponse(properties: Property[]) {
  const headers = new Headers({ 'content-type': 'application/json' });
  return createMockResponse(properties, { headers });
}

export function createMockPropertyDetailsResponse(details: PropertyDetails) {
  const headers = new Headers({ 'content-type': 'application/json' });
  return createMockResponse(details, { headers });
}

export function createMockErrorResponse(status: number, statusText: string) {
  const headers = new Headers({ 'content-type': 'application/json' });
  return createMockResponse(
    { error: statusText },
    {
      ok: false,
      status,
      statusText,
      headers
    }
  );
} 