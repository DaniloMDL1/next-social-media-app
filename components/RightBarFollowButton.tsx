"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { followUser } from "@/actions/userActions"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

type Props = {
    targetUserId: string,
    targetUserUsername: string
}

const RightBarFollowButton = ({ targetUserId, targetUserUsername }: Props) => {
    const [isPending, setIsPending] = useState(false)

    const handleFollow = async () => {
        setIsPending(true)
        try {

            const response = await followUser(targetUserId, targetUserUsername)

            if(response.error) {
                toast.error(response.error)
            } else if(response.success) {
                toast.success("User has been followed successfully")
            }

        } catch(error) {
            console.log(error)
        } finally {
            setIsPending(false)
        }
    }
    

    return (
        <Button onClick={handleFollow} className="rounded-full cursor-pointer">
            {isPending ? <Spinner className="size-6"/> : "Follow"}
        </Button>
    )
}
export default RightBarFollowButton