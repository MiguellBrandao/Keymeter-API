import { AppError } from "../../../common/errors/AppError.js";
import { AuditAction, AuditTargetType, Role } from "../../../common/prisma/generated/enums.js";
import type { AuditService } from "../../audit/domain/audit.service.js";
import type { MembersRepository } from "./members.repository.js";
import type { ChangeRole, DeleteMember } from "./members.types.js";

export class MembersService {
    constructor(
        private membersRepository: MembersRepository,
        private auditService: AuditService
    ) {}

    private async ensureCanManageMembers(orgId: string, byUserId: string) {
        const actorMembership = await this.membersRepository.findByOrgAndUser({ orgId, userId: byUserId })
        if (!actorMembership) {
            throw new AppError({
                httpStatus: 403,
                message: "You are not a member of this organization.",
            })
        }

        if (actorMembership.role !== Role.OWNER && actorMembership.role !== Role.ADMIN) {
            throw new AppError({
                httpStatus: 403,
                message: "Only organization admins or owners can manage members.",
            })
        }
    }

    async changeRole(data: ChangeRole) {
        await this.ensureCanManageMembers(data.orgId, data.byUserId)
        const updated = await this.membersRepository.changeRole(data)

        await this.auditService.log({
            orgId: data.orgId,
            action: AuditAction.MEMBER_ROLE_CHANGED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.member,
            targetId: updated.id,
            metadata: { userId: data.userId, role: data.role },
        })

        return updated
    }

    async deleteMember(data: DeleteMember) {
        await this.ensureCanManageMembers(data.orgId, data.byUserId)
        const deleted = await this.membersRepository.delete(data)

        await this.auditService.log({
            orgId: data.orgId,
            action: AuditAction.MEMBER_REMOVED,
            actorUserId: data.byUserId,
            targetType: AuditTargetType.member,
            targetId: `${data.orgId}:${data.userId}`,
            metadata: { userId: data.userId },
        })

        return deleted
    }
}
