import type { NextFunction, Request, Response } from "express"
import { verifyValue } from "../auth/bcrypt.js"
import { AppError } from "../errors/AppError.js"
import { prisma } from "../prisma/client.js"

const API_KEY_PREFIX_PATTERN = /^km_live_[A-Za-z0-9_-]{8}$/

function extractRawApiKey(req: Request): string | null {
  const apiKeyHeader = req.header("x-api-key")
  if (apiKeyHeader && apiKeyHeader.trim().length > 0) return apiKeyHeader.trim()

  const auth = req.header("authorization")
  if (!auth) return null
  if (!auth.startsWith("ApiKey ")) return null

  const value = auth.slice("ApiKey ".length).trim()
  return value.length > 0 ? value : null
}

export async function requireApiKey(req: Request, _res: Response, next: NextFunction) {
  const rawApiKey = extractRawApiKey(req)
  if (!rawApiKey) {
    throw new AppError({
      httpStatus: 401,
      message: "Missing API key.",
    })
  }

  const splitIndex = rawApiKey.indexOf(".")
  if (splitIndex <= 0 || splitIndex === rawApiKey.length - 1) {
    throw new AppError({
      httpStatus: 401,
      message: "Invalid API key format.",
    })
  }

  const keyPrefix = rawApiKey.slice(0, splitIndex)
  if (!API_KEY_PREFIX_PATTERN.test(keyPrefix)) {
    throw new AppError({
      httpStatus: 401,
      message: "Invalid API key format.",
    })
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyPrefix },
    select: {
      id: true,
      orgId: true,
      keyHash: true,
      revokedAt: true,
      scopes: true,
      name: true,
    },
  })

  if (!apiKey || apiKey.revokedAt) {
    throw new AppError({
      httpStatus: 401,
      message: "Invalid API key.",
    })
  }

  const isValid = await verifyValue(rawApiKey, apiKey.keyHash)
  if (!isValid) {
    throw new AppError({
      httpStatus: 401,
      message: "Invalid API key.",
    })
  }

  req.apiKey = {
    id: apiKey.id,
    orgId: apiKey.orgId,
    scopes: apiKey.scopes,
    keyPrefix,
    name: apiKey.name,
  }

  next()
}

