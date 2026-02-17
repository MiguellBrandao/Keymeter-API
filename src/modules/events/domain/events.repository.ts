import type { Event, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { CreateEvent, FindEvents } from "./events.types.js";

export interface EventsRepository {
    create(data: CreateEvent): Promise<Event>
    find(data: FindEvents): Promise<Event[]>
}

export class PrismaEventsRepository implements EventsRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateEvent): Promise<Event> {
        const day = new Date()
        day.setUTCHours(0, 0, 0, 0)

        const created = await this.prisma.$transaction(async (tx) => {
            const event = await tx.event.create({ data })

            await tx.usageDaily.upsert({
                where: {
                    orgId_apiKeyId_day: {
                        orgId: data.orgId,
                        apiKeyId: data.apiKeyId,
                        day,
                    },
                },
                create: {
                    orgId: data.orgId,
                    apiKeyId: data.apiKeyId,
                    day,
                    eventsCount: 1,
                },
                update: {
                    eventsCount: { increment: 1 },
                },
            })

            return event
        })

        return created
    }

    find(data: FindEvents): Promise<Event[]> {
        const page = Math.max(1, data.page)
        const limit = Math.min(Math.max(1, data.limit), 100)
        const skip = (page - 1) * limit

        const where = {
            orgId: data.orgId,
            ...(data.apiKeyId !== undefined ? { apiKeyId: data.apiKeyId } : {}),
            ...(data.type !== undefined ? { type: data.type } : {}),
        }

        return this.prisma.event.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });
    }
}
