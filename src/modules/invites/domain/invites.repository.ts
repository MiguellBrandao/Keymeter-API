import type { Invite, Prisma, PrismaClient } from "../../../common/prisma/generated/client.js";
import type { AcceptInvite, CreateInvite, FindInvite, FindInviteByOrgAndUser, RevokeInvite } from "./invites.type.js";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface InvitesRepository {
    create(data: CreateInvite): Promise<Invite>
    findById(data: FindInvite): Promise<Invite | null>
    findNonRevokedByOrgAndUser(data: FindInviteByOrgAndUser): Promise<Invite | null>
    revoke(data: RevokeInvite): Promise<Invite>
    markAccepted(data: AcceptInvite): Promise<Invite>
    markAcceptedIfPending(data: AcceptInvite): Promise<boolean>
}

export class PrismaInvitesRepository implements InvitesRepository {
    constructor(private prisma: DbClient) {}

    create(data: CreateInvite): Promise<Invite> {
        return this.prisma.invite.create({ data })
    }

    findById(data: FindInvite): Promise<Invite | null> {
        return this.prisma.invite.findUnique({ where: { id: data.inviteId } })
    }

    findNonRevokedByOrgAndUser(data: FindInviteByOrgAndUser): Promise<Invite | null> {
        return this.prisma.invite.findFirst({
            where: {
                orgId: data.orgId,
                userId: data.userId,
                acceptedAt: null,
                revokedAt: null,
            }
        })
    }

    revoke(data: RevokeInvite): Promise<Invite> {
        return this.prisma.invite.update({ data: { revokedAt: new Date(), revokedByUserId: data.byUserId}, where: { id: data.inviteId } })
    }

    markAccepted(data: AcceptInvite): Promise<Invite> {
        return this.prisma.invite.update({
            data: {
                acceptedAt: new Date(),
            },
            where: { id: data.inviteId }
        })
    }

    async markAcceptedIfPending(data: AcceptInvite): Promise<boolean> {
        const result = await this.prisma.invite.updateMany({
            where: {
                id: data.inviteId,
                acceptedAt: null,
                revokedAt: null,
            },
            data: {
                acceptedAt: new Date(),
            },
        })

        return result.count === 1
    }
}
