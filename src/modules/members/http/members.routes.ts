import { Router } from "express";
import type { MembersController } from "./members.controller.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { ChangeRoleSchema } from "./validation/change-role.schema.js";
import { requireAuth } from "../../../common/http/requireAuth.js";
import { DeleteMemberSchema } from "./validation/delete-member.schema.js";

export const MemberRoutes = (membersController: MembersController) => {
    const router = Router()

    router.use(requireAuth)

    router.post('/:orgId/member', validateBody(ChangeRoleSchema), membersController.changeRoleOfUser)
    router.delete('/:orgId/member', validateBody(DeleteMemberSchema), membersController.changeRoleOfUser)
}
