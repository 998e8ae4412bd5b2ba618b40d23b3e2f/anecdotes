'use client';

import React, {Suspense, useEffect, useState} from 'react';
import AnecdoteGridLayout from "@/components/AnecdoteGrid/AnecdoteGridLayout";
import EmptyMessage from "@/components/EmptyMessage";
import Filter from "@/components/Filter/Filter";
import { useSearchParams} from "next/navigation";



const getAnecdotes = async (page: number, categories: string[]) => {
    const categoryParams = categories.length > 0 ? `&categories=${categories.join(',')}` : '';
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes?page=${page}${categoryParams}`, {
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


const PageContent = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [anecdotes, setAnecdotes] = useState<AnecdoteBase[]>([]);
    const [pagesAmount, setPagesAmount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [loading, setLoading] = useState({
        categories: true,
        anecdotes: true
    });
    const searchParams = useSearchParams();

    useEffect(() => {
        const categories = searchParams.get("categories")
        if (categories === null) return setSelectedCategories([]);
        setSelectedCategories(categories?.split(','))
    }, [searchParams]);


    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                setLoading(prev => ({ ...prev, anecdotes: true }));
                const userAnecdotes = await getAnecdotes(currentPage, selectedCategories);
                setAnecdotes(userAnecdotes.data);
                setPagesAmount(userAnecdotes.totalPages);
            } catch (error) {
            } finally {
                setLoading(prev => ({ ...prev, anecdotes: false }));
            }
        };
        fetchAnecdotes();
    }, [selectedCategories, currentPage]);

    return (
        <div className="flex flex-col sm:flex-row mx-auto gap-5 md:gap-5 md:mt-11">
            <Filter/>

            <section className={`relative w-full pb-16 flex ${anecdotes.length === 0 && !loading.anecdotes && `justify-center items-center`}`}>
                {anecdotes.length === 0 && !loading.anecdotes ?
                    <EmptyMessage
                        title='На жаль жодного анекдоту не було знайдено!'
                        content='I am the man who sold the world'
                    /> : <AnecdoteGridLayout
                        currentPage={currentPage}
                        pagesAmount={pagesAmount}
                        setCurrentPage={setCurrentPage}
                        anecdotes={anecdotes}
                        setAnecdotes={setAnecdotes}
                    />
                }
            </section>
        </div>
    );
}



const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
};

export default Page;