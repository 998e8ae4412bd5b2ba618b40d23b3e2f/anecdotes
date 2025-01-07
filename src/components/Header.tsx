'use client'
import React, {useEffect} from 'react';
import Link from "next/link";
import {Bookmark, Box} from "react-feather";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const Header =  () => {
    const { status, data: sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            router.push('/');
            return;
        }

    }, [status, sessionData?.user.id]);

    const handleRandomAnecdote = async () => {
        try {
            const response = await fetch('/api/anecdotes/random');
            if (!response.ok) throw new Error('Failed to fetch random anecdote');
            const data = await response.json();
            if (data?.id) {
                router.push(`/dashboard/?id=${data.id}`);
            }
        } catch (error) {
            console.error('Error fetching random anecdote:', error);
        }
    };

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
                    onClick={handleRandomAnecdote}
                    className="flex gap-2 cursor-pointer px-[20px] py-2.5 rounded-[10px] bg-random-anecdote-button-gradient"
                >
                    Випадковий анекдоти
                    <img src="/random-joke-cube.svg" alt=""/>
                </div>
                <Link
                    href="/anecdote/create"
                    className="text-blackPrimary text-base font-medium font-['Manrope'] leading-[30px]"
                >Додати анекдот</Link>
            </nav>

            <div className="flex gap-5">
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
                        <img src={sessionData.user.image || ''} className="w-full h-full rounded-[90px] object-cover" alt=""/>
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
        </header>
    );
};

export default Header;