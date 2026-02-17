import { z } from "zod";
import { EventType } from "../../../../common/prisma/generated/enums.js";

const toInt = (value: unknown) => {
    if (typeof value === "string" && value.trim() !== "") return Number(value)
    return value
}

export const FindEventQuerySchema = z.object({
    apiKeyId: z.uuid().optional(),
    type: z.enum(EventType).optional(),
    page: z.preprocess(toInt, z.number().int().min(1)).default(1),
    limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
})

export type FindEventQueryDto = z.infer<typeof FindEventQuerySchema>
