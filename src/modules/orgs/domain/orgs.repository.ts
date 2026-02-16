import type { Org, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { CreateOrg, FindOrgsByMember } from "./orgs.types.js";

export interface OrgRepository {
    create(data: CreateOrg): Promise<Org>
    findByMember(data: FindOrgsByMember): Promise<Org[]>
}

export class PrismaOrgRepository implements OrgRepository {
    constructor(private prisma: PrismaClient) {}

    create(data: CreateOrg): Promise<Org> {
        return this.prisma.org.create({
            data: {
                name: data.name,
                memberships: {
                    create: {
                        userId: data.ownerId,
                        role: "OWNER",
                    },
                },
            },
        })
    }

    findByMember(data: FindOrgsByMember): Promise<Org[]> {
        if (!data.memberId) return Promise.resolve([])

        return this.prisma.org.findMany({ where: { memberships: { some: { userId: data.memberId }  } } })
    }
}
