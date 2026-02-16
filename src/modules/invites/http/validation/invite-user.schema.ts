import { z } from "zod"
import { Role } from "../../../../common/prisma/generated/enums.js"

export const InviteUserSchema = z.object({
    orgId: z.uuid(),
    userId: z.uuid(),
    role: z.enum(Role),
})

export type InviteUserDto = z.infer<typeof InviteUserSchema>
