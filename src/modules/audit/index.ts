import type { PrismaClient } from "../../common/prisma/generated/client.js"
import { PrismaAuditRepository } from "./domain/audit.repository.js"
import { AuditService } from "./domain/audit.service.js"
import { AuditController } from "./http/audit.controller.js"
import { AuditRoutes } from "./http/audit.routes.js"

export const buildAuditModule = (prisma: PrismaClient) => {
  const auditRepository = new PrismaAuditRepository(prisma)
  const auditService = new AuditService(prisma, auditRepository)
  const auditController = new AuditController(auditService)

  return AuditRoutes(auditController)
}

export const buildAuditService = (prisma: PrismaClient) => {
  const auditRepository = new PrismaAuditRepository(prisma)
  return new AuditService(prisma, auditRepository)
}
