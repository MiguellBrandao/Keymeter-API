import { z } from "zod"

export const AcceptInviteSchema = z.object({
    inviteId: z.uuid(),
    token: z.string().min(1),
})

export type AcceptInviteDto = z.infer<typeof AcceptInviteSchema>
