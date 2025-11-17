"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SignUpFormDataType, signUpFormSchema } from "@/schemas/signUpFormSchema"
import { useState } from "react"
import { Spinner } from "../ui/spinner"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const SignUpForm = () => {
    const [isPending, setIsPending] = useState(false)

    const router = useRouter()

    const form = useForm<SignUpFormDataType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSignUp = async (formData: SignUpFormDataType) => {
        setIsPending(true)
        try {

            await authClient.signUp.email(
                {
                    name: formData.name,
                    username: formData.username,
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
            <form onSubmit={form.handleSubmit(onSignUp)} autoComplete="off" className="space-y-6">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField 
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Confirm Password" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Spinner className="size-6"/> : "Create Account"}
                </Button>
            </form>
        </Form>
    )
}
export default SignUpForm