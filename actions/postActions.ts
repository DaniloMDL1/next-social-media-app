"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { UTApi } from "uploadthing/server"

const createPost = async (text: string, postImage: string, postImageKey: string) => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return { error: "Not authenticated"}

    if(!text && !postImage) return { error: "Text or post image is required"}

    try {
        await prisma.post.create({
            data: {
                userId: session.user.id,
                text,
                postImage,
                postImageKey
            }
        })

        revalidatePath("/")

        return { success: true }

    } catch(error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

const deletePost = async (postId: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return { error: "Not authenticated" } 

    const post = await prisma.post.findUnique({
        where: { id: postId }
    })

    if(!post) return { error: "Post not found"}

    const utapi = new UTApi()

    if(post.postImageKey) {
        await utapi.deleteFiles(post.postImageKey)
    }

    try {
        await prisma.post.delete({
            where: { id: postId }
        })

        revalidatePath("/")
        revalidatePath(`/profile/${session.user.username}`, "page")

        return { success: true }

    } catch(error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

const likeUnlikePost = async (postId: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return

    if(!postId) return

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: session.user.id,
                postId
            }
        }
    })

    if(existingLike) {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId
                }
            }
        })
    } else {
        await prisma.like.create({
            data: {
                userId: session.user.id,
                postId
            }
        })
    }
}   

const saveUnsavePost = async (postId: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return

    if(!postId) return

    const existingSave = await prisma.savedPost.findUnique({
        where: {
            userId_postId: {
                userId: session.user.id,
                postId
            }
        }
    })

    if(existingSave) {
        await prisma.savedPost.delete({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId
                }
            }
        })

    } else {
        await prisma.savedPost.create({
            data: {
                userId: session.user.id,
                postId
            }
        })
    }
}

export { createPost, deletePost, likeUnlikePost, saveUnsavePost }