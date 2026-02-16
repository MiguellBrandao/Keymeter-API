import type { PrismaClient } from "../../common/prisma/generated/client.js"
import { PrismaUserRepository } from "../users/domain/users.repository.js"
import { UsersService } from "../users/domain/users.service.js"

import { AuthService } from "./domain/auth.service.js"
import { AuthController } from "./http/auth.controller.js"
import { AuthRoutes } from "./http/auth.routes.js"

export const buildAuthModule = (prisma: PrismaClient) => {
  const userRepo = new PrismaUserRepository(prisma)
  const usersService = new UsersService(userRepo)

  const authService = new AuthService(usersService)
  const controller = new AuthController(authService)

  return AuthRoutes(controller)
}
