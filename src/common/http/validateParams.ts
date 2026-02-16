import type { NextFunction, Request, Response } from "express"
import type { ZodType } from "zod"
import { AppError } from "../errors/AppError.js"

export const validateParams =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    if (req.params == null || typeof req.params !== "object") {
      throw new AppError({
        httpStatus: 400,
        message: "Request params must be a valid object.",
      })
    }

    const result = schema.safeParse(req.params)

    if (!result.success) {
      throw new AppError({
        httpStatus: 400,
        message: "Invalid request params.",
        details: { issues: result.error.issues },
      })
    }

    ;(req as any).validatedParams = result.data
    next()
  }
