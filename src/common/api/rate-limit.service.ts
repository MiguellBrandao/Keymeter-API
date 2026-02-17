import { redis } from "../redis/client.js";

const LIMIT = Number(process.env.RATE_LIMIT_EVENTS_PER_HOUR ?? "100");
const FAIL_OPEN = (process.env.RATE_LIMIT_FAIL_OPEN ?? "true") === "true";

function hourKey(orgId: string, apiKeyId: string, now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const h = String(now.getUTCHours()).padStart(2, "0");
  return `km:rl:h:${orgId}:${apiKeyId}:${y}${m}${d}${h}`;
}

function nextHourEpoch(now = new Date()) {
  const next = new Date(now);
  next.setUTCMinutes(60, 0, 0);
  return Math.floor(next.getTime() / 1000);
}

function ttlToNextHour(now = new Date()) {
  const reset = new Date(now);
  reset.setUTCMinutes(60, 0, 0);
  return Math.max(1, Math.ceil((reset.getTime() - now.getTime()) / 1000) + 120);
}

export async function consumeEventRateLimit(orgId: string, apiKeyId: string) {
  const now = new Date();
  const key = hourKey(orgId, apiKeyId, now);
  const ttl = ttlToNextHour(now);

  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, ttl);

    const allowed = count <= LIMIT;
    return {
      allowed,
      limit: LIMIT,
      remaining: Math.max(0, LIMIT - count),
      resetAt: nextHourEpoch(now),
    };
  } catch (err) {
    if (FAIL_OPEN) {
      return { allowed: true, limit: LIMIT, remaining: LIMIT, resetAt: nextHourEpoch(now) };
    }
    throw err;
  }
}
