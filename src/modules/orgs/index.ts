import { PrismaClient } from "../../common/prisma/generated/client.js";
import { PrismaOrgRepository } from "./domain/orgs.repository.js";
import { OrgsService } from "./domain/orgs.service.js";
import { OrgsController } from "./http/orgs.controller.js";
import { OrgsRoutes } from "./http/orgs.routes.js";

export const buildOrgsModule = (prisma: PrismaClient) => {
    const orgRepository = new PrismaOrgRepository(prisma)
    const orgsService = new OrgsService(orgRepository)
    const orgsController = new OrgsController(orgsService)

    return OrgsRoutes(orgsController)
}
