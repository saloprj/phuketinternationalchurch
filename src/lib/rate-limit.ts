import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number; // milliseconds
  maxRequests: number;
};

const caches = new Map<string, LRUCache<string, number[]>>();

function getCache(name: string, maxSize = 500) {
  if (!caches.has(name)) {
    caches.set(
      name,
      new LRUCache<string, number[]>({
        max: maxSize,
        ttl: 60 * 60 * 1000, // 1 hour TTL
      })
    );
  }
  return caches.get(name)!;
}

export function rateLimit(name: string, options: RateLimitOptions) {
  const cache = getCache(name);

  return {
    check(ip: string): { success: boolean; remaining: number; reset: number } {
      const now = Date.now();
      const windowStart = now - options.interval;
      const hits = (cache.get(ip) || []).filter((time) => time > windowStart);

      if (hits.length >= options.maxRequests) {
        const oldestHit = hits[0];
        const reset = oldestHit + options.interval;
        return { success: false, remaining: 0, reset };
      }

      hits.push(now);
      cache.set(ip, hits);

      return {
        success: true,
        remaining: options.maxRequests - hits.length,
        reset: now + options.interval,
      };
    },
  };
}

// Pre-configured rate limiters
export const contactFormLimiter = rateLimit('contact', {
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,
});

export const prayerLimiter = rateLimit('prayer', {
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
});

export const adminLoginLimiter = rateLimit('admin-login', {
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
});

export const translateLimiter = rateLimit('translate', {
  interval: 60 * 1000, // 1 minute
  maxRequests: 20,
});
