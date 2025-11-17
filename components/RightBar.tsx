import { auth } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { getInitials } from "@/utils/getInitials"
import Link from "next/link"
import RightBarFollowButton from "./RightBarFollowButton"

const RightBar = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const suggestedUsers = await prisma.user.findMany({
        where: {
            AND: [
                { NOT: { id: session?.user.id } },
                { NOT: { followers: { some: { followerId: session?.user.id }}}}
            ]
        },
        select: {
            id: true,
            image: true,
            name: true,
            username: true
        },
        take: 5,
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="sticky top-24.5">
            
            <div className="border rounded-lg p-4">
                <h2 className="font-medium">Suggested Users</h2>

                {suggestedUsers.length === 0 && (
                    <div className="flex justify-center my-2">
                        <p>No suggested users</p>
                    </div>
                )}

                <div className="flex flex-col gap-4 mt-4">
                    {suggestedUsers.map((suggestedUser) => (
                        <div key={suggestedUser.id} className="flex items-center gap-2">
                            <Link href={`/profile/${suggestedUser.username}`} className="flex-1 flex items-center gap-1">
                                <Avatar>
                                    <AvatarImage src={suggestedUser.image ?? ""} />
                                    <AvatarFallback>
                                        {getInitials(suggestedUser.name)}
                                    </AvatarFallback>
                                </Avatar> 
                                <div className="flex flex-col text-sm">
                                    <span>{suggestedUser.name}</span>
                                    <span className="text-muted-foreground">@{suggestedUser.username}</span>
                                </div>
                            </Link>

                            <RightBarFollowButton targetUserId={suggestedUser.id} targetUserUsername={suggestedUser.username}/>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
export default RightBar