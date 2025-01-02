'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import {signOut, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Image from "next/image";

const getUser = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user?userId=${id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const { data } = await res.json();
    return data;
};

const getAnecdotes = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes?userId=${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch anecdotes");
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

const Page = () => {
    const { status, data: sessionData } = useSession();
    const router = useRouter();
    // const [anecdotes, setAnecdotes] = useState<Anecdote[]>([]);
    const [user, setUser] = useState<User>()
    const { name, email, emailVerified, image } = user || {};
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [userEditData, setUserEditData] = useState({
        name: '',
        image: ''
    });

    // const deleteAnecdote = async (id: string) => {
    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //
    //         if (res.ok) {
    //             setAnecdotes((prevAnecdotes) =>
    //                 prevAnecdotes.filter((anecdote) => anecdote.id !== id)
    //             );
    //         } else {
    //             console.error('Failed to delete anecdote');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting anecdote:', error);
    //     }
    // };

    const handleUpdateUser = async () => {
        await updateUser(userEditData.name, userEditData.image)
        setIsEdit(false)
    }

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            router.push('/');
            return;
        }

        // const fetchAnecdotes = async () => {
        //     try {
        //         const userAnecdotes = await getAnecdotes(sessionData.user.id);
        //         setAnecdotes(userAnecdotes);
        //     } catch (error) {
        //         console.error("Error fetching anecdotes:", error);
        //     }
        // };
        const fetchUser = async (id: string) => {
            try {
                const userData = await getUser(id)
                setUser(userData)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUser(sessionData.user.id)
        // fetchAnecdotes();

    }, [status, sessionData?.user.id, router]);

    const isEmailVerified = emailVerified === null ? 'no' : 'yes';

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return string;
        } catch (_) {
            return 'https://avatars.githubusercontent.com/u/173141809?v=4';
        }
    };


    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="max-w-20 h-20 border-solid border-gray-200 border-2">
                        <Image
                            className="rounded-full w-full h-full inline object-cover"
                            src={isValidUrl(userEditData.image || image || '')}
                            alt="kracen"
                            width={100}
                            height={100}
                        />
                    </div>
                    {isEdit && <Input
                        value={userEditData.image}
                        onChange={(e) => setUserEditData({...userEditData, image: e.target.value})}
                        placeholder={'url'}
                        className="font-semibold text-lg"
                        required
                    /> }
                    <div>name:
                        {!isEdit ? userEditData.name || name : <Input
                            value={userEditData.name}
                            onChange={(e) => setUserEditData({...userEditData, name: e.target.value})}
                            placeholder={sessionData?.user.name || ''}
                            className="font-semibold text-lg"
                            required
                        /> }
                    </div>
                    <div>email: {email}</div>
                    <div>emailVerified: {isEmailVerified}</div>

                    <div>
                        {
                            !isEdit ?
                                <Button className="w-fit" onClick={() => setIsEdit(!isEdit)}>Edit</Button>
                                : <div className="flex gap-4">
                                    <Button
                                        onClick={handleUpdateUser}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={() => setIsEdit(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                        }
                    </div>
                    <Button className="w-fit" onClick={() => signOut()}>Sign out</Button>
                </CardHeader>
            </Card>

            <section className="pt-48">
                <h1>Anecdotes</h1>
                {/*{anecdotes?.map((anecdote: Anecdote) => (*/}
                {/*    <Anecdote*/}
                {/*        anecdote={anecdote}*/}
                {/*        deleteAnecdote={() => deleteAnecdote(anecdote.id)}*/}
                {/*        key={anecdote.id}*/}
                {/*    />*/}
                {/*))}*/}
            </section>
        </div>
    );
};

export default Page;
