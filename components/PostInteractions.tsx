"use client"

import { likeUnlikePost, saveUnsavePost } from "@/actions/postActions"
import { Bookmark, Heart, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOptimistic, useState } from "react"

type Props = {
    likes: number,
    isLiked: boolean,
    comments: number,
    saves: number,
    isSaved: boolean,
    postId: string
}

const PostInteractions = ({ likes, isLiked, comments, saves, isSaved, postId }: Props) => {

    const [state, setState] = useState({
        likes,
        isLiked,
        saves,
        isSaved
    })

    const router = useRouter()

    const likeUnlikePostAction = async () => {
        setOptimisicCount("like")
        await likeUnlikePost(postId)
        
        setState((prev) => {
            return {
                ...prev,
                isLiked: !prev.isLiked,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
            }
        })

    }

    const saveUnsavePostAction = async () => {
        setOptimisicCount("save")
        await saveUnsavePost(postId)

        setState((prev) => {
            return {
                ...prev,
                isSaved: !prev.isSaved,
                saves: prev.isSaved ? prev.saves - 1 : prev.saves + 1
            }
        })
    }

    const [optimisticCount, setOptimisicCount] = useOptimistic(
        state,
        (prev, type: "like" | "save") => {
            if(type === "like") {
                return {
                    ...prev,
                    isLiked: !prev.isLiked,
                    likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
                }
            }

            if(type === "save") {
                return {
                    ...prev,
                    isSaved: !prev.isSaved,
                    saves: prev.isSaved ? prev.saves - 1 : prev.saves + 1
                }
            }

            return prev
        }
    )
    
    return (
        <div className="flex items-center gap-4 px-2">
            <form action={likeUnlikePostAction}>
                <button className="flex items-center gap-1 text-muted-foreground cursor-pointer">
                    <Heart className={`size-5 ${optimisticCount.isLiked ? "fill-current text-red-700" : ""}`}/>
                    <span className="text-sm">{optimisticCount.likes}</span>
                </button>
            </form>
            <button onClick={() => router.push(`/posts/${postId}`)} className="flex items-center gap-1 text-muted-foreground cursor-pointer">
                <MessageCircle className="size-5"/>
                <span className="text-sm">{comments}</span>
            </button>
            <form action={saveUnsavePostAction}>
                <button className="flex items-center gap-1 text-muted-foreground cursor-pointer">
                    <Bookmark className={`size-5 ${optimisticCount.isSaved ? "fill-current text-amber-400" : ""}`}/>
                    <span className="text-sm">{optimisticCount.saves}</span>
                </button>
            </form>
        </div>
    )
}
export default PostInteractions