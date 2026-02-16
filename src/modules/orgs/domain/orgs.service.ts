import { AuditAction, AuditTargetType } from "../../../common/prisma/generated/enums.js";
import type { AuditService } from "../../audit/domain/audit.service.js";
import type { OrgRepository } from "./orgs.repository.js";
import type { CreateOrg, FindOrgsByMember } from "./orgs.types.js";

export class OrgsService {
    constructor(
        private orgsRepository: OrgRepository,
        private auditService: AuditService
    ) {}

    async createOrg(data: CreateOrg) {
        const org = await this.orgsRepository.create(data)

        await this.auditService.log({
            orgId: org.id,
            action: AuditAction.ORG_CREATED,
            actorUserId: data.ownerId,
            targetType: AuditTargetType.org,
            targetId: org.id,
            metadata: { name: org.name },
        })

        return org
    }

    async findOrgsByMember(data: FindOrgsByMember) {
        return await this.orgsRepository.findByMember(data)
    }
}
