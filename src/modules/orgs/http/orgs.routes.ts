import { Router } from "express";
import type { OrgsController } from "./orgs.controller.js";
import { requireAuth } from "../../../common/http/requireAuth.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { CreateOrgSchema } from "./validation/createorg.schema.js";

export const OrgsRoutes = (orgsController: OrgsController) => {
    const router = Router()

    router.use(requireAuth)

    router.post('/', validateBody(CreateOrgSchema), orgsController.createOrg)
    router.get('/my', orgsController.findMyOrgs)

    return router
}
