import { z } from 'zod'

export const DeleteMemberSchema = z.object({
    userId: z.uuid(),
})

export type DeleteMemberDto = z.infer<typeof DeleteMemberSchema>
