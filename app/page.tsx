import { auth } from "@/auth"
import CreatePostForm from "@/components/CreatePostForm"
import Feed from "@/components/Feed"
import PostSkeleton from "@/components/PostSkeleton"
import ProfileCard from "@/components/ProfileCard"
import RightBar from "@/components/RightBar"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const HomePage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect("/auth")
    }

    return (
        <div className="max-w-[1450px] mx-auto p-4">
            <div className="flex gap-4">
                <div className="flex-[0.4] max-md:hidden">
                    <ProfileCard />
                </div>

                <div className="flex-1 md:max-w-[550px]">
                    <CreatePostForm />

                    <Suspense fallback={
                        <div className="flex flex-col gap-2 mt-4">
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </div>
                    }>
                        <Feed />
                    </Suspense>
                    
                </div>

                <div className="flex-[0.4] max-lg:hidden">
                    <RightBar />
                </div>
            </div>

        </div>
    )
}
export default HomePage