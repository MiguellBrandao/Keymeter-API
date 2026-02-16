import type { PrismaClient, User } from "../../../common/prisma/generated/client.js"
import type { CreateUser, FindUser } from "./users.types.js"

export interface UserRepository {
    createUser(data: CreateUser): Promise<User>
    findUser(data: FindUser): Promise<User | null>
}

export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) {}

    createUser(data: CreateUser): Promise<User> {
        return this.prisma.user.create({ data })
    }

    findUser(data: FindUser): Promise<User | null> {
        if (data.id != null) {
            return this.prisma.user.findUnique({ where: { id: data.id } })
        }

        if (data.email != null) {
            return this.prisma.user.findUnique({ where: { email: data.email } })
        }

        return Promise.resolve(null)
    }
}
