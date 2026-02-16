import type { ApiKey, PrismaClient } from "../../../common/prisma/generated/client.js";
import { Prisma } from "../../../common/prisma/generated/client.js";
import type { CreateApiKeyDB, FindKeyIdByPrefix, FindKeysByOrg, RevokeKeyDB, RotateKeyDB } from "./apikeys.types.js";

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};


export interface ApiKeyRepository {
    create(data: CreateApiKeyDB): Promise<ApiKey>
    findByOrg(data: FindKeysByOrg): Promise<Paginated<ApiKey>>
    findById(id: string): Promise<ApiKey | null>
    findIdByPrefix(data: FindKeyIdByPrefix): Promise<string | null>
    revokeKey(data: RevokeKeyDB): Promise<ApiKey>
    rotateKey(data: RotateKeyDB): Promise<ApiKey>
}

type DbClient = PrismaClient | Prisma.TransactionClient;

export class PrismaApiKeyRepository implements ApiKeyRepository {
    constructor(private prisma: DbClient) {}

    create(data: CreateApiKeyDB): Promise<ApiKey> {
        return this.prisma.apiKey.create({ data })
    }

    async findByOrg(data: FindKeysByOrg) {
        const page = Math.max(1, data.page);
        const limit = Math.min(Math.max(1, data.limit), 100);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.prisma.apiKey.findMany({
                where: { orgId: data.orgId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.apiKey.count({
                where: { orgId: data.orgId },
            }),
        ]);

        return {
            items,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    findById(id: string): Promise<ApiKey | null> {
        return this.prisma.apiKey.findUnique({ where: { id } })
    }

    revokeKey(data: RevokeKeyDB): Promise<ApiKey> {
        return this.prisma.apiKey.update({
            data: { revokedAt: new Date() },
            where: { id: data.id }
        })
    }

    async findIdByPrefix(data: FindKeyIdByPrefix): Promise<string | null> {
        const key = await this.prisma.apiKey.findFirst({
            where: {
                orgId: data.orgId,
                keyPrefix: data.keyPrefix,
            },
            select: { id: true },
        })

        return key?.id ?? null
    }

    rotateKey(data: RotateKeyDB): Promise<ApiKey> {
        return this.prisma.apiKey.update({
            data: { keyPrefix: data.keyPrefix, keyHash: data.keyHash, scopes: data.scopes },
            where: { id: data.id }
        })
    }
}
