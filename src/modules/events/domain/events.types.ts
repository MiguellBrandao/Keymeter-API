import { Prisma } from "../../../common/prisma/generated/client.js"
import { EventType } from "../../../common/prisma/generated/enums.js"

export type CreateEvent = {
    orgId: string
    apiKeyId: string
    type: EventType
    properties: Prisma.InputJsonValue
}

export type FindEvents = {
  orgId: string
  apiKeyId?: string
  type?: EventType
  page: number
  limit: number
}
