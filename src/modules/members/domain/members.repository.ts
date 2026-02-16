import { AppError } from "../../../common/errors/AppError.js";
import { Prisma } from "../../../common/prisma/generated/client.js";
import type { MemberShip, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { ChangeRole, CreateMember, DeleteMember, FindMember } from "./members.types.js";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface MembersRepository {
    create(data: CreateMember): Promise<MemberShip>
    findByOrgAndUser(data: FindMember): Promise<MemberShip | null>
    changeRole(data: ChangeRole): Promise<MemberShip>
    delete(data: DeleteMember): Promise<boolean>
}

export class PrismaMembersRepository implements MembersRepository {
    constructor(private prisma: DbClient) {}

    async create(data: CreateMember): Promise<MemberShip> {
        try {
            return await this.prisma.memberShip.create({ data })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new AppError({
                    httpStatus: 409,
                    message: "Member already exists in this organization.",
                })
            }

            throw error
        }
    }

    findByOrgAndUser(data: FindMember): Promise<MemberShip | null> {
        return this.prisma.memberShip.findUnique({
            where: { orgId_userId: { orgId: data.orgId, userId: data.userId } }
        })
    }

    changeRole(data: ChangeRole): Promise<MemberShip> {
        return this.prisma.memberShip.update({
            data: { role: data.role },
            where: {
                orgId_userId: {
                    orgId: data.orgId,
                    userId: data.userId,
                },
            }
        }).catch((error) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError({
                    httpStatus: 404,
                    message: "Member not found in this organization.",
                })
            }

            throw error
        })
    }

    async delete(data: DeleteMember): Promise<boolean> {
        try {
            await this.prisma.memberShip.delete({
                where: {
                     orgId_userId: {
                        orgId: data.orgId,
                        userId: data.userId,
                    },
                }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError({
                    httpStatus: 404,
                    message: "Member not found in this organization.",
                })
            }

            throw error
        }
        return true
    }
}
