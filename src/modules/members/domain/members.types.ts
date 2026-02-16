import { Role } from "../../../common/prisma/generated/enums.js"

export type CreateMember = {
    orgId: string
    userId: string
    role: Role
}

export type FindMember = {
    orgId: string
    userId: string
}

export type ChangeRole = {
    orgId: string
    userId: string
    role: Role
}

export type DeleteMember = {
    orgId: string
    userId: string
}
