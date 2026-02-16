import { Router } from "express";
import type { OrgsController } from "./orgs.controller.js";
import { MemberRoutes } from "../../members/http/members.routes.js";
import type { MembersController } from "../../members/http/members.controller.js";
import { requireAuth } from "../../../common/http/requireAuth.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { CreateOrgSchema } from "./validation/createorg.schema.js";

export const OrgsRoutes = (orgsController: OrgsController, membersController: MembersController) => {
    const router = Router()

    router.use(requireAuth)

    router.post('/', validateBody(CreateOrgSchema), orgsController.createOrg)
    router.get('/my', orgsController.findMyOrgs)
    router.use(MemberRoutes(membersController))

    return router
}
