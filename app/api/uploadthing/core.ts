import { auth } from "@/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    postImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
    .middleware(async ({ req }) => {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) throw new UploadThingError("Unauthorized");

        return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {

      return { fileKey: file.key, fileUrl: file.ufsUrl };
    }),


    avatarImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    }).middleware(async () => {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session) throw new UploadThingError("Unauthorized")

        return { userId: session.user.id }

    }).onUploadComplete(async ({ metadata, file }) => {
        
        return { fileUrl: file.ufsUrl}
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
