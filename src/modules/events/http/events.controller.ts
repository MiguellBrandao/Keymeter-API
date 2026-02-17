import { Request, Response } from "express";
import type { EventsService } from "../domain/events.service.js";
import { CreateEventDto } from "./validation/create-event.schema.js";
import { AppError } from "../../../common/errors/AppError.js";
import { Prisma } from "../../../common/prisma/generated/client.js";
import { FindEventQueryDto } from "./validation/find-event-query.js";

export class EventsController {
    constructor(private eventsService: EventsService) {}

    createEvent = async(req: Request, res: Response) => {
        if (!req.apiKey) {
            throw new AppError({
                httpStatus: 401,
                message: "Missing API key",
            })
        }

        const body = req.body as CreateEventDto

        const result = await this.eventsService.create({
            orgId: req.apiKey.orgId,
            apiKeyId: req.apiKey.id,
            type: body.type,
            properties: body.properties as Prisma.InputJsonValue,
        })
        return res.status(201).json(result)
    }

    findEvents = async(req: Request, res: Response) => {
        if (!req.apiKey) {
            throw new AppError({
                httpStatus: 401,
                message: "Missing API key",
            })
        }

        const query = req.validatedQuery as FindEventQueryDto

        const result = await this.eventsService.find({
            orgId: req.apiKey.orgId,
            ...(query.apiKeyId != undefined ? { apiKeyId: query.apiKeyId } : {}),
            ...(query.type != undefined ? { type: query.type } : {}),
            page: query.page,
            limit: query.limit,
        })
        return res.status(200).json(result)
    }
}
