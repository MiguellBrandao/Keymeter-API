import { z } from 'zod'
import { Role } from '../../../../common/prisma/generated/enums.js'

export const ChangeRoleSchema = z.object({
    userId: z.uuid(),
    role: z.enum(Role)
})

export type ChangeRoleDto = z.infer<typeof ChangeRoleSchema>
