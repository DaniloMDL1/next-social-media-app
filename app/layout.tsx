import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Social Media App",
    description: "Social Media App with Next.js",
    icons: { icon: "/logo.svg" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.className} antialiased flex flex-col`}
            >
                <Header />
                <div className="flex-1">
                    {children}
                </div>

                <Toaster theme="dark" position="top-center" richColors/>
            </body>
        </html>
    );
}
