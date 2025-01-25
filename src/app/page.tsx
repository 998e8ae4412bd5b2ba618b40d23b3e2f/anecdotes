import React from "react";
import Link from "next/link";
import {ArrowUpRight} from "react-feather";

export default async function Home() {
    return <div
        className="flex flex-row flex-wrap gap-5 bg-cover bg-center"
    >
        <div className="flex flex-col mb-[10%] mt-[10%]">
            <div className="flex flex-col max-w-[40rem] mb-40">
                <h1 className="text-[#1e1e1e] text-4xl font-bold leading-[39px] mb-5">Ласкаво просимо на сайт
                    єАнекдот</h1>

                <p className="text-[#1e1e1e] text-base font-medium leading-7 pr-6">Постановою Кабінету Міністрів та
                    Президента України В. О. Зеленського від 10.01.2025 року відсоток щастя у побуті громадян має бути
                    підвищений на 20%.
                    У зв'язку з цією ініціативою був заснований сервіс для створення та обміну «смішинками» —
                    єАнекдоти.</p>
                <p className="text-[#d2d2d2] text-sm font-medium leading-snug mb-5">Текст несе тільки гумористиний
                    підконтекст*</p>

                <Link
                    href=""
                    className="inline-block justify-self-end  px-12 bg-black text-white py-3 ml-auto  text-base font-medium font-['Manrope'] rounded-[10px]"
                >Стати щасливим
                </Link>
            </div>

            <Link
                href="/"
                className="relative w-fit flex flex-col h-fit p-5 bg-random-anecdote-button-gradient-anim rounded-[20px] justify-center items-start">
                <h2 className="text-[#1e1e1e] text-2xl font-extrabold leading-[30px] mb-2">Конкурс анекдотів!</h2>
                <p className="text-[#1e1e1e] text-base font-medium font-['Manrope'] leading-7"> Розкажи свій
                    найсмішніший анекдот та вигравай <span
                        className="text-base font-bold">100 гривень!</span></p>

                <div
                    className="absolute top-5 right-5"
                >
                    <ArrowUpRight/>
                </div>
            </Link>
        </div>


        <div className="hidden md:block absolute top-1/2 -z-10 -translate-y-1/2 right-0 ">
            <img src="/images/main/anecdotes-bg.png" alt="anecdotes-bg"/>
        </div>

        {/*<img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-screen -z-10"*/}
        {/*     src="/images/main/gradient-bg.webp"*/}
        {/*     alt="gradient-bg"/>*/}
    </div>
}