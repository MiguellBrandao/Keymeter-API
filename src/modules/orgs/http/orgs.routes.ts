import { Router } from "express";
import type { OrgsController } from "./orgs.controller.js";
import type { ApiKeysController } from "../../apikeys/http/apikeys.controller.js";
import { ApiKeysRoutes } from "../../apikeys/http/apikeys.routes.js";
import type { AuditController } from "../../audit/http/audit.controller.js";
import { AuditRoutes } from "../../audit/http/audit.routes.js";
import type { MembersController } from "../../members/http/members.controller.js";
import { MemberRoutes } from "../../members/http/members.routes.js";
import type { UsageController } from "../../usage/http/usage.controller.js";
import { UsageRoutes } from "../../usage/http/usage.routes.js";
import { requireAuth } from "../../../common/http/requireAuth.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { CreateOrgSchema } from "./validation/createorg.schema.js";

export const OrgsRoutes = (
    orgsController: OrgsController,
    membersController: MembersController,
    apiKeysController: ApiKeysController,
    auditController: AuditController,
    usageController: UsageController
) => {
    const router = Router()

    router.use(requireAuth)

    router.post('/', validateBody(CreateOrgSchema), orgsController.createOrg)
    router.get('/my', orgsController.findMyOrgs)
    router.use(MemberRoutes(membersController))
    router.use(ApiKeysRoutes(apiKeysController))
    router.use(AuditRoutes(auditController))
    router.use(UsageRoutes(usageController))
    return router
}
