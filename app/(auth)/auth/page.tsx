import { auth } from "@/auth"
import SignInForm from "@/components/auth/SignInForm"
import SignUpForm from "@/components/auth/SignUpForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const AuthPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session) {
        redirect("/")
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">

            <div className="max-w-sm w-full bg-card rounded-lg p-6">

                <Tabs defaultValue="sign-up">
                    <TabsList className="w-full">
                        <TabsTrigger className="cursor-pointer" value="sign-up">Sign Up</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="sign-in">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign-up">
                        <SignUpForm />
                    </TabsContent>
                    <TabsContent value="sign-in">
                        <SignInForm />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}
export default AuthPage