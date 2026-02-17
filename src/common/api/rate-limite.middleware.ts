import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { consumeEventRateLimit } from "./rate-limit.service.js";

export async function rateLimitEvents(req: Request, res: Response, next: NextFunction) {
  const apiKey = (req as any).apiKey;
  if (!apiKey?.id || !apiKey?.orgId) {
    throw new AppError({ httpStatus: 401, message: "Invalid API key context." });
  }

  const rl = await consumeEventRateLimit(apiKey.orgId, apiKey.id);

  res.setHeader("X-RateLimit-Limit", String(rl.limit));
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
  res.setHeader("X-RateLimit-Reset", String(rl.resetAt));

  if (!rl.allowed) {
    throw new AppError({ httpStatus: 429, message: "Rate limit exceeded." });
  }

  next();
}
