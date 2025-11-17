import prisma from "@/lib/prisma"
import Post from "./Post"
import { auth } from "@/auth"
import { headers } from "next/headers"

type Props = {
    userProfileId?: string
}

const Feed = async ({ userProfileId }: Props) => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return null

    const followings = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true }
    })

    const followingsIds = followings.map((f) => f.followingId)

    const posts = await prisma.post.findMany({
        where: userProfileId ? { userId: userProfileId } : { userId: { in: [session.user.id, ...followingsIds]} },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                    savedPosts: true,
                }
            },
            likes: { where: { userId: session.user.id }, select: { id: true }},
            savedPosts: { where: { userId: session.user.id }, select: { id: true }}
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="flex flex-col gap-2 mt-4">
            {posts.length === 0 && (
                <div className="flex justify-center my-2">
                    <h2>No posts yet</h2>
                </div>
            )}

            {posts.map((post) => (
                <Post key={post.id} post={post}/>
            ))}
        </div>
    )
}
export default Feed