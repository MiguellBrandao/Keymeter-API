import type { Invite } from "../../../../common/prisma/generated/client.js"

export const InviteCreatedDto = {
  from(invite: Invite) {
    return {
      id: invite.id,
      orgId: invite.orgId,
      userId: invite.userId,
      role: invite.role,
      createdAt: invite.createdAt,
      createdByUserId: invite.createdByUserId,
    }
  },
}
