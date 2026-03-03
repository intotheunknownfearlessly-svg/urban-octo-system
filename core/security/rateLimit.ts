type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, opts?: { capacity?: number; refillPerSec?: number }) {
  const capacity = opts?.capacity ?? 30; // burst
  const refillPerSec = opts?.refillPerSec ?? 1; // steady

  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: capacity, updatedAt: now };
  const elapsed = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillPerSec);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec: Math.ceil((1 - bucket.tokens) / refillPerSec) };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, retryAfterSec: 0 };
}
