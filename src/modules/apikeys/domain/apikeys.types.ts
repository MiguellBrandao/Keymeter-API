export type CreateApiKey = {
    orgId: string,
    name: string
    scopes: string[]
    createByUserId: string
}

export type CreateApiKeyDB = CreateApiKey & {
    keyPrefix: string
    keyHash: string
}

export type FindKeysByOrg = {
    orgId: string,
    page: number,
    limit: number
    byUserId: string
}

export type RevokeKey = {
    orgId: string
    keyPrefix: string
    byUserId: string
}

export type RevokeKeyDB = {
    id: string
    orgId: string
    keyPrefix: string
}

export type RotateKey = {
    orgId: string
    keyPrefixOld: string
    scopes: string[]
    byUserId: string
}

export type RotateKeyDB = RotateKey & {
    id: string
    keyPrefix: string
    keyHash: string
}

export type FindKeyIdByPrefix = {
    orgId: string
    keyPrefix: string
}
