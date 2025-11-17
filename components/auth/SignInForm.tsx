"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { SignInFormDataType, signInFormSchema } from "@/schemas/signInFormSchema"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const SignInForm = () => {
    const [isPending, setIsPending] = useState(false)

    const router = useRouter()

    const form = useForm<SignInFormDataType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSignIn = async (formData: SignInFormDataType) => {
        setIsPending(true)
        try {

            await authClient.signIn.email(
                {
                    email: formData.email,
                    password: formData.password,
                    callbackURL: "/"
                },
                {
                    onSuccess: () => {
                        toast.success("Signed up successfully")
                        router.push("/")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                }
            )

        } catch(error) {
            console.log(error)
        } finally {
            setIsPending(false)
        }
    }


    return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignIn)} autoComplete="off" className="space-y-4">
                <FormField 
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Email Address" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Spinner className="size-6"/> : "Sign In"}
                </Button>
            </form>
        </Form>
    )
}
export default SignInForm