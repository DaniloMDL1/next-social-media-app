"use client"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/utils/getInitials"
import { Button } from "./ui/button"
import { useActionState } from "react"
import { addComment } from "@/actions/commentActions"
import { Spinner } from "./ui/spinner"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import CreateCommentSkeleton from "./CreateCommentSkeleton"

type Props = {
    postId: string
}

const CreateCommentForm = ({ postId }: Props) => {
    const [state, formAction, isCreateCommentPending] = useActionState(addComment, { success: false, error: "" })

    const { data: session, isPending } = authClient.useSession()

    if(isPending) return <CreateCommentSkeleton />

    if(!session) return null

    return (
        <div className="rounded-lg p-4 border my-4">
            <form action={formAction}>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={session.user.image ?? ""} />
                        <AvatarFallback>
                            {getInitials(session.user.name ?? "")}
                        </AvatarFallback>
                    </Avatar>

                    <input type="hidden" name="postId" value={postId}/>

                    <input 
                        placeholder="Add a comment?!"
                        className="outline-none flex-1"
                        name="text"
                    />

                    <Button disabled={isCreateCommentPending} className="rounded-full w-[60px] cursor-pointer self-end">
                        {isCreateCommentPending ? <Spinner className="size-6"/> : "Post"}
                    </Button>
                </div>
            </form>

            {state.error && (
                <div className="flex justify-center mt-2">
                    <div className="">
                        <Alert variant={"destructive"}>
                            <AlertCircleIcon />
                            <AlertDescription>
                                {state.error}
                            </AlertDescription>
                        </Alert>
                    </div>

                </div>
            )}
        </div>
    )
}
export default CreateCommentForm