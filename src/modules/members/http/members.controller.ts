import type { Request, Response } from "express"
import { AppError } from "../../../common/errors/AppError.js"
import { serialize } from "../../../common/http/serialize.js"
import type { MembersService } from "../domain/members.service.js"
import { MemberDeletedDto } from "./dtos/member-deleted.dto.js"
import { MemberDto } from "./dtos/member.dto.js"
import type { ChangeRoleDto } from "./validation/change-role.schema.js"
import type { DeleteMemberParamDto } from "./validation/delete-member-param.schema.js"
import type { OrgIdParamDto } from "./validation/org-id-param.schema.js"

export class MembersController {
    constructor(private membersService: MembersService) {}

    changeRoleOfUser = async (req: Request<{ orgId: string }, {}, ChangeRoleDto>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })
        const params = req.validatedParams as OrgIdParamDto | undefined
        if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

        const result = await this.membersService.changeRole({
            orgId: params.orgId,
            userId: req.body.userId,
            role: req.body.role,
            byUserId: req.user.sub,
        })

        return res.status(200).json(serialize(result, MemberDto))
    }

    deleteMember = async (req: Request<{ orgId: string; userId: string }>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })
        const params = req.validatedParams as DeleteMemberParamDto | undefined
        if (!params?.orgId || !params.userId) throw new AppError({ httpStatus: 400, message: "Missing route params." })

        const result = await this.membersService.deleteMember({
            orgId: params.orgId,
            userId: params.userId,
            byUserId: req.user.sub,
        })

        return res.status(200).json(serialize({ success: result, orgId: params.orgId, userId: params.userId }, MemberDeletedDto))
    }
}
