"use client"

import { getInitials } from "@/utils/getInitials"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Camera } from "lucide-react"
import { UploadButton } from "@/utils/uploadthing"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

type Props = {
    userProfileImage: string,
    userProfileName: string
}

const UserProfileUploadAvatar = ({ userProfileImage, userProfileName }: Props) => {
    const router = useRouter()
    
    return (
        <div className="relative group">
            <Avatar className="size-12">
                <AvatarImage src={userProfileImage} />
                <AvatarFallback>
                    {getInitials(userProfileName)}
                </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-1 -right-1 group">
                <UploadButton
                    endpoint="avatarImage"
                    onClientUploadComplete={async (res) => {
                        
                        await authClient.updateUser(
                            {
                                image: res?.[0].ufsUrl
                            },
                            {
                                onSuccess: () => {
                                    toast.success("Profile image updated successfully")
                                    router.refresh()
                                },
                                onError: (ctx) => {
                                    toast.error(ctx.error.message)
                                }
                            }
                        )
                    }}
                    onUploadError={(error: Error) => {
                        console.log(error)
                    }}
                    className="ut-button:max-w-max ut-button:max-h-max ut-button:bg-transparent ut-allowed-content:hidden ut-button:opacity-0 ut-button:group-hover:opacity-100 ut-button:transition-all"
                    content={{
                        button: <Camera className="size-5 text-muted-foreground hover:text-muted-foreground/80"/>
                    }}
                />
            </div>
        </div>
    )
}
export default UserProfileUploadAvatar