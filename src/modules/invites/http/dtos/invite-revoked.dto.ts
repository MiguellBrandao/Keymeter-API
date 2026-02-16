import type { Invite } from "../../../../common/prisma/generated/client.js"

export const InviteRevokedDto = {
  from(invite: Invite) {
    return {
      id: invite.id,
      orgId: invite.orgId,
      userId: invite.userId,
      revokedAt: invite.revokedAt,
      revokedByUserId: invite.revokedByUserId,
    }
  },
}
