import React from 'react';
import Link from "next/link";
import {Bookmark, Box, User} from "react-feather";

const Header = () => {
    return (
        <header className="relative w-full flex items-center justify-between py-8">
            <Link
                href='/dashboard'
                className="text-blackPrimary text-2xl font-bold font-['e-Ukraine'] leading-[30px]">
                єАнекдоти
            </Link>
            <nav className="flex items-center gap-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link
                    href="/dashboard"
                    className="text-blackPrimary text-base font-medium font-['Manrope'] leading-[30px]"
                >Головна</Link>
                <div
                    className="flex gap-2 px-[20px] py-2.5 rounded-[10px] bg-random-anecdote-button-gradient"
                >
                    Випадковий анекдоти
                    <Box/>
                </div>
                <Link
                    href="/anecdot/create"
                    className="text-blackPrimary text-base font-medium font-['Manrope'] leading-[30px]"
                >Додати анекдот</Link>
            </nav>

            <div className="flex gap-5">
                <div className="flex items-center gap-2">
                    Збережені
                    <Bookmark fill='bleck'/>
                </div>

                <div className="hidden items-center gap-4">
                    <div>
                        Вхід
                    </div>
                    <Link
                        className="px-5 py-2.5 bg-blackPrimary flex text-white rounded-[10px] justify-center items-center gap-2.5"
                        href={'/auth/login'}>
                        Реєстрація
                    </Link>
                </div>

                <Link
                    href='/profile'
                    className="p-[13px] bg-blackPrimary rounded-[10px] justify-start items-center gap-2.5 inline-flex">
                    <User stroke="white"/>
                </Link>
            </div>
        </header>
    );
};

export default Header;