import type { Request, Response, NextFunction } from "express"
import { AppError } from "./AppError.js"

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({
      message: err.expose ? err.message : "Internal server error",
      details: err.expose ? err.details : undefined,
    })
  }

  console.error(err)

  return res.status(500).json({
    message: "Internal server error",
  })
}
