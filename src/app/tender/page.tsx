import React from 'react';
import Link from "next/link";
import {ArrowUpRight} from "react-feather";
import Timer from "@/components/Timer";

const Page = () => {
    return (
        <>
            <section className="flex flex-col xl:flex-row justify-between items-center pt-20 pb-48">
                <div className="flex flex-col lg:max-w-[535px] mb-20 xl:mb-0">
                    <h1 className="text-[#1e1e1e] text-4xl font-bold leading-[39px] mb-2">
                        <span className="bg-gradient-to-r from-[#EB748E] via-[#8E77E4] to-[#D50C69] inline-block text-transparent bg-clip-text">100 гривень</span> за найсмішніший анекдот!
                    </h1>
                    <p className="text-[#1e1e1e] text-lg font-medium font-['Manrope'] leading-7 mb-6">
                        Долучайся до конкурсу анекдотів на платформі єАнекдоти! Надішли свій найкращий жарт, збери лайки
                        та
                        вигравай 100 гривень.
                        <br/>
                        <br/>
                        <span className="font-bold">Гумор винагороджується!</span>
                    </p>

                    <Link
                        href="/anecdote/create"
                        className="inline-flex justify-self-end bg-black text-white px-5 py-3.5 ml-auto  text-base font-medium font-['Manrope'] rounded-[10px] gap-2.5"
                    >
                        Створити анекдот

                        <ArrowUpRight/>
                    </Link>
                </div>

                <div>
                    <div className="flex gap-3 items-center mb-12">
                        <img
                            className="h-6 w-6 object-cover"
                            src="/images/tender/party.png" alt=""/>
                        <h2 className="text-[#1e1e1e] text-2xl font-extrabold font-['Manrope'] leading-[30px]">
                            Умови участі:</h2>
                    </div>


                    <div className="flex flex-col gap-20">
                        <div className="relative max-w-[456px] pl-8">
                            <div
                                className="absolute top-0 left-0 opacity-50 text-[#fccdf1] text-[115px] font-extrabold leading-7 -z-10">1
                            </div>
                            <p className="text-[#343434] text-lg font-medium leading-7"><span
                                className="text-[#1e1e1e] font-bold">Реєстрація:</span> Щоб взяти участь,
                                зареєструйтеся
                                або увійдіть у свій обліковий запис на платформі єАнекдоти.</p>
                        </div>

                        <div className="relative max-w-[456px] pl-8 md:-ml-20">
                            <div
                                className="absolute top-0 left-0 opacity-50 text-[#fac8b4] text-[115px] font-extrabold leading-7 -z-10">2
                            </div>
                            <p className="text-[#343434] text-lg font-medium leading-7"><span
                                className="text-[#1e1e1e] font-bold">Публікація анекдоту:</span> Надішліть свій
                                унікальний і авторський анекдот через форму на сторінці конкурсу.</p>
                        </div>

                        <div className="relative max-w-[456px] pl-8">
                            <div
                                className="absolute top-0 left-0 opacity-50 text-[#beaefb] text-[115px] font-extrabold leading-7 -z-10">3
                            </div>
                            <p className="text-[#343434] text-lg font-medium leading-7"><span
                                className="text-[#1e1e1e] font-bold">Обмеження:</span> Один учасник може подати
                                максимум 3 анекдоти за конкурс.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-24 md:pt-48 pb-32">
                <div className="flex flex-col items-center mb-40">
                    <img src="/images/tender/think.png" alt="think" className="mb-4"/>
                    <h3 className="text-[#1e1e1e] text-4xl font-bold mb-5">Що оцінується</h3>

                    <p className="text-center text-black text-lg font-semibold leading-relaxed">Змушуєш
                        нас сміятися до сліз? Ти вже близько до перемоги!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-4">
                    <div className="flex flex-col gap-2 before:content-[''] before:absolute before:w-[388px] before:h-[149px] before:opacity-90 before:bg-[#c3fdfe] before:blur-[200px] before:-z-10">
                        <div className="flex items-center gap-2">
                            <img src="/images/tender/humor.png" alt="humor.png" className=""/>
                            <p className="text-black text-2xl font-extrabold font-['Manrope'] leading-[30px]">Гумор:</p>
                        </div>
                        <p className="pl-10 text-black text-lg font-medium font-['Manrope'] leading-7">"Це смішно
                            чи дуже смішно?" — саме це вирішують наші користувачі та журі!
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 before:absolute before:w-[388px] before:h-[149px] before:opacity-90 before:bg-[#cffcc0] before:blur-[200px] before:-z-10">
                            <img src="/images/tender/star.png" alt="humor.png" className=""/>
                            <p className="text-black text-2xl font-extrabold font-['Manrope'] leading-[30px]">Оригінальність:</p>
                        </div>
                        <p className="pl-10 text-black text-lg font-medium font-['Manrope'] leading-7">Твій анекдот має бути унікальним — ніякого копіювання, тільки твоє почуття гумору!
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 before:absolute before:w-[388px] before:h-[149px] before:opacity-90 before:bg-[#fac8b4] before:blur-[200px] before:-z-10">
                            <img src="/images/tender/heart.png" alt="heart.png" className=""/>
                            <p className="text-black text-2xl font-extrabold font-['Manrope'] leading-[30px]">Популярність:</p>
                        </div>
                        <p className="pl-10 text-black text-lg font-medium font-['Manrope'] leading-7">Чим більше лайків, тим більше шансів перемогти! Поділися своїм анекдотом із друзями!
                        </p>
                    </div>
                </div>
            </section>


            <section className="flex flex-col items-center pt-32">
                <img src="/images/tender/rocket.png" alt="rocket image" className="mb-3"/>
                <h4 className="text-center text-[#1e1e1e] text-4xl font-bold mb-5"> Як
                    дізнатися результати?
                </h4>

                <p className="text-black text-lg font-semibold font-['Manrope'] leading-relaxed mb-10 max-w-2xl text-center">Результати будуть
                    оголошені в нашому <Link href='/' className="text-[#1386f8]">телеграм</Link> каналі, а переможця
                    повідомлять на електронну пошту.</p>

                <Link
                    href="/anecdote/create"
                    className="inline-flex items-center xl:gap-2 cursor-pointer px-3 xl:px-5 py-2.5 rounded-[10px] bg-random-anecdote-button-gradient-anim animate-gradientAnimation bg-[length:300%_300%] mb-24"
                >
                    <span
                        className="text-[#1e1e1e] text-base font-medium leading-[30px] block whitespace-nowrap">Взяти участь у конкунсі</span>
                    <ArrowUpRight/>
                </Link>


                <div className="flex flex-col gap-5 mb-48">
                    <p className="text-center text-black text-2xl font-bold">Таймер
                        Судного дня
                    </p>

                    <Timer/>

                </div>
            </section>
        </>
    );
};

export default Page;