'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import Anecdote from "@/components/Anecdote";
import {signOut, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";

const getUser = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/user?userId=${id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const { data } = await res.json();
    return data;
};

const getAnecdotes = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/anecdotes?userId=${id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch anecdotes");
    }

    const { data } = await res.json();
    return data;
};

const Page = () => {
    const { status, data: sessionData } = useSession();
    const router = useRouter();
    const [anecdotes, setAnecdotes] = useState<Anecdote[]>([]);
    const [user, setUser] = useState<User>()

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            router.push('/');
            return;
        }

        const fetchAnecdotes = async () => {
            try {
                const userAnecdotes = await getAnecdotes(sessionData.user.id);
                setAnecdotes(userAnecdotes);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
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

    }, [status, sessionData?.user.id, router]);

    const { name, email, emailVerified, image } = user || {};
    const isEmailVerified = emailVerified === null ? 'no' : 'yes';

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="max-w-20 max-h-20 border-solid border-gray-200 border-2">
                        <img
                            className="rounded-full w-full h-full inline object-cover"
                            src={image}
                            alt="kracen"
                        />
                    </div>
                    <div>name: {name}</div>
                    <div>email: {email}</div>
                    <div>emailVerified: {isEmailVerified}</div>

                    <Button className="w-fit" onClick={() => signOut()}>Sign out</Button>
                </CardHeader>
            </Card>

            <section className="pt-48">
                <h1>Anecdotes</h1>
                {anecdotes?.map((anecdote) => (
                    <Anecdote anecdote={anecdote} key={anecdote.id} />
                ))}
            </section>
        </div>
    );
};

export default Page;
