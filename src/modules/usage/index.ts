import type { PrismaClient } from "../../common/prisma/generated/client.js"
import { UsageService } from "./domain/usage.service.js"
import { UsageController } from "./http/usage.controller.js"
import { UsageRoutes } from "./http/usage.routes.js"

export const buildUsageModule = (prisma: PrismaClient) => {
  const usageService = new UsageService(prisma)
  const usageController = new UsageController(usageService)

  return UsageRoutes(usageController)
}

export const buildUsageService = (prisma: PrismaClient) => {
  return new UsageService(prisma)
}

