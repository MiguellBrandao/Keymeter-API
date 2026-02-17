import { PrismaClient } from "../../common/prisma/generated/client.js";
import { PrismaEventsRepository } from "./domain/events.repository.js";
import { EventsService } from "./domain/events.service.js";
import { EventsController } from "./http/events.controller.js";
import { eventsRoutes } from "./http/events.routes.js";

export const buildEventsModule = (prisma: PrismaClient) => {
    const eventsRepository = new PrismaEventsRepository(prisma)
    const eventsService = new EventsService(eventsRepository)
    const eventsController = new EventsController(eventsService)

    return eventsRoutes(eventsController);
}
