import type { AuditLog } from "../../../../common/prisma/generated/client.js"

export const AuditLogDto = {
  from(log: AuditLog) {
    return {
      id: log.id,
      orgId: log.orgId,
      action: log.action,
      actorUserId: log.actorUserId,
      actorType: log.actorType,
      targetType: log.targetType,
      targetId: log.targetId,
      ip: log.ip,
      userAgent: log.userAgent,
      metadata: log.metadata,
      createdAt: log.createdAt,
    }
  },
}
