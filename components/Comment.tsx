import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Comment as CommentType } from "@/app/generated/prisma/client"
import { getInitials } from "@/utils/getInitials"
import { timeAgo } from "@/utils/getDate"

type CommentWithOtherDetails = CommentType & {
    user: {
        id: string,
        name: string,
        username: string,
        image: string | null
    }
}

const Comment = ({ comment }: { comment: CommentWithOtherDetails }) => {
    return (
        <div className="border rounded-lg p-4 mb-4">
            {/* comment header */}
            <div className="flex gap-2">
                <Avatar>
                    <AvatarImage src={comment.user.image ?? ""} />
                    <AvatarFallback>
                        {getInitials(comment.user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium flex gap-1">
                    <Link className="flex gap-1" href={`/profile/asdasda`}>
                        <span>{comment.user.name}</span>
                        <span className="text-muted-foreground">@{comment.user.username}</span>
                    </Link>
                    <span className="text-muted-foreground">&#183; {timeAgo(comment.createdAt)}</span>
                </div>
            </div>

            {/* comment body */}

            <div className="mt-4">
                <p className="text-sm text-white/95">
                    {comment.text}
                </p>
            </div>

        </div>
    )
}
export default Comment