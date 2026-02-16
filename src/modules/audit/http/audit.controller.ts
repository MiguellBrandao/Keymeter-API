import type { Request, Response } from "express"
import { AppError } from "../../../common/errors/AppError.js"
import { serializeList } from "../../../common/http/serialize.js"
import type { AuditService } from "../domain/audit.service.js"
import { AuditLogDto } from "./dtos/audit-log.dto.js"
import type { FindAuditLogsQueryDto } from "./validation/find-audit-logs-query.schema.js"
import type { OrgIdParamDto } from "./validation/org-id-param.schema.js"

export class AuditController {
  constructor(private auditService: AuditService) {}

  findByOrg = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

    const params = req.validatedParams as OrgIdParamDto | undefined
    if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

    const query = req.validatedQuery as FindAuditLogsQueryDto | undefined
    if (!query) throw new AppError({ httpStatus: 400, message: "Invalid query." })

    const filters = {
      orgId: params.orgId,
      byUserId: req.user.sub,
      page: query.page,
      limit: query.limit,
      ...(query.action !== undefined ? { action: query.action } : {}),
      ...(query.targetType !== undefined ? { targetType: query.targetType } : {}),
      ...(query.targetId !== undefined ? { targetId: query.targetId } : {}),
    }

    const result = await this.auditService.findByOrg(filters)

    return res.status(200).json({
      ...result,
      items: serializeList(result.items, AuditLogDto),
    })
  }
}
