import { z } from "zod"

export const signUpFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 charaters"),
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.email({ error: "Email Address is required"}),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.confirmPassword === data.password, { path: ["confirmPassword"], error: "Passwords must match"})

export type SignUpFormDataType = z.infer<typeof signUpFormSchema>