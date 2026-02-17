import { AppError } from "../../../common/errors/AppError.js"
import { Role } from "../../../common/prisma/generated/enums.js"
import type { Prisma, PrismaClient } from "../../../common/prisma/generated/client.js"
import type { FindUsageByOrg } from "./usage.types.js"

export class UsageService {
  constructor(private prisma: PrismaClient) {}

  private async ensureCanReadUsage(orgId: string, byUserId: string) {
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
        message: "Only organization admins or owners can view usage.",
      })
    }
  }

  async findByOrg(data: FindUsageByOrg) {
    await this.ensureCanReadUsage(data.orgId, data.byUserId)

    const page = Math.max(1, data.page)
    const limit = Math.min(Math.max(1, data.limit), 100)
    const skip = (page - 1) * limit

    const where: Prisma.UsageDailyWhereInput = {
      orgId: data.orgId,
      ...(data.apiKeyId !== undefined ? { apiKeyId: data.apiKeyId } : {}),
      ...((data.from !== undefined || data.to !== undefined)
        ? {
            day: {
              ...(data.from !== undefined ? { gte: data.from } : {}),
              ...(data.to !== undefined ? { lte: data.to } : {}),
            },
          }
        : {}),
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.usageDaily.findMany({
        where,
        include: {
          apiKey: {
            select: { id: true, name: true, keyPrefix: true },
          },
        },
        orderBy: { day: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.usageDaily.count({ where }),
    ])

    const eventsCountTotal = await this.prisma.usageDaily.aggregate({
      _sum: { eventsCount: true },
      where,
    })

    return {
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      summary: {
        eventsCount: eventsCountTotal._sum.eventsCount ?? 0,
      },
    }
  }
}

