import type { PrismaClient, User } from "../../../common/prisma/generated/client.js"
import type { CreateUser, FindUser } from "./user.types.js"

export interface UserRepository {
    createUser(data: CreateUser): Promise<User>
    findUser(params: FindUser): Promise<User | null>
}

export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) {}

    createUser(data: CreateUser): Promise<User> {
        return this.prisma.user.create({ data })
    }

    findUser(params: FindUser): Promise<User | null> {
        if (params.id != null) {
            return this.prisma.user.findUnique({ where: { id: params.id } })
        }

        if (params.email != null) {
            return this.prisma.user.findUnique({ where: { email: params.email } })
        }

        return Promise.resolve(null)
    }
}
