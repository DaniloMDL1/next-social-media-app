import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image"
import { Post as PostType } from "@/app/generated/prisma/client"
import { getInitials } from "@/utils/getInitials"
import { timeAgo } from "@/utils/getDate"
import PostInteractions from "./PostInteractions"
import Link from "next/link"
import { auth } from "@/auth"
import { headers } from "next/headers"
import DeletePostButton from "./DeletePostButton"

type PostWithOtherDetails = PostType & {
    user: {
        id: string,
        name: string,
        username: string,
        image: string | null
    },
    _count: {
        likes: number,
        comments: number,
        savedPosts: number
    },
    likes: {
        id: string
    }[],
    savedPosts: {
        id: string
    }[]
}

const Post = async ({ post }: { post: PostWithOtherDetails }) => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return null

    return (
        <div className="border rounded-lg p-4">
            {/* post header */}
            <div className="flex justify-between gap-4">
                <div className="flex-1 flex gap-2">
                    <Link href={`/profile/${post.user.username}`}>
                        <Avatar>
                            <AvatarImage src={post.user.image ?? ""} />
                            <AvatarFallback>
                                {getInitials(post.user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="text-sm font-medium flex gap-1">
                        <Link className="flex gap-1" href={`/profile/${post.user.username}`}>
                            <span>{post.user.name}</span>
                            <span className="text-muted-foreground">@{post.user.username}</span>
                        </Link>
                        <span className="text-muted-foreground">&#183; {timeAgo(post.createdAt)}</span>
                    </div>
                </div>

                {post.user.id === session.user.id && (
                    <DeletePostButton postId={post.id}/>
                )}
            </div>

            <div className="mb-4">
                {post.text && (
                    <Link href={`/posts/${post.id}`} className="text-sm text-white/95">
                        {post.text}
                    </Link>
                )}

                {post.postImage && (
                    <Link href={`/posts/${post.id}`}>
                        <div className="border rounded-lg p-2 mt-2">
                            <div className="w-full h-[300px] rounded-lg overflow-hidden relative">
                                <Image 
                                    src={post.postImage}
                                    fill
                                    alt="Post Image"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </Link>

                )}
            </div>

            <PostInteractions 
                likes={post._count.likes}
                isLiked={!!post.likes.length}
                comments={post._count.comments}
                saves={post._count.savedPosts}
                isSaved={!!post.savedPosts.length}
                postId={post.id}
            />

        </div>
    )
}
export default Post