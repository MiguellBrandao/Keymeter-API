import { Router } from "express"
import { validateParams } from "../../../common/http/validateParams.js"
import { validateQuery } from "../../../common/http/validateQuery.js"
import type { UsageController } from "./usage.controller.js"
import { FindUsageQuerySchema } from "./validation/find-usage-query.schema.js"
import { OrgIdParamSchema } from "./validation/org-id-param.schema.js"

export const UsageRoutes = (usageController: UsageController) => {
  const router = Router()

  router.get(
    "/:orgId/usage",
    validateParams(OrgIdParamSchema),
    validateQuery(FindUsageQuerySchema),
    usageController.findByOrg
  )

  return router
}

