"use client"

import { ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/utils/getInitials"
import CreatePostSkeleton from "./CreatePostSkeleton"
import { FormEvent, useState } from "react"
import ImageUploader from "./ImageUploader"
import { createPost } from "@/actions/postActions"
import { toast } from "sonner"

const CreatePostForm = () => {
    const [showDropzone, setShowDropzone] = useState(false)

    const [text, setText] = useState("")
    const [postImage, setPostImage] = useState({
        url: "",
        key: ""
    })

    const [isCreatePostPending, setIsCreatePostPending] = useState(false)

    const { data: session, isPending } = authClient.useSession()

    if(isPending) return <CreatePostSkeleton />

    if(!session) return null

    const handleCreatePost = async (e: FormEvent) => {
        e.preventDefault()
        setIsCreatePostPending(true)
        try {

            const response = await createPost(text, postImage.url, postImage.key)

            if(response.error) {
                toast.error(response.error)
                return

            } else if(response.success) {
                toast.success("Post has been created successfully")
                setText("")
                setPostImage({ url: "", key: "" })
                setShowDropzone(false)
            }

        } catch(error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setIsCreatePostPending(false)
        }
    }

    return (
        <div className="border p-4 rounded-lg">
            <div className="">
                <div className="flex items-center gap-2 mb-4">
                    <Avatar>
                        <AvatarImage src={session.user.image ?? ""} />
                        <AvatarFallback>
                            {getInitials(session.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <input 
                        placeholder="Type something!?"
                        className="flex-1 rounded-lg text-sm py-1 outline-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {(showDropzone || postImage.url) && (
                    <div className="my-4">
                        <ImageUploader 
                            endpoint="postImage"
                            value={postImage.url}
                            onChange={(url, key) => {
                                setPostImage({ url, key })
                            }}
                        />
                    </div>
                )}

                <Separator />
                
                <div className="flex justify-between items-center gap-4 mt-2">
                    <Button onClick={() => setShowDropzone(!showDropzone)} type="button" className="cursor-pointer" variant={"ghost"}>
                        <ImageIcon />
                        <span>Image</span>
                    </Button>

                    <Button onClick={handleCreatePost} disabled={isCreatePostPending || !text && !postImage.url} className="rounded-full cursor-pointer">
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default CreatePostForm