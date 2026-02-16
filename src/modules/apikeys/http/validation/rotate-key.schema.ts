import { z } from "zod"

export const RotateKeySchema = z.object({
  keyPrefixOld: z.string().regex(/^km_live_[A-Za-z0-9_-]{8}$/),
  scopes: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
})

export type RotateKeyDto = z.infer<typeof RotateKeySchema>
