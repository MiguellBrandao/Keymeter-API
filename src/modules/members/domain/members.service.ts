import { AppError } from "../../../common/errors/AppError.js";
import { Role } from "../../../common/prisma/generated/enums.js";
import type { MembersRepository } from "./members.repository.js";
import type { ChangeRole, DeleteMember } from "./members.types.js";

export class MembersService {
    constructor(private membersRepository: MembersRepository) {}

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
        return await this.membersRepository.changeRole(data)
    }

    async deleteMember(data: DeleteMember) {
        await this.ensureCanManageMembers(data.orgId, data.byUserId)
        return await this.membersRepository.delete(data)
    }
}
