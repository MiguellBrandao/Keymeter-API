import { Router } from "express"
import { validateParams } from "../../../common/http/validateParams.js"
import { validateQuery } from "../../../common/http/validateQuery.js"
import type { AuditController } from "./audit.controller.js"
import { FindAuditLogsQuerySchema } from "./validation/find-audit-logs-query.schema.js"
import { OrgIdParamSchema } from "./validation/org-id-param.schema.js"

export const AuditRoutes = (auditController: AuditController) => {
  const router = Router()

  router.get("/:orgId/audit-logs", validateParams(OrgIdParamSchema), validateQuery(FindAuditLogsQuerySchema), auditController.findByOrg)

  return router
}
