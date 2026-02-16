import { z } from 'zod'

export const CreateOrgSchema = z.object({
    name: z.string().min(2)
})

export type CreateOrgDto = z.infer<typeof CreateOrgSchema>
