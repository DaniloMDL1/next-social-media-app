import { z } from "zod"

export const signInFormSchema = z.object({
    email: z.email({ error: "Email Address is required"}),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export type SignInFormDataType = z.infer<typeof signInFormSchema>