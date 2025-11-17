"use client"

import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { deletePost } from "@/actions/postActions"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

type Props = {
    postId: string
}

const DeletePostButton = ({ postId }: Props) => {
    const [isPending, setIsPending] = useState(false)

    const handleDeletePost = async () => {
        setIsPending(true)
        try {

            const response = await deletePost(postId)

            if(response.error) {
                toast.error(response.error)
                return

            } else if(response.success) {
                toast.success("Post has been deleted successfully")
            }

        } catch(error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Button onClick={handleDeletePost} disabled={isPending} className="cursor-pointer p-2 rounded-full" variant={"ghost"}>
            {isPending ? <Spinner className="size-5 text-red-700"/> : <Trash className="text-red-700 hover:text-red-700/90"/>}
        </Button>
    )
}
export default DeletePostButton