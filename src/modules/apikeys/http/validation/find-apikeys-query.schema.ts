import { z } from "zod"

const toInt = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") return Number(value)
  return value
}

export const FindApiKeysQuerySchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
})

export type FindApiKeysQueryDto = z.infer<typeof FindApiKeysQuerySchema>
