import { z } from "zod"

const toInt = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") return Number(value)
  return value
}

const toDate = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") return new Date(value)
  return value
}

export const FindUsageQuerySchema = z.object({
  apiKeyId: z.uuid().optional(),
  from: z.preprocess(toDate, z.date()).optional(),
  to: z.preprocess(toDate, z.date()).optional(),
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
})

export type FindUsageQueryDto = z.infer<typeof FindUsageQuerySchema>

