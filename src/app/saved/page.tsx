'use client'
import React, {Suspense, useEffect, useState} from 'react';
import AnecdotesGrid from "@/app/dashboard/(components)/AnecdotesGrid/AnecdotesGrid";

const getAnecdotes = async (page: number, categories: string[]) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/saved`, {
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        });

        if (!res.ok) {
            throw new Error("Failed to fetch anecdotes");
        }

        const { data } = await res.json();
        return data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const Page = () => {
    const [anecdotes, setAnecdotes] = useState<AnecdoteBase[]>([]);

    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                const userAnecdotes = await getAnecdotes(1, []);
                setAnecdotes(userAnecdotes);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            }
        };
        fetchAnecdotes();
    }, []);

    return (
        <section className="flex justify-center pt-24">
            <Suspense fallback={<div>Loading...</div>}>
            <AnecdotesGrid
                currentPage={1}
                pagesAmount={1}
                setCurrentPage={() => {}}
                anecdotes={anecdotes}
                setAnecdotes={setAnecdotes}
            />
            </Suspense>
        </section>
    );
};

export default Page;