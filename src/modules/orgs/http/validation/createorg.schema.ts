import { z } from 'zod'

export const CreateOrgSchema = z.object({
    name: z.string().trim().min(2).max(80)
})

export type CreateOrgDto = z.infer<typeof CreateOrgSchema>
