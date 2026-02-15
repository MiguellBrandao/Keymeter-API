// src/common/http/validateBody.ts
import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"
import { AppError } from "../errors/AppError.js"

export const validateBody =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    if (req.body == null || typeof req.body !== "object") {
      throw new AppError({
        httpStatus: 400,
        message: "Request body must be a valid JSON object.",
      })
    }

    const result = schema.safeParse(req.body)

    if (!result.success) {
      throw new AppError({
        httpStatus: 400,
        message: "Invalid request body.",
        details: result.error.flatten(),
      })
    }

    req.body = result.data
    next()
  }
