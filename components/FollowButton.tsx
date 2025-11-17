"use client"

import { useOptimistic, useState } from "react"
import { Button } from "./ui/button"
import { followUnfollowUser } from "@/actions/userActions"

type Props = {
    isFollowing: boolean,
    userProfileId: string
}

const FollowButton = ({ isFollowing, userProfileId }: Props) => {
    const [state, setState] = useState(isFollowing)
    
    const followUnfollowAction = async () => {
        setOptimisticFollow("")
        await followUnfollowUser(userProfileId)

        setState((prev) => !prev)
    }

    const [optimisticFollow, setOptimisticFollow] = useOptimistic(
        state,
        (prev) => !prev
    )

    return (
        <form action={followUnfollowAction}>
            <Button className="rounded-full cursor-pointer">
                {optimisticFollow ? "Unfollow" : "Follow"}
            </Button>
        </form>
    )
}
export default FollowButton