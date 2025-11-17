import { Skeleton } from "./ui/skeleton"

const CreateCommentSkeleton = () => {
    return (
        <div className="border rounded-lg p-4 my-4">
            <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-full"/>
                <Skeleton className="flex-1 h-6 rounded-full"/>
                <Skeleton className="w-[60px] h-10 rounded-full"/>
            </div>
        </div>
    )
}
export default CreateCommentSkeleton