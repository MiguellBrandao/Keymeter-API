import type { AuditLog, Prisma, PrismaClient } from "../../../common/prisma/generated/client.js"
import type { CreateAuditLog, FindAuditLogsByOrg } from "./audit.types.js"

export type Paginated<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  pages: number
}

export interface AuditRepository {
  create(data: CreateAuditLog): Promise<AuditLog>
  findByOrg(data: FindAuditLogsByOrg): Promise<Paginated<AuditLog>>
}

export class PrismaAuditRepository implements AuditRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: CreateAuditLog): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data })
  }

  async findByOrg(data: FindAuditLogsByOrg): Promise<Paginated<AuditLog>> {
    const page = Math.max(1, data.page)
    const limit = Math.min(Math.max(1, data.limit), 100)
    const skip = (page - 1) * limit

    const where: Prisma.AuditLogWhereInput = { orgId: data.orgId }
    if (data.action !== undefined) where.action = data.action
    if (data.targetType !== undefined) where.targetType = data.targetType
    if (data.targetId !== undefined) where.targetId = data.targetId

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ])

    return {
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  }
}
