import { Skeleton } from "./ui/skeleton"

const CommentSkeleton = () => {
    return (
        <div className="border rounded-lg p-4">
            {/* comment header */}
            <div className="flex justify-between gap-4">
                <div className="flex-1 flex gap-2">
                    <Skeleton className="size-10 rounded-full"/>
                    <div className="text-sm font-medium flex gap-1">
                        <div className="flex gap-1">
                            <Skeleton className="h-4 w-40"/>
                            <Skeleton className="h-4 w-[100px]"/>
                        </div>
                        <Skeleton className="h-4 w-6"/>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-col gap-2 my-4">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-1/2"/>
                </div>
            </div>
        </div>
    )
}
export default CommentSkeleton