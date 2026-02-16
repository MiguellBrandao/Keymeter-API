import { PrismaClient } from "../../common/prisma/generated/client.js";
import { PrismaMembersRepository } from "../members/domain/members.repository.js";
import { MembersService } from "../members/domain/members.service.js";
import { MembersController } from "../members/http/members.controller.js";
import { PrismaOrgRepository } from "./domain/orgs.repository.js";
import { OrgsService } from "./domain/orgs.service.js";
import { OrgsController } from "./http/orgs.controller.js";
import { OrgsRoutes } from "./http/orgs.routes.js";

export const buildOrgsModule = (prisma: PrismaClient) => {
    const orgRepository = new PrismaOrgRepository(prisma)
    const orgsService = new OrgsService(orgRepository)
    const orgsController = new OrgsController(orgsService)
    const membersRepository = new PrismaMembersRepository(prisma)
    const membersService = new MembersService(membersRepository)
    const membersController = new MembersController(membersService)

    return OrgsRoutes(orgsController, membersController)
}
