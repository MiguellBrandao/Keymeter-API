import type { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError.js"
import { verifyAccessToken } from "../auth/jwt.js"

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    throw new AppError({
      httpStatus: 401,
      message: "Missing bearer token.",
    })
  }

  const token = auth.slice("Bearer ".length)

  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload
    next()
  } catch {
    throw new AppError({
      httpStatus: 401,
      message: "Invalid or expired token.",
    })
  }
}
