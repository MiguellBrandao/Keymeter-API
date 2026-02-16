import type { NextFunction, Request, Response } from "express"
import type { ZodType } from "zod"
import { AppError } from "../errors/AppError.js"

export const validateQuery =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    if (req.query == null || typeof req.query !== "object") {
      throw new AppError({
        httpStatus: 400,
        message: "Request query must be a valid object.",
      })
    }

    const result = schema.safeParse(req.query)

    if (!result.success) {
      throw new AppError({
        httpStatus: 400,
        message: "Invalid request query.",
        details: { issues: result.error.issues },
      })
    }

    ;(req as any).validatedQuery = result.data
    next()
  }
