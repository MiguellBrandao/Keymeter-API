import type { PrismaClient } from "../../common/prisma/generated/client.js"
import { PrismaUserRepository } from "../users/domain/users.repository.js"
import { UsersService } from "../users/domain/users.service.js"
import { PrismaInvitesRepository } from "./domain/invites.repository.js"
import { InvitesService } from "./domain/invites.service.js"
import { InvitesController } from "./http/invites.controller.js"
import { InvitesRoutes } from "./http/invites.routes.js"

export const buildInvitesModule = (prisma: PrismaClient) => {
    const usersRepository = new PrismaUserRepository(prisma)
    const usersService = new UsersService(usersRepository)
    const invitesRepository = new PrismaInvitesRepository(prisma)
    const invitesService = new InvitesService(prisma, invitesRepository, usersService)
    const invitesController = new InvitesController(invitesService)

    return InvitesRoutes(invitesController)
}
