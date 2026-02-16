import type { AuditAction, AuditTargetType } from "../../../common/prisma/generated/enums.js"
import type { Prisma } from "../../../common/prisma/generated/client.js"

export type CreateAuditLog = {
  orgId: string
  action: AuditAction
  actorUserId?: string
  targetType?: AuditTargetType
  targetId?: string
  ip?: string
  userAgent?: string
  metadata?: Prisma.InputJsonValue
}

export type FindAuditLogsByOrg = {
  orgId: string
  byUserId: string
  page: number
  limit: number
  action?: AuditAction
  targetType?: AuditTargetType
  targetId?: string
}
