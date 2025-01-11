'use client'
import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {Bookmark, Box, Menu} from "react-feather";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Skeleton} from "@/components/ui/skeleton";


const LoginOrRegForm = () => {
    return ( <>
        <Link
            href={'/auth/login'}
            className="px-5 py-2.5 w-full justify-center text-center"
        >
            Вхід
        </Link>
        <Link
            className="px-5 py-2.5 bg-blackPrimary flex text-white rounded-[10px] justify-center items-center gap-2.5"
            href={'/auth/login'}>
            Реєстрація
        </Link>
    </>)
}

const Header =  () => {
    const { status: sessionStatus, data: sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            router.push('/');
            return;
        }

    }, [sessionStatus, sessionData?.user.id]);

    const handleRandomAnecdote = async () => {
        try {
            const response = await fetch('/api/anecdotes/random');
            if (!response.ok) throw new Error('Failed to fetch random anecdote');
            const data = await response.json();
            if (data?.id) {
                router.push(`/dashboard/?id=${data.id}&isRandom=true`);
            }
        } catch (error) {
            console.error('Error fetching random anecdote:', error);
        }
    };


    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => {
            const isOpen = !prev;
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            return isOpen;
        });
    };


    return (
        <header className={`
        relative px-4 sm:px-12 w-full flex items-center justify-between py-8
        
      
        `}>
            <Link
                href='/dashboard'
                className="text-blackPrimary text-2xl font-bold font-['e-Ukraine'] leading-[30px] z-20">
                єАнекдоти
            </Link>


            <nav
                className="hidden md:flex items-center gap-8 xl:gap-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <Link
                    href="/dashboard"
                    className="text-blackPrimary text-base font-medium font-['Manrope'] leading-[30px]"
                >Головна</Link>
                <div
                    onClick={handleRandomAnecdote}
                    className="flex xl:gap-2 cursor-pointer px-3 xl:px-5 py-2.5 rounded-[10px] bg-random-anecdote-button-gradient"
                >
                    <span
                        className="text-[#1e1e1e] text-base font-medium font-['Manrope'] leading-[30px] hidden xl:block">Випадковий анекдоти</span>
                    <img src="/random-joke-cube.svg" alt=""/>
                </div>
                <Link
                    href="/anecdote/create"
                    className="text-blackPrimary text-base font-medium font-['Manrope'] leading-[30px]"
                >Додати анекдот</Link>
            </nav>

            <div className="hidden md:flex gap-5">
                {
                    sessionData && <Link
                        href="/saved"
                        className="flex items-center gap-2">
                        Збережені
                        <Bookmark fill='bleck'/>
                    </Link>}

                {
                    sessionData ? <Link
                        href='/profile'
                        className="w-[50px] h-[50px]  justify-start items-center gap-2.5 inline-flex">
                        <img src={sessionData.user.image || ''}
                             className="w-full h-full rounded-[90px] object-cover" alt=""/>
                    </Link> : <div className="flex items-center gap-4">
                        <Link
                            href={'/auth/login'}>
                            Вхід
                        </Link>
                        <Link
                            className="px-5 py-2.5 bg-blackPrimary flex text-white rounded-[10px] justify-center items-center gap-2.5"
                            href={'/auth/login'}>
                            Реєстрація
                        </Link>
                    </div>
                }
            </div>


            <div className="block md:hidden z-10">
                <div className="flex items-center gap-8 ">
                    <div
                        onClick={handleRandomAnecdote}
                        className="flex xl:gap-2 cursor-pointer px-3 xl:px-5 z-10 py-2.5 rounded-[10px] bg-random-anecdote-button-gradient"
                    >
                        <span
                            className="text-[#1e1e1e] text-base font-medium font-['Manrope'] z-10 leading-[30px] hidden xl:block">Випадковий анекдоти</span>
                        <img src="/random-joke-cube.svg" alt=""/>
                    </div>

                    <Menu size={22} className="z-10" onClick={toggleMenu}/>
                </div>

                {isMenuOpen && <div
                    className="before:content-[''] before:fixed before:w-full before:h-[100vh] before:bg-[rgba(0,0,0,0.3)] before:left-0 before:top-0 -z-1"
                />}

                {isMenuOpen && <div
                    className="absolute pt-20 top-0 p-4 left-0 bg-white w-full rounded-bl-[1.5rem] rounded-br-[1.5rem] animate-slideDown">
                    <nav className="pt-16 flex flex-col gap-5">
                        <Link
                            href="/"
                        >
                            Головна
                        </Link>
                        <Link
                            href="/anecdote/create"
                        >
                            Свторити анекдот
                        </Link>
                    </nav>

                    <div className="pb-5 flex justify-between pt-10 ">
                        {sessionStatus === 'loading' ? null : !sessionData && <LoginOrRegForm/>}

                        {sessionStatus === 'loading' ? null : sessionData && <div className="flex gap-4 items-center">
                            <Link
                                href='/profile'
                                className="w-[50px] h-[50px]  justify-start items-center gap-2.5 inline-flex">

                                {
                                    sessionData?.user.image ? <img src={sessionData?.user.image || ''}
                                                                   className="h-12 w-12 rounded-[90px] object-cover"
                                                                   alt=""/> :
                                        <Skeleton className="h-12 w-12 rounded-full"/>
                                }

                                <span className="text-[#343434] text-base font-medium font-['Manrope'] leading-[30px]">
                                    профіль
                                </span>

                            </Link>
                        </div>}

                        <Link
                            href="/saved"
                            className="text-[#343434] text-base font-medium font-['Manrope'] leading-[30px] flex items-center gap-2">
                            Збережені
                        </Link>
                    </div>
                </div>}
            </div>
        </header>
    );
};

export default Header;