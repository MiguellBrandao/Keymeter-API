import { AppError } from "../../../common/errors/AppError.js"
import { Role } from "../../../common/prisma/generated/enums.js"
import type { PrismaClient } from "../../../common/prisma/generated/client.js"
import type { AuditRepository } from "./audit.repository.js"
import type { CreateAuditLog, FindAuditLogsByOrg } from "./audit.types.js"

export class AuditService {
  constructor(
    private prisma: PrismaClient,
    private auditRepository: AuditRepository
  ) {}

  async log(data: CreateAuditLog) {
    return await this.auditRepository.create(data)
  }

  private async ensureCanReadAudit(orgId: string, byUserId: string) {
    const membership = await this.prisma.memberShip.findUnique({
      where: { orgId_userId: { orgId, userId: byUserId } },
    })

    if (!membership) {
      throw new AppError({
        httpStatus: 403,
        message: "You are not a member of this organization.",
      })
    }

    if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new AppError({
        httpStatus: 403,
        message: "Only organization admins or owners can view audit logs.",
      })
    }
  }

  async findByOrg(data: FindAuditLogsByOrg) {
    await this.ensureCanReadAudit(data.orgId, data.byUserId)
    return await this.auditRepository.findByOrg(data)
  }
}
