"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import EditProfileDialog from "./EditProfileDialog"

const EditProfileButton = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} variant={"outline"} className="rounded-full cursor-pointer">
                Edit Profile
            </Button>

            <EditProfileDialog 
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}
export default EditProfileButton