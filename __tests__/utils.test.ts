import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';
import { getPaginationParams, createPaginatedResult } from '@/lib/pagination';

describe('RateLimit', () => {
  it('should allow requests under limit', () => {
    const result = checkRateLimit('test-key', 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('should reject requests over limit', () => {
    const key = 'test-key-2';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60000);
    }
    const result = checkRateLimit(key, 5, 60000);
    expect(result.allowed).toBe(false);
  });
});

describe('Pagination', () => {
  it('should parse pagination params correctly', () => {
    const params = getPaginationParams({ page: '2', limit: '50' });
    expect(params.page).toBe(2);
    expect(params.limit).toBe(50);
  });

  it('should cap limit at 100', () => {
    const params = getPaginationParams({ limit: '200' });
    expect(params.limit).toBe(100);
  });

  it('should create paginated result', () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const result = createPaginatedResult(items, 100, 1, 20);

    expect(result.items.length).toBe(20);
    expect(result.total).toBe(100);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPrevPage).toBe(false);
  });
});
