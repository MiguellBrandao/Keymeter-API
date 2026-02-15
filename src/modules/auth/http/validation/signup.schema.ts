import { z } from "zod";

export const SignUpSchema = z.object({
    email: z.email(),
    name: z.string().min(2).max(30),
    password: z.string().min(6)
})

export type SignUpDto = z.infer<typeof SignUpSchema>
