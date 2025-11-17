import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import SignOutButton from "./SignOutButton"
import { auth } from "@/auth"
import { headers } from "next/headers"
import { getInitials } from "@/utils/getInitials"
import { UserCircle } from "lucide-react"

const Header = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="sticky top-0 z-50 border-b bg-background">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 h-20 px-6">
                {session?.user ? (
                    <Link className="text-xl font-medium" href={"/"}>
                        SMApp
                    </Link>
                ) : (
                    <h1 className="text-xl font-medium">
                        SMApp
                    </h1>
                )}

                {session?.user && (
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={session.user.image ?? ""} />
                                    <AvatarFallback>
                                        {getInitials(session.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link className="flex items-center gap-1" href={`/profile/${session.user.username}`}>
                                        <UserCircle />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <SignOutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                )}
            </div>
        </div>
    )
}
export default Header