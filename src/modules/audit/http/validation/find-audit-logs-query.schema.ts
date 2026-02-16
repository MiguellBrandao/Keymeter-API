import { z } from "zod"
import { AuditAction, AuditTargetType } from "../../../../common/prisma/generated/enums.js"

const toInt = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") return Number(value)
  return value
}

export const FindAuditLogsQuerySchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
  action: z.enum(AuditAction).optional(),
  targetType: z.enum(AuditTargetType).optional(),
  targetId: z.string().trim().min(1).optional(),
})

export type FindAuditLogsQueryDto = z.infer<typeof FindAuditLogsQuerySchema>
