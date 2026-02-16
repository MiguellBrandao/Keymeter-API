import type { Invite } from "../../../../common/prisma/generated/client.js"

export const InviteAcceptedDto = {
  from(invite: Invite) {
    return {
      id: invite.id,
      orgId: invite.orgId,
      userId: invite.userId,
      acceptedAt: invite.acceptedAt,
      acceptedByUserId: invite.acceptedByUserId,
    }
  },
}
