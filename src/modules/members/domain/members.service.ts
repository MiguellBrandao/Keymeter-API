import type { MembersRepository } from "./members.repository.js";
import type { ChangeRole, DeleteMember } from "./members.types.js";

export class MembersService {
    constructor(private membersRepository: MembersRepository) {}

    async changeRole(data: ChangeRole) {
        return await this.membersRepository.changeRole(data)
    }

    async deleteMember(data: DeleteMember) {
        return await this.membersRepository.delete(data)
    }
}
