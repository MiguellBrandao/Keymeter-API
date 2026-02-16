import { z } from "zod"

export const RevokeInviteSchema = z.object({
    inviteId: z.uuid(),
})

export type RevokeInviteDto = z.infer<typeof RevokeInviteSchema>
