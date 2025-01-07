import React from 'react';
import Link from "next/link";
import {Mail, Send} from "react-feather";

const Footer = () => {
    return (
        <footer className="flex justify-center items-center h-[69px] w-full bg-[#1E1E1E] z-10 ">
            <div className='flex justify-between items-center w-full mx-auto  max-w-[1440px] px-12'>
                <div
                    className="text-center text-white text-xs font-normal font-['Manrope'] leading-none"
                >© 2024 Веселі анекдоти. Всі права захищено.
                </div>

                <Link
                    href='/dashboard'
                    className="text-white text-2xl font-bold font-['e-Ukraine'] leading-[30px]">
                    єАнекдоти
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        className="flex gap-1.5 items-center jus text-center text-white text-sm font-normal font-['Manrope'] leading-none"
                        href="mailto:email@example.com"
                    >
                        <Mail size={16}/>
                        email@example.com
                    </Link>
                    <Link
                        className="flex gap-1.5 items-center text-center text-white text-sm font-normal font-['Manrope'] leading-none"
                        href="http://telegram/@example.com"
                    >
                        <Send size={16}/>
                        Telegram
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;