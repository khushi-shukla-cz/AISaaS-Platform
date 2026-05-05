type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __rateLimitStore?: Map<string, RateLimitEntry>;
};

function getStore() {
  if (!globalForRateLimit.__rateLimitStore) {
    globalForRateLimit.__rateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalForRateLimit.__rateLimitStore;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const store = getStore();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  const nextCount = existing.count + 1;
  const allowed = nextCount <= limit;

  if (allowed) {
    existing.count = nextCount;
    store.set(key, existing);
  }

  return {
    allowed,
    remaining: Math.max(0, limit - nextCount),
    resetAt: existing.resetAt,
  };
}
