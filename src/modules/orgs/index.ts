import type { PrismaClient } from "../../common/prisma/generated/client.js"
import { PrismaApiKeyRepository } from "../apikeys/domain/apikeys.repository.js"
import { ApiKeysService } from "../apikeys/domain/apikeys.service.js"
import { ApiKeysController } from "../apikeys/http/apikeys.controller.js"
import { buildAuditService } from "../audit/index.js"
import { AuditController } from "../audit/http/audit.controller.js"
import { PrismaMembersRepository } from "../members/domain/members.repository.js"
import { MembersService } from "../members/domain/members.service.js"
import { MembersController } from "../members/http/members.controller.js"
import { buildUsageService } from "../usage/index.js"
import { UsageController } from "../usage/http/usage.controller.js"
import { PrismaOrgRepository } from "./domain/orgs.repository.js"
import { OrgsService } from "./domain/orgs.service.js"
import { OrgsController } from "./http/orgs.controller.js"
import { OrgsRoutes } from "./http/orgs.routes.js"

export const buildOrgsModule = (prisma: PrismaClient) => {
    const auditService = buildAuditService(prisma)

    const orgRepository = new PrismaOrgRepository(prisma)
    const orgsService = new OrgsService(orgRepository, auditService)
    const orgsController = new OrgsController(orgsService)
    const membersRepository = new PrismaMembersRepository(prisma)
    const membersService = new MembersService(membersRepository, auditService)
    const membersController = new MembersController(membersService)
    const apiKeysRepository = new PrismaApiKeyRepository(prisma)
    const apiKeysService = new ApiKeysService(prisma, apiKeysRepository, auditService)
    const apiKeysController = new ApiKeysController(apiKeysService)
    const auditController = new AuditController(auditService)
    const usageService = buildUsageService(prisma)
    const usageController = new UsageController(usageService)

    return OrgsRoutes(orgsController, membersController, apiKeysController, auditController, usageController)
}
