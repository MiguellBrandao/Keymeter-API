import { Role } from "../../../common/prisma/generated/enums.js"

export type InviteUser = {
    orgId: string
    userId: string
    role: Role
    createdByUserId: string
}

export type CreateInvite = InviteUser & {
  tokenHash: string
}

export type RevokeInvite = {
    inviteId: string
    byUserId: string
}

export type AcceptInvite = {
    inviteId: string
    token: string
    byUserId: string
}

export type FindInvite = {
    inviteId: string
}

export type FindInviteByOrgAndUser = {
    orgId: string
    userId: string
}
