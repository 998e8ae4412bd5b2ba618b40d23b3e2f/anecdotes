import "./globals.css";
import { NextAuthProvider } from "./providers";
import Header from "@/components/Header";
import {Manrope} from "next/font/google"

const manrope = Manrope({
    subsets: ['cyrillic'],
    display: 'swap',
    variable: '--font-manrope',
    weight: ['200', '300', '400', '500', '600', '700', '800']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
        className={`${manrope.variable}`}
        lang="en">
    <body>
        <div className="max-w-[1440px] mx-auto  px-12">
            <Header/>
            <NextAuthProvider>
                {children}
            </NextAuthProvider>
        </div>
    </body>
    </html>
  );
}
