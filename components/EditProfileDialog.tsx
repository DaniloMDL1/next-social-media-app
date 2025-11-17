"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const editProfileFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(2, "Username must be at least 2 characters"),
    bio: z.string().optional(),
    location: z.string().optional(),
    image: z.string().optional()
})

type EditProfileFormDataType = z.infer<typeof editProfileFormSchema>

const EditProfileDialog = ({ open, setOpen }: Props) => {
    const [error, setError] = useState("")

    const { data: session } = authClient.useSession()

    const router = useRouter()

    const form = useForm<EditProfileFormDataType>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            name: "",
            username: "",
            bio: "",
            location: ""
        }
    })

    useEffect(() => {
        if(session?.user) {
            form.reset({
                name: session.user.name,
                username: session.user.username,
                bio: session.user.bio ?? "",
                location: session.user.location ?? ""
            })
        }

    }, [session?.user])
    
    const onEditProfile = async (formData: EditProfileFormDataType) => {
        setError("")

        try {
            await authClient.updateUser(
                {
                    name: formData.name,
                    username: formData.username,
                    bio: formData.bio,
                    location: formData.location,
                },
                {
                    onSuccess: () => {
                        setOpen(false)
                        toast.success("Profile updated successfully")
                        setError("")
                        router.push(`/profile/${formData.username}`)
                        router.refresh()
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message)
                    }
                }
            )

        } catch(error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex justify-center">
                        <div className="">
                            <Alert variant={"destructive"}>
                                <AlertCircleIcon />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </div>

                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEditProfile)} className="space-y-4">
                        <div className="flex md:items-center gap-4 max-md:flex-col">
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
                        </div>
                        
                        <FormField 
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bio" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Location" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={form.formState.isSubmitting} type="submit" className="rounded-full cursor-pointer w-[60px]">
                            {form.formState.isSubmitting ? <Spinner className="size-6"/> : "Save"}
                        </Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
export default EditProfileDialog