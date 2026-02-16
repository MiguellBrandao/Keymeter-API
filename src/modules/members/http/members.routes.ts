import { Router } from "express";
import type { MembersController } from "./members.controller.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { validateParams } from "../../../common/http/validateParams.js";
import { ChangeRoleSchema } from "./validation/change-role.schema.js";
import { DeleteMemberParamSchema } from "./validation/delete-member-param.schema.js";
import { OrgIdParamSchema } from "./validation/org-id-param.schema.js";

export const MemberRoutes = (membersController: MembersController) => {
    const router = Router()

    router.patch('/:orgId/member', validateParams(OrgIdParamSchema), validateBody(ChangeRoleSchema), membersController.changeRoleOfUser)
    router.delete('/:orgId/member/:userId', validateParams(DeleteMemberParamSchema), membersController.deleteMember)

    return router
}
