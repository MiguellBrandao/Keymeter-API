import { AppError } from "../../../common/errors/AppError.js"
import { Prisma } from "../../../common/prisma/generated/client.js"
import type { PrismaClient, User } from "../../../common/prisma/generated/client.js"
import type { CreateUser, FindUser } from "./users.types.js"

export interface UserRepository {
    createUser(data: CreateUser): Promise<User>
    findUser(data: FindUser): Promise<User | null>
}

export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) {}

    async createUser(data: CreateUser): Promise<User> {
        try {
            return await this.prisma.user.create({ data })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new AppError({
                    httpStatus: 409,
                    message: "Email already in use",
                })
            }

            throw error
        }
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
