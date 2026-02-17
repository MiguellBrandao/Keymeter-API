export type FindUsageByOrg = {
  orgId: string
  byUserId: string
  from?: Date
  to?: Date
  apiKeyId?: string
  page: number
  limit: number
}

