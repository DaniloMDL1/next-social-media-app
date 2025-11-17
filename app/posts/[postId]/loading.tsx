import CommentSkeleton from "@/components/CommentSkeleton"
import PostSkeleton from "@/components/PostSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
    return (
        <div className="max-w-xl mx-auto p-4">
            <Skeleton className="h-6 w-18"/>

            <div className="my-4">
                <PostSkeleton />
            </div>

            <div className="flex flex-col gap-4">
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        </div>  
    )
}
export default Loading