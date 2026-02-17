import { Router } from "express";
import { requireApiKey } from "../../../common/http/requireApiKey.js";
import { rateLimitEvents } from "../../../common/api/rate-limite.middleware.js";
import { validateBody } from "../../../common/http/validateBody.js";
import type { EventsController } from "./events.controller.js";
import { validateQuery } from "../../../common/http/validateQuery.js";
import { CreateEventSchema } from "./validation/create-event.schema.js";
import { FindEventQuerySchema } from "./validation/find-event-query.js";

export const eventsRoutes = (eventsController: EventsController) => {
    const router = Router()

    router.post("/", requireApiKey, rateLimitEvents, validateBody(CreateEventSchema), eventsController.createEvent)
    router.get("/", requireApiKey, rateLimitEvents, validateQuery(FindEventQuerySchema), eventsController.findEvents)

    return router
}
