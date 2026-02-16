import type { MembersService } from "../domain/members.service.js";
import type { ChangeRoleDto } from "./validation/change-role.schema.js";
import { DeleteMemberDto } from "./validation/delete-member.schema.js";

export class MembersController {
    constructor(private membersService: MembersService) {}

    changeRoleOfUser = async (data: ChangeRoleDto) => {
        return await this.membersService.changeRole(data)
    }

    deleteMember = async(data: DeleteMemberDto) => {
        return await this.membersService.deleteMember(data)
    }

}
