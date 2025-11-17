import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

const CreatePostSkeleton = () => {
    return (
        <div className="border p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="size-9 rounded-full"/>
                <Skeleton className="w-full h-6"/>
            </div>

            <Separator />

            <div className="flex justify-between gap-4 mt-2">
                <Skeleton className="h-8 w-18"/>
                <Skeleton className="h-8 w-16 rounded-full"/>
            </div>
        </div>
    )
}
export default CreatePostSkeleton