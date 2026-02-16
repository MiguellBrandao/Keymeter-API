import { z } from "zod"

export const CreateApiKeySchema = z.object({
  name: z.string().trim().min(2).max(80),
  scopes: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
})

export type CreateApiKeyDto = z.infer<typeof CreateApiKeySchema>
