import "./globals.css";
import { NextAuthProvider } from "./providers";
import Header from "@/components/Header";
import { Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import AdSense from "@/components/GoogleAd/AdSense";
import GoogleAnalytic from "@/components/GoogleAd/GoogleAnalytic";

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
        <head>
            <GoogleAnalytic/>
            <AdSense pId="ca-pub-9231756668209801" />
            <meta name="google-adsense-account" content="ca-pub-9231756668209801" />
        </head>
        <body
        >
        <NextAuthProvider>
            <Header />
            <div className="flex-1 px-4 pr-8 sm:px-12 w-full max-w-[1440px] mx-auto">
                {children}
            </div>
            <Toaster />
            <Footer />

        </NextAuthProvider>
        </body>
        </html>
    );
}
