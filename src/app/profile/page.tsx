'use client';
import React, {Suspense, useEffect, useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {signOut, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {Settings} from "react-feather";
import EmptyMessage from "@/components/EmptyMessage";
import AnecdoteGridLayout from "@/components/AnecdoteGrid/AnecdoteGridLayout";
import {Skeleton} from "@/components/ui/skeleton";
import Loader from "@/components/Loaders/Loader";

const getUser = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user?userId=${id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const { data } = await res.json();
    return data;
};

const updateUser = async (name: string, image: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
            cache: 'no-cache',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                image
            })
        });

        const {data} = await res.json();
        return data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const getAnecdotes = async (id: string, page: number, categories: string[]) => {
    const userId = id ? `&userId=${id}` : ''
    const categoryParams = categories.length > 0 ? `&categories=${categories.join(',')}` : '';
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes?page=${page}${categoryParams}${userId}`, {
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        });

        if (!res.ok) {
            throw new Error("Failed to fetch anecdotes");
        }

        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const Page = () => {
    const { status, data: sessionData } = useSession();
    const router = useRouter();
    const [anecdotes, setAnecdotes] = useState<AnecdoteBase[]>([]);
    const [user, setUser] = useState<User>()
    const { name, email, emailVerified, image } = user || {};
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [userEditData, setUserEditData] = useState({
        name: '',
        image: ''
    });
    const [pagesAmount, setPagesAmount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)

    const handleUpdateUser = async () => {
        await updateUser(userEditData.name, userEditData.image)
        setIsEdit(false)
    }

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            return;
        }

        const fetchAnecdotes = async () => {
            try {
                setLoading(true)
                const userAnecdotes = await getAnecdotes(sessionData.user.id, currentPage, []);
                setAnecdotes(userAnecdotes.data);
                setPagesAmount(userAnecdotes.totalPages);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            } finally {
                setLoading(false)
            }
        };
        const fetchUser = async (id: string) => {
            try {
                const userData = await getUser(id)
                setUser(userData)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUser(sessionData.user.id)
        fetchAnecdotes();
    }, [status, sessionData?.user.id, router, currentPage]);

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return string;
        } catch (_) {
            return 'https://avatars.githubusercontent.com/u/173141809?v=4';
        }
    };

    return (
        <div className="flex gap-6 flex-col sm:flex-row">
            <Card className=" sm:w-64 p-0">
                <CardHeader className="flex gap-5 flex-row sm:flex-col p-0 sm:p-6 pb-6 sm:pb-0">
                    <div className="w-[90px] h-[90px] sm:w-[203px] sm:h-[203px]">
                        {
                            image === undefined ? <Skeleton
                                className="w-full h-[203px] rounded-lg"
                            /> :  <Image
                                className="w-full rounded-lg h-full inline object-cover aspect-square"
                                src={isValidUrl(userEditData.image || image || ' ')}
                                alt="kracen"
                                width={100}
                                height={100}
                            />
                        }
                    </div>
                    <div className={`flex flex-col ${isEdit ? 'justify-between' : 'justify-end'} `}>
                        {isEdit && <Input
                            value={userEditData.image}
                            onChange={(e) => setUserEditData({...userEditData, image: e.target.value})}
                            placeholder={'url'}
                            className="text-[#4c4c4c] text-xs font-light font-['Manrope']"
                            required
                        />}
                        <div className="flex flex-col justify-end justify-self-end mt-0 sm:mt-2">
                            <span className="text-[#4c4c4c] text-xs font-light font-['Manrope']">{!isEdit && 'Імя:'}</span>
                            {!isEdit ? <p className='truncate'>{userEditData.name || name}</p> : <Input
                                value={userEditData.name}
                                onChange={(e) => setUserEditData({...userEditData, name: e.target.value})}
                                placeholder={sessionData?.user.name || ''}
                                className="text-[#4c4c4c] text-xs font-light font-['Manrope']"
                                required
                            />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-0 pt-3">
                    <div className="w-full">
                        {
                            !isEdit ?
                                <Button className="h-12 w-full" onClick={() => setIsEdit(!isEdit)}>
                                    <Settings/>
                                    Редагувати Інформацію
                                </Button>

                                : <div className="flex gap-4">
                                    <Button
                                        className="w-full"
                                        variant='link'
                                        onClick={handleUpdateUser}
                                    >
                                        Скасувати
                                    </Button>
                                    <Button
                                        className="w-full"
                                        onClick={() => setIsEdit(false)}
                                    >
                                        Зберегти
                                    </Button>
                                </div>
                        }
                    </div>
                    {!isEdit && <Button variant='ghost' className="w-full p-0 text-[#d32e2e] text-xs font-light font-['Manrope']" onClick={() => signOut()}>Вийти з аккаунту</Button>}
                </CardContent>
            </Card>


            {anecdotes.length !== 0 && <section className="pb-12">
                <h1 className="text-[#1e1e1e] text-2xl font-extrabold font-['Manrope'] leading-[30px] mb-4 pl-2">
                    Мої анекдоти</h1>

                <AnecdoteGridLayout
                    currentPage={currentPage}
                    pagesAmount={pagesAmount}
                    setCurrentPage={setCurrentPage}
                    anecdotes={anecdotes}
                    setAnecdotes={setAnecdotes}
                />
            </section>}

            {
                (anecdotes.length === 0) && <div className="py-16 ms:py-0 flex items-center justify-center w-full">
                    <Loader/>
                </div>
            }

            {
                (anecdotes.length === 0 && !loading) && <div className="py-16 ms:py-0 flex items-center justify-center w-full">
                    <EmptyMessage
                        title='Тут пустельніше, ніж у моїй кишені після зарплати.'
                        content='Врятуйте цю сторінку від гумористичної пустки!'
                    />
                </div>
            }
        </div>
    );
};

export default Page;
