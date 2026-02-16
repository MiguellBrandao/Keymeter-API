export type CreateOrg = {
    name: string
    ownerId: string
}

export type FindOrgsByMember = {
    memberId?: string
}
