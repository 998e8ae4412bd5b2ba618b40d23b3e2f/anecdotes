import "./globals.css";
import { NextAuthProvider } from "./providers";
import Header from "@/components/Header";
import { Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import AdSense from "@/components/GoogleAd/AdSense";
import GoogleAnalytic from "@/components/GoogleAd/GoogleAnalytic";
import {PageLimiter} from "@/components/PageLimiter";
import {Metadata} from "next";
import Cookie from "@/components/Cookie";

const manrope = Manrope({
    subsets: ["cyrillic"],
    display: "swap",
    variable: "--font-manrope",
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Ласкаво просимо на сайт єАнекдот",
        description: "Постановою Кабінету Міністрів та Президента України В. О. Зеленського від 10.01.2025 року відсоток щастя у побуті громадян має бути підвищений на 20%. У зв'язку з цією ініціативою був заснований сервіс для створення та обміну «смішинками» — єАнекдоти.",
        applicationName: "єАнекдоти'",
        generator: "Next js",
        keywords: [
            "Анекдоти",
            "Смішні історії",
            "Гумор",
            "Жарти",
            "Приколи",
            "Смішні анекдоти",
            "Курйози",
            "Мемчики",
            "Позитив",
            "Веселий настрій",
            "Гумор на кожен день",
            "Життєві жарти",
            "Сміхотерапія",
            "Найкращі анекдоти",
            "Веселі ситуації"
        ],
        creator: "Frant team",
        publisher: "Frant",
        alternates: { canonical: "https://yeanecdoty.com" },
        openGraph: {
            type: "website",
            url: "https://yeanecdoty.com",
            title: "Ласкаво просимо на сайт єАнекдот",
            description: "Постановою Кабінету Міністрів та Президента України В. О. Зеленського від 10.01.2025 року відсоток щастя у побуті громадян має бути підвищений на 20%. У зв'язку з цією ініціативою був заснований сервіс для створення та обміну «смішинками» — єАнекдоти.",
            siteName: "єАнекдоти - найсмішніші анекдоти",
            images: [
                {
                    url: "https://buskanini-fe.vercel.app/og_image.png",
                    secureUrl: "https://buskanini-fe.vercel.app/og_image.png",
                    alt: "єАнекдоти - найсмішніші анекдоти",
                    type: "website",
                    width: "1200px",
                    height: "768px"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            site: "@site",
            creator: "Frant team",
            title: "main_title",
            description: "",
            images: "https://buskanini-fe.vercel.app//og_image.png"
        }
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html className={manrope.variable} lang="en">
        <head>
            <GoogleAnalytic/>
            <AdSense pId="ca-pub-9231756668209801"/>
            <meta name="google-adsense-account" content="ca-pub-9231756668209801"/>
        </head>
        <body
        >
        <NextAuthProvider>
            <Header />
                <PageLimiter>
                    {children}
                </PageLimiter>
            <Toaster />
            <Footer />
            <Cookie/>
        </NextAuthProvider>
        </body>
        </html>
    );
}
