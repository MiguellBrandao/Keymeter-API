import type { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/AppError.js"

export function requireApiKeyScope(scope: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const apiKey = req.apiKey
    if (!apiKey) {
      throw new AppError({
        httpStatus: 401,
        message: "Unauthorized",
      })
    }

    if (!apiKey.scopes.includes(scope)) {
      throw new AppError({
        httpStatus: 403,
        message: `Missing required scope: ${scope}`,
      })
    }

    next()
  }
}

