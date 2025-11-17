import { auth } from "@/auth"
import Comment from "@/components/Comment"
import CreateCommentForm from "@/components/CreateCommentForm"
import GoBackButton from "@/components/GoBackButton"
import Post from "@/components/Post"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

type Props = {
    params: Promise<{ postId: string }>
}

const PostPage = async ({ params }: Props) => {
    const { postId } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect("/auth")
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
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
                    savedPosts: true
                }
            },
            likes: { where: { userId: session.user.id }, select: { id: true }},
            savedPosts: { where: { userId: session.user.id }, select: { id: true }}
        }
    })

    if(!post) notFound()

    const postComments = await prisma.comment.findMany({
        where: { postId: post.id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="max-w-xl mx-auto p-4">
            <GoBackButton />

            <Post post={post}/>

            <CreateCommentForm postId={post.id}/>

            {postComments.map((comment) => (
                <Comment key={comment.id} comment={comment}/>
            ))}
        </div>
    )
}
export default PostPage