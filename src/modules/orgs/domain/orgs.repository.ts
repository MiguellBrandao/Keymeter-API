import { AppError } from "../../../common/errors/AppError.js";
import { Role } from "../../../common/prisma/generated/enums.js";
import { Prisma } from "../../../common/prisma/generated/client.js";
import type { Org, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { CreateOrg, FindOrgsByMember } from "./orgs.types.js";

export interface OrgRepository {
    create(data: CreateOrg): Promise<Org>
    findByMember(data: FindOrgsByMember): Promise<Org[]>
}

export class PrismaOrgRepository implements OrgRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateOrg): Promise<Org> {
        try {
            return await this.prisma.org.create({
                data: {
                    name: data.name,
                    memberships: {
                        create: {
                            userId: data.ownerId,
                            role: Role.OWNER,
                        },
                    },
                },
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
                throw new AppError({
                    httpStatus: 401,
                    message: "Invalid user context.",
                })
            }

            throw error
        }
    }

    findByMember(data: FindOrgsByMember): Promise<Org[]> {
        if (!data.memberId) return Promise.resolve([])

        return this.prisma.org.findMany({ where: { memberships: { some: { userId: data.memberId }  } } })
    }
}
