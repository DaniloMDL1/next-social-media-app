import { MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { headers } from "next/headers"
import { getInitials } from "@/utils/getInitials"
import Link from "next/link"

const ProfileCard = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const userProfile = await prisma.user.findUnique({
        where: { id: session?.user.id },
        include: {
            _count: {
                select: {
                    followings: true,
                    followers: true,
                    posts: true
                }
            }
        }
    })

    if(!userProfile) return null

    return (
        <div className="border p-4 rounded-lg space-y-4 sticky top-24.5">
            <Link href={`/profile/${userProfile.username}`} className="flex flex-col gap-4 items-center">
                <Avatar className="size-14">
                    <AvatarImage src={userProfile.image ?? ""} />
                    <AvatarFallback>
                        {getInitials(userProfile.name)}
                    </AvatarFallback>
                </Avatar>   
                <div className="flex flex-col items-center">
                    <span>{userProfile.name}</span>
                    <span className="text-muted-foreground text-sm">@{userProfile.username}</span>
                </div>
            </Link>
            {userProfile.bio && (
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        {userProfile.bio}
                    </p>
                </div>
            )}

            <Separator />
        
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col items-center text-muted-foreground">
                    <span className="text-sm max-md:text-xs">Followings</span>
                    <span className="text-xs">{userProfile._count.followings}</span>
                </div>

                 <div className="flex flex-col items-center text-muted-foreground">
                    <span className="text-sm max-md:text-xs">Followers</span>
                    <span className="text-xs">{userProfile._count.followers}</span>
                </div>

                 <div className="flex flex-col items-center text-muted-foreground">
                    <span className="text-sm max-md:text-xs">Posts</span>
                    <span className="text-xs">{userProfile._count.posts}</span>
                </div>
            </div>

            <Separator />

            <div className="">
                {userProfile.location && (
                    <div className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-5"/>
                        <span className="text-sm">{userProfile.location}</span>
                    </div>
                )}
            </div>


        </div>
    )
}
export default ProfileCard