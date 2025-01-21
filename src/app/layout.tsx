import "./globals.css";
import { NextAuthProvider } from "./providers";
import Header from "@/components/Header";
import { Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import AdSense from "@/components/GoogleAd/AdSense";

const manrope = Manrope({
    subsets: ["cyrillic"],
    display: "swap",
    variable: "--font-manrope",
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html className={manrope.variable} lang="en">
        <head />
        <body>
        <NextAuthProvider>
            <Header />
            <div className="max-w-[1440px] mx-auto px-4 sm:px-12 min-h-full">
                <main>{children}</main>
            </div>
            <Toaster />
            <Footer />
            <AdSense pId="ca-pub-9231756668209801" />
        </NextAuthProvider>
        </body>
        </html>
    );
}
