import { randomBytes } from "node:crypto";
import { AppError } from "../../../common/errors/AppError.js";
import type { Invite, Prisma, PrismaClient } from "../../../common/prisma/generated/client.js";
import { AuditAction, AuditTargetType, Role } from "../../../common/prisma/generated/enums.js";
import { PrismaMembersRepository } from "../../members/domain/members.repository.js";
import type { AuditService } from "../../audit/domain/audit.service.js";
import type { UsersService } from "../../users/domain/users.service.js";
import { PrismaInvitesRepository, type InvitesRepository } from "./invites.repository.js";
import type { AcceptInvite, CreateInvite, InviteUser, RevokeInvite } from "./invites.type.js";
import { hashValue, verifyValue } from "../../../common/auth/bcrypt.js";

export type TokenPair = { token: string, hash: string}

export class InvitesService {
    constructor(
        private prisma: PrismaClient,
        private invitesRepository: InvitesRepository,
        private usersService: UsersService,
        private auditService: AuditService
    ) {}

    async generateInviteTokenPair(): Promise<TokenPair> {
        const token = randomBytes(16).toString("base64url");
        const hash = await hashValue(token)

        return { token, hash }
    }

    async inviteUser(data: InviteUser) {
        if (data.userId === data.createdByUserId) {
            throw new AppError({
                httpStatus: 400,
                message: "You cannot invite yourself.",
            })
        }

        const existing = await this.usersService.findUser({ id: data.userId })
        if (!existing) throw new AppError({
            httpStatus: 404,
            message: 'User invited not found'
        })

        const invite = await this.prisma.$transaction(async(tx: Prisma.TransactionClient) => {
            const invitesRepository = new PrismaInvitesRepository(tx)
            const membersRepository = new PrismaMembersRepository(tx)

            const inviterMembership = await membersRepository.findByOrgAndUser({
                orgId: data.orgId,
                userId: data.createdByUserId,
            })
            if (!inviterMembership) {
                throw new AppError({
                    httpStatus: 403,
                    message: "You are not a member of this organization.",
                })
            }
            if (inviterMembership.role !== Role.OWNER && inviterMembership.role !== Role.ADMIN) {
                throw new AppError({
                    httpStatus: 403,
                    message: "Only organization admins or owners can send invites.",
                })
            }

            const invitedMembership = await membersRepository.findByOrgAndUser({
                orgId: data.orgId,
                userId: data.userId,
            })
            if (invitedMembership) {
                throw new AppError({
                    httpStatus: 409,
                    message: "User is already a member of this organization.",
                })
            }

            const existingInvite = await invitesRepository.findNonRevokedByOrgAndUser({
                orgId: data.orgId,
                userId: data.userId,
            })

            if (existingInvite) {
                throw new AppError({
                    httpStatus: 409,
                    message: "User already has a non-revoked invite for this organization.",
                })
            }

            const { token, hash } = await this.generateInviteTokenPair()

            // SEND THIS ACCEPT INVITE TO USER BY EMAIL WITH THIS TOKEN (FUTURE INTEGRATION)
            console.log(token)

            const createData: CreateInvite = {
                ...data,
                tokenHash: hash,
            };

            return await invitesRepository.create(createData)
        })

        await this.auditService.log({
            orgId: invite.orgId,
            action: AuditAction.INVITE_CREATED,
            actorUserId: data.createdByUserId,
            targetType: AuditTargetType.invite,
            targetId: invite.id,
            metadata: { userId: invite.userId, role: invite.role },
        })

        return invite
    }

    async revokeInvite(data: RevokeInvite) {
        const existing = await this.invitesRepository.findById(data)
        if (!existing) throw new AppError({
            httpStatus: 404,
            message: 'Invite not found'
        })
        if (existing.revokedAt) throw new AppError({
            httpStatus: 409,
            message: 'Invite already revoked'
        })

        const revoked = await this.invitesRepository.revoke(data)

        await this.auditService.log({
            orgId: revoked.orgId,
            action: AuditAction.INVITE_REVOKED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.invite,
            targetId: revoked.id,
        })

        return revoked
    }

    async acceptInvite(data: AcceptInvite) {
        const acceptedInvite = await this.prisma.$transaction(async(tx: Prisma.TransactionClient) => {
            const invitesRepository = new PrismaInvitesRepository(tx)
            const membersRepository = new PrismaMembersRepository(tx)

            const invite: Invite | null = await invitesRepository.findById(data)

            if (!invite) {
                throw new AppError({
                    httpStatus: 404,
                    message: 'Invite not found'
                })
            } else if (invite.revokedAt) {
                throw new AppError({
                    httpStatus: 409,
                    message: 'Invoke revoked'
                })
            } else if (invite.acceptedAt) {
                throw new AppError({
                    httpStatus: 409,
                    message: 'Invoke already accepted'
                })
            }

            if (invite.userId != data.byUserId) {
                throw new AppError({
                    httpStatus: 403,
                    message: 'You cant accepted the invite of other user'
                })
            }

            const ok = await verifyValue(data.token, invite.tokenHash)
            if (!ok) {
                throw new AppError({
                    httpStatus: 401,
                    message: 'Invalid Token'
                })
            }

            const member = await membersRepository.findByOrgAndUser({
                orgId: invite.orgId,
                userId: invite.userId
            })
            if (member) throw new AppError({
                httpStatus: 409,
                message: 'Member already exists'
            })

            const memberData = {
                orgId: invite.orgId,
                userId: invite.userId,
                role: invite.role
            }

            const claimed = await invitesRepository.markAcceptedIfPending(data)
            if (!claimed) {
                throw new AppError({
                    httpStatus: 409,
                    message: 'Invite already processed'
                })
            }

            await membersRepository.create(memberData)

            const updatedInvite = await invitesRepository.findById(data)
            if (!updatedInvite) {
                throw new AppError({
                    httpStatus: 404,
                    message: 'Invite not found'
                })
            }

            return updatedInvite
        })

        await this.auditService.log({
            orgId: acceptedInvite.orgId,
            action: AuditAction.MEMBER_ADDED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.member,
            targetId: `${acceptedInvite.orgId}:${acceptedInvite.userId}`,
            metadata: { role: acceptedInvite.role, via: "invite_accept" },
        })

        return acceptedInvite
    }
}
