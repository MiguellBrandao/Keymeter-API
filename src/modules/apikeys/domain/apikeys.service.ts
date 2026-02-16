import { randomBytes } from "node:crypto";
import { AppError } from "../../../common/errors/AppError.js";
import { hashValue } from "../../../common/auth/bcrypt.js";
import type { ApiKey, PrismaClient } from "../../../common/prisma/generated/client.js";
import { AuditAction, AuditTargetType, Role } from "../../../common/prisma/generated/enums.js";
import type { AuditService } from "../../audit/domain/audit.service.js";
import { PrismaApiKeyRepository } from "./apikeys.repository.js";
import type { ApiKeyRepository } from "./apikeys.repository.js";
import type { CreateApiKey, FindKeysByOrg, RevokeKey, RotateKey } from "./apikeys.types.js";

export class ApiKeysService {
    constructor(
        private prisma: PrismaClient,
        private apiKeyRepository: ApiKeyRepository,
        private auditService: AuditService
    ) {}

    private toPublic(apiKey: ApiKey) {
        return {
            id: apiKey.id,
            orgId: apiKey.orgId,
            name: apiKey.name,
            scopes: apiKey.scopes,
            keyPrefix: apiKey.keyPrefix,
            revokedAt: apiKey.revokedAt,
            lastUsedAt: apiKey.lastUsedAt,
            createByUserId: apiKey.createByUserId,
            createdAt: apiKey.createdAt,
            updatedAt: apiKey.updatedAt,
        }
    }

    private async ensureCanManageKeys(orgId: string, byUserId: string) {
        const membership = await this.prisma.memberShip.findUnique({
            where: { orgId_userId: { orgId, userId: byUserId } },
        })

        if (!membership) {
            throw new AppError({
                httpStatus: 403,
                message: "You are not a member of this organization.",
            })
        }

        if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
            throw new AppError({
                httpStatus: 403,
                message: "Only organization admins or owners can manage API keys.",
            })
        }
    }

    generateApiKey = async () => {
        const prefix = `km_live_${randomBytes(6).toString("base64url").slice(0, 8)}`
        const secret = randomBytes(32).toString("base64url")

        const apiKey = `${prefix}.${secret}`
        const keyHash = await hashValue(apiKey)

        return { prefix, apiKey, keyHash }
    }

    async createKey(data: CreateApiKey) {
        await this.ensureCanManageKeys(data.orgId, data.createByUserId)

        const { prefix, apiKey, keyHash } = await this.generateApiKey()

        const createKeyData = {
            ...data,
            keyPrefix: prefix,
            keyHash
        }

        const createdKey = await this.apiKeyRepository.create(createKeyData)

        await this.auditService.log({
            orgId: createdKey.orgId,
            action: AuditAction.API_KEY_CREATED,
            actorUserId: data.createByUserId,
            targetType: AuditTargetType.api_key,
            targetId: createdKey.id,
            metadata: { keyPrefix: createdKey.keyPrefix, scopes: createdKey.scopes },
        })

        return {
            apiKey,
            key: this.toPublic(createdKey),
        }
    }

    async findKeysByOrg(data: FindKeysByOrg) {
        await this.ensureCanManageKeys(data.orgId, data.byUserId)

        const result = await this.apiKeyRepository.findByOrg(data)

        return {
            ...result,
            items: result.items.map((item) => this.toPublic(item)),
        }
    }

    async revokeKey(data: RevokeKey) {
        await this.ensureCanManageKeys(data.orgId, data.byUserId)

        const id = await this.apiKeyRepository.findIdByPrefix({
            orgId: data.orgId,
            keyPrefix: data.keyPrefix,
        })

        if (!id) {
            throw new AppError({
                httpStatus: 404,
                message: "API key not found for this organization.",
            })
        }

        const existing = await this.apiKeyRepository.findById(id)
        if (!existing) {
            throw new AppError({
                httpStatus: 404,
                message: "API key not found for this organization.",
            })
        }

        if (existing.revokedAt) {
            throw new AppError({
                httpStatus: 409,
                message: "API key already revoked.",
            })
        }

        const revoked = await this.apiKeyRepository.revokeKey({
            id,
            orgId: data.orgId,
            keyPrefix: data.keyPrefix,
        })

        await this.auditService.log({
            orgId: revoked.orgId,
            action: AuditAction.API_KEY_REVOKED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.api_key,
            targetId: revoked.id,
            metadata: { keyPrefix: revoked.keyPrefix },
        })

        return this.toPublic(revoked)
    }

    async rotateKey(data: RotateKey) {
        await this.ensureCanManageKeys(data.orgId, data.byUserId)

        const { prefix, apiKey, keyHash } = await this.generateApiKey()
        const id = await this.apiKeyRepository.findIdByPrefix({
            orgId: data.orgId,
            keyPrefix: data.keyPrefixOld,
        })

        if (!id) {
            throw new AppError({
                httpStatus: 404,
                message: "API key not found for this organization.",
            })
        }

        const oldKey = await this.apiKeyRepository.findById(id)
        if (!oldKey) {
            throw new AppError({
                httpStatus: 404,
                message: "API key not found for this organization.",
            })
        }

        if (oldKey.revokedAt) {
            throw new AppError({
                httpStatus: 409,
                message: "API key already revoked.",
            })
        }

        const newKey = await this.prisma.$transaction(async (tx) => {
            const repository = new PrismaApiKeyRepository(tx)

            await repository.revokeKey({
                id: oldKey.id,
                orgId: oldKey.orgId,
                keyPrefix: oldKey.keyPrefix,
            })

            return repository.create({
                orgId: oldKey.orgId,
                name: oldKey.name,
                scopes: data.scopes,
                createByUserId: data.byUserId,
                keyPrefix: prefix,
                keyHash,
            })
        })

        await this.auditService.log({
            orgId: newKey.orgId,
            action: AuditAction.API_KEY_ROTATED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.api_key,
            targetId: newKey.id,
            metadata: { rotatedFrom: oldKey.keyPrefix, keyPrefix: newKey.keyPrefix },
        })

        return {
            apiKey,
            key: this.toPublic(newKey),
        }
    }
}
