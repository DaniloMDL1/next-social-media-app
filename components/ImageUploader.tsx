import { UploadDropzone } from "@/utils/uploadthing"
import { X } from "lucide-react"
import { OurFileRouter } from "@/app/api/uploadthing/core"

type Props = {
    endpoint: keyof OurFileRouter,
    onChange: (url: string, key: string) => void,
    value: string
}

const ImageUploader = ({ endpoint, onChange, value }: Props) => {

    if(value) {
        return (
            <div className="relative">
                <div className="w-full rounded-lg overflow-hidden">
                    <img 
                        src={value}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="absolute -top-2 -right-2">
                    <button onClick={() => onChange("", "")} type="button" className="cursor-pointer">
                        <X />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].ufsUrl, res?.[0].key)
            }}
            onUploadError={(error: Error) => {
                console.log(error)
            }}
            className="ut-button:bg-white ut-button:text-black ut-button:cursor-pointer ut-label:text-muted-foreground ut-label:hover:text-muted-foreground/80 h-[300px] ut-button:ut-uploading:bg-neutral-400/80"
        />
    )
}

export default ImageUploader
