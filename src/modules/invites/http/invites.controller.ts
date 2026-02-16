import type { Request, Response } from "express"
import { AppError } from "../../../common/errors/AppError.js"
import { serialize } from "../../../common/http/serialize.js"
import type { InvitesService } from "../domain/invites.service.js"
import { InviteAcceptedDto } from "./dtos/invite-accepted.dto.js"
import { InviteCreatedDto } from "./dtos/invite-created.dto.js"
import { InviteRevokedDto } from "./dtos/invite-revoked.dto.js"
import type { AcceptInviteDto } from "./validation/accept-invite.schema.js"
import type { InviteUserDto } from "./validation/invite-user.schema.js"
import type { RevokeInviteDto } from "./validation/revoke-invite.schema.js"

export class InvitesController {
    constructor(private invitesService: InvitesService) {}

    inviteUser = async (req: Request<{}, {}, InviteUserDto>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const result = await this.invitesService.inviteUser({
            orgId: req.body.orgId,
            userId: req.body.userId,
            role: req.body.role,
            createdByUserId: req.user.sub,
        })

        return res.status(201).json(serialize(result, InviteCreatedDto))
    }

    acceptInvite = async (req: Request<{}, {}, {}, AcceptInviteDto>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })
        const query = req.validatedQuery as AcceptInviteDto

        const result = await this.invitesService.acceptInvite({
            inviteId: query.inviteId,
            token: query.token,
            byUserId: req.user.sub,
        })

        return res.status(200).json(serialize(result, InviteAcceptedDto))
    }

    revokeInvite = async (req: Request<{}, {}, RevokeInviteDto>, res: Response) => {
        if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

        const result = await this.invitesService.revokeInvite({
            inviteId: req.body.inviteId,
            byUserId: req.user.sub,
        })

        return res.status(200).json(serialize(result, InviteRevokedDto))
    }
}
