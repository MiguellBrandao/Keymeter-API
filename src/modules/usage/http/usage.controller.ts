import type { Request, Response } from "express"
import { AppError } from "../../../common/errors/AppError.js"
import { serializeList } from "../../../common/http/serialize.js"
import type { UsageService } from "../domain/usage.service.js"
import { UsageDailyDto } from "./dtos/usage-daily.dto.js"
import type { FindUsageQueryDto } from "./validation/find-usage-query.schema.js"
import type { OrgIdParamDto } from "./validation/org-id-param.schema.js"

export class UsageController {
  constructor(private usageService: UsageService) {}

  findByOrg = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError({ httpStatus: 401, message: "Unauthorized" })

    const params = req.validatedParams as OrgIdParamDto | undefined
    if (!params?.orgId) throw new AppError({ httpStatus: 400, message: "Missing orgId route param." })

    const query = req.validatedQuery as FindUsageQueryDto | undefined
    if (!query) throw new AppError({ httpStatus: 400, message: "Invalid query." })

    const result = await this.usageService.findByOrg({
      orgId: params.orgId,
      byUserId: req.user.sub,
      ...(query.apiKeyId !== undefined ? { apiKeyId: query.apiKeyId } : {}),
      ...(query.from !== undefined ? { from: query.from } : {}),
      ...(query.to !== undefined ? { to: query.to } : {}),
      page: query.page,
      limit: query.limit,
    })

    return res.status(200).json({
      ...result,
      items: serializeList(result.items, UsageDailyDto),
    })
  }
}

