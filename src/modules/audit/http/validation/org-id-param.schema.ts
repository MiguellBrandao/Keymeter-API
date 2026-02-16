import { z } from "zod"

export const OrgIdParamSchema = z.object({
  orgId: z.uuid(),
})

export type OrgIdParamDto = z.infer<typeof OrgIdParamSchema>
