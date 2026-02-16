import { Request, Response } from "express";
import type { ApiKeysService } from "../domain/apikeys.service.js";
import { AppError } from "../../../common/errors/AppError.js";
import type { OrgIdParamDto } from "./validation/org-id-param.schema.js";
import type { CreateApiKeyDto } from "./validation/create-apikey.schema.js";
import type { FindApiKeysQueryDto } from "./validation/find-apikeys-query.schema.js";
import type { RevokeKeyDto } from "./validation/revoke-key.schema.js";
import type { RotateKeyDto } from "./validation/rotate-key.schema.js";

export class ApiKeysController {
    constructor(private apiKeysService: ApiKeysService) {}

    generateApiKey = async (req: Request, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const params = req.validatedParams as OrgIdParamDto | undefined
        if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

        const body = req.body as CreateApiKeyDto

        const result = await this.apiKeysService.createKey({
            name: body.name,
            scopes: body.scopes,
            orgId: params.orgId,
            createByUserId: req.user.sub,
        })

        return res.status(201).json(result)
    }

    findApiKeysByOrg = async (req: Request, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const params = req.validatedParams as OrgIdParamDto | undefined
        if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

        const query = req.validatedQuery as FindApiKeysQueryDto

        const result = await this.apiKeysService.findKeysByOrg({
            orgId: params.orgId,
            limit: query.limit,
            page: query.page,
            byUserId: req.user.sub,
        })

        return res.status(200).json(result)
    }

    revokeApiKey = async (req: Request, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const params = req.validatedParams as OrgIdParamDto | undefined
        if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

        const body = req.body as RevokeKeyDto

        const result = await this.apiKeysService.revokeKey({
            orgId: params.orgId,
            keyPrefix: body.keyPrefix,
            byUserId: req.user.sub,
        })

        return res.status(200).json(result)
    }

    rotateApiKey = async (req: Request, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const params = req.validatedParams as OrgIdParamDto | undefined
        if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

        const body = req.body as RotateKeyDto

        const result = await this.apiKeysService.rotateKey({
            orgId: params.orgId,
            keyPrefixOld: body.keyPrefixOld,
            scopes: body.scopes,
            byUserId: req.user.sub,
        })

        return res.status(200).json(result)
    }
}
