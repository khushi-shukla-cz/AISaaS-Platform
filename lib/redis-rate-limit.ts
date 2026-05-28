import { Redis } from 'redis';

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

let redisClient: Redis | null = null;

async function getRedisClient(): Promise<Redis> {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = new Redis(url);

  redisClient.on('error', (err) => console.error('Redis error:', err));
  await redisClient.ping();

  return redisClient;
}

export async function checkRateLimitRedis(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const client = await getRedisClient();
    const now = Date.now();
    const windowKey = `ratelimit:${key}`;
    const resetAt = now + windowMs;

    const [count, ttl] = await Promise.all([
      client.incr(windowKey),
      client.ttl(windowKey),
    ]);

    if (count === 1) {
      await client.pexpire(windowKey, windowMs);
    }

    const allowed = count <= limit;
    const getResetAt = ttl === -1 ? resetAt : now + ttl * 1000;

    return {
      allowed,
      remaining: Math.max(0, limit - count),
      resetAt: getResetAt,
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    return {
      allowed: true,
      remaining: limit,
      resetAt: Date.now() + windowMs,
    };
  }
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
