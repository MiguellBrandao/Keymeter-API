import type { Event, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { CreateEvent, FindEvents } from "./events.types.js";

export interface EventsRepository {
    create(data: CreateEvent): Promise<Event>
    find(data: FindEvents): Promise<Event[]>
}

export class PrismaEventsRepository implements EventsRepository {
    constructor(private prisma: PrismaClient) {}

    create(data: CreateEvent): Promise<Event> {
        return this.prisma.event.create({ data });
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
