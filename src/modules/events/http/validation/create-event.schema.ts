import { z } from "zod"
import { EventType } from "../../../../common/prisma/generated/enums.js"

const JsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValue),
    z.record(z.string(), JsonValue),
  ])
)

export const CreateEventSchema = z.object({
    type: z.enum(EventType),
    properties: z.record(z.string(), JsonValue),
})

export type CreateEventDto = z.infer<typeof CreateEventSchema>
