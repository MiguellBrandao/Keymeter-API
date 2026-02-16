import { z } from "zod"

export const RevokeKeySchema = z.object({
  keyPrefix: z.string().regex(/^km_live_[A-Za-z0-9_-]{8}$/),
})

export type RevokeKeyDto = z.infer<typeof RevokeKeySchema>
