import { z } from "zod"

export const DeleteMemberParamSchema = z.object({
  orgId: z.uuid(),
  userId: z.uuid(),
})

export type DeleteMemberParamDto = z.infer<typeof DeleteMemberParamSchema>
