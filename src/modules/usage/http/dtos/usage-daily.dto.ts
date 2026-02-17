import type { UsageDaily } from "../../../../common/prisma/generated/client.js"

type UsageDailyWithApiKey = UsageDaily & {
  apiKey?: {
    id: string
    name: string
    keyPrefix: string
  }
}

export const UsageDailyDto = {
  from(item: UsageDailyWithApiKey) {
    return {
      id: item.id,
      orgId: item.orgId,
      apiKeyId: item.apiKeyId,
      day: item.day,
      eventsCount: item.eventsCount,
      apiKey: item.apiKey
        ? {
            id: item.apiKey.id,
            name: item.apiKey.name,
            keyPrefix: item.apiKey.keyPrefix,
          }
        : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  },
}

