"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

const followUnfollowUser = async (targetUserId: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return

    if(session.user.id === targetUserId) return

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId: targetUserId
            }
        }
    })

    if(existingFollow) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId
                }
            }
        })
    } else {
        await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: targetUserId
            }
        })
    }
}

const followUser = async (targetUserId: string, targetUserUsername: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return { error: "Not authenticated" }

    if(session.user.id === targetUserId) return { error: "Not able to follow yourself" }

    try {
        await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: targetUserId
            }
        })

        revalidatePath("/")
        revalidatePath(`/profile/${session.user.username}`)
        revalidatePath(`/profile/${targetUserUsername}`)

        return { success: true, error: "" }

    } catch(error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

export { followUnfollowUser, followUser }