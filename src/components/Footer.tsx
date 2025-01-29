import React from 'react';
import Link from "next/link";
import {Mail, Send} from "react-feather";

const Footer = () => {
    return (
        <footer className="flex justify-center items-center h-fit sm:min-h-[69px] w-full bg-[#1E1E1E] z-10 ">
            <div className='flex justify-between md:flex-row-reverse py-6 md:py-0 items-center flex-col sm:flex-row w-full gap-8 mx-auto  max-w-[1440px] px-12'>
                <div className="flex flex-col md:flex-row md:gap-8 items-center gap-2.5">
                    <Link
                        className="flex gap-1.5 items-center jus text-center text-white text-sm font-normal"
                        href="mailto:yeanecdoty@gmail.com"
                    >
                        <Mail size={16}/>
                        yeanecdoty@gmail.com
                    </Link>
                    <Link
                        className="flex gap-1.5 items-center text-center text-white text-sm font-normal"
                        href="https://t.me/yeanekdoty"
                    >
                        <Send size={16}/>
                        Telegram
                    </Link>
                </div>

                <div className="flex flex-col">
                    <Link
                        href='/dashboard'
                        className="text-white text-2xl font-bold font-['e-Ukraine'] leading-[30px]">
                        єАнекдоти
                    </Link>
                    <Link
                        target="_blank"
                        href='https://frant.digital'
                        about="_blank"
                        className="text-center text-white text-xs font-normal">
                        Made by Frant
                    </Link>
                </div>


                <div
                    className="text-center text-white text-xs font-normal font-['Manrope'] leading-none"
                >
                    ©{new Date().getFullYear()} єАнекдоти. Всі права захищено. <Link href={'/policy'}>Права користувача</Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;