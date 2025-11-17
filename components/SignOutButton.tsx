"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const SignOutButton = () => {
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth")
                    router.refresh()
                }
            }
        })
    }

    return <Button onClick={handleSignOut} className="w-full cursor-pointer">Sign Out</Button>
}
export default SignOutButton