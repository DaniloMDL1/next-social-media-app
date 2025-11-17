"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

const commentFormSchema = z.object({
    postId: z.string(),
    text: z.string().min(1, "Text is required")
})

const addComment = async (prevState: { success: boolean, error: string }, formData: FormData) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return { success: false, error: "Not authenticated" }

    const postId = formData.get("postId") as string
    const text = formData.get("text") as string

    const validatedFields = commentFormSchema.safeParse({
        postId,
        text
    })

    if(!validatedFields.success) {
        return { success: false, error: "Invalid fields" }
    }

    try {

        await prisma.comment.create({
            data: {
                userId: session.user.id,
                ...validatedFields.data
            }
        })

        revalidatePath(`/posts/${postId}`)

        return { success: true, error: "" }

    } catch(error) {
        console.log(error)
        return { success: false, error: "Something went wrong" }
    }
}

export { addComment }