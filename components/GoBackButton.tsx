"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

const GoBackButton = () => {

    const router = useRouter()

    return (
        <Button onClick={() => router.back()} variant={"ghost"} className="mb-4 cursor-pointer">
            <ArrowLeft />
            <span>Go Back</span>
        </Button>
    )
}
export default GoBackButton