import { Request, Response } from "express";
import type { OrgsService } from "../domain/orgs.service.js";
import type { CreateOrgDto } from "./validation/createorg.schema.js";
import { AppError } from "../../../common/errors/AppError.js";
import { serialize, serializeList } from "../../../common/http/serialize.js";
import { OrgDto } from "./dtos/org.dto.js";

export class OrgsController {
    constructor(private orgsService: OrgsService) {}

    createOrg = async (req: Request<{}, {}, CreateOrgDto>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const result = await this.orgsService.createOrg({
            name: req.body.name,
            ownerId: req.user.sub,
        })

        return res.status(201).json(serialize(result, OrgDto))
    }

    findMyOrgs = async (req: Request, res: Response) => {
        if (!req.user) throw new AppError({
            httpStatus: 401,
            message: 'Unauthorized'
        })

        const result = await this.orgsService.findOrgsByMember({ memberId: req.user.sub })
        return res.status(200).json(serializeList(result, OrgDto))
    }
}
