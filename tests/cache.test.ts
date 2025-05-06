import { Cache, generateCacheKey } from '../src/cache';

describe('Cache', () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache({ stdTTL: 2 }); // 2 seconds for fast expiry
    cache.clear();
  });

  it('should set and get a value', () => {
    cache.set('foo', 123);
    expect(cache.get('foo')).toBe(123);
  });

  it('should return undefined for missing key', () => {
    expect(cache.get('missing')).toBeUndefined();
  });

  it('should expire values after TTL', (done) => {
    cache.set('bar', 'baz', 1); // 1 second TTL
    setTimeout(() => {
      expect(cache.get('bar')).toBeUndefined();
      done();
    }, 1100);
  });

  it('should delete a key', () => {
    cache.set('delme', 42);
    cache.del('delme');
    expect(cache.get('delme')).toBeUndefined();
  });

  it('should clear all keys', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});

describe('generateCacheKey', () => {
  it('should generate a stable key for the same object', () => {
    const obj1 = { b: 2, a: 1 };
    const obj2 = { a: 1, b: 2 };
    expect(generateCacheKey(obj1)).toBe(generateCacheKey(obj2));
  });

  it('should generate different keys for different objects', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    expect(generateCacheKey(obj1)).not.toBe(generateCacheKey(obj2));
  });
});
