import { auth } from "@/auth"
import EditProfileButton from "@/components/EditProfileButton"
import Feed from "@/components/Feed"
import FollowButton from "@/components/FollowButton"
import PostSkeleton from "@/components/PostSkeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserProfileUploadAvatar from "@/components/UserProfileUploadAvatar"
import prisma from "@/lib/prisma"
import { getInitials } from "@/utils/getInitials"
import { Camera, MapPin } from "lucide-react"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

type Props = {
    params: Promise<{ username: string }>
}

const ProfilePage = async ({ params }: Props) => {
    const { username } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect("/auth")
    }

    const userProfile = await prisma.user.findUnique({
        where: { username: username },
        include: {
            _count: {
                select: {
                    followings: true,
                    followers: true,
                    posts: true
                }
            },
            followers: { where: { followerId: session.user.id }, select: { id: true }}
        }
    })

    if(!userProfile) notFound()

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <UserProfileUploadAvatar 
                            userProfileImage={userProfile.image ?? ""}
                            userProfileName={userProfile.name}
                        />
                        <div className="flex flex-col font-medium">
                            <span>{userProfile.name}</span>
                            <span className="text-sm text-muted-foreground">@{userProfile.username}</span>
                        </div>
                    </div>

                    {userProfile.id !== session.user.id ? (
                        <FollowButton 
                            isFollowing={!!userProfile.followers.length}
                            userProfileId={userProfile.id}
                        />
                    ) : (
                        <EditProfileButton />
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    {userProfile.bio && (
                        <p className="text-white/90 text-sm">
                            {userProfile.bio}
                        </p>
                    )}
                    {userProfile.location && (
                        <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-5"/>
                            <span className="text-sm">{userProfile.location}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-4">
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

            </div>

            <Suspense fallback={
                <div className="flex flex-col gap-2 mt-4">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            }>
                <Feed userProfileId={userProfile.id}/>
            </Suspense>
        </div>
    )
}
export default ProfilePage