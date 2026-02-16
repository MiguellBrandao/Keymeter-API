import type { MemberShip } from "../../../../common/prisma/generated/client.js"

export const MemberDto = {
  from(member: MemberShip) {
    return {
      id: member.id,
      orgId: member.orgId,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }
  },
}
