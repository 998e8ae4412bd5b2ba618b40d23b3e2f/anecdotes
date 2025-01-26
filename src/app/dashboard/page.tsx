'use client';

import React, {Suspense, useEffect, useState} from 'react';
import AnecdoteGridLayout from "@/components/AnecdoteGrid/AnecdoteGridLayout";
import EmptyMessage from "@/components/EmptyMessage";
import Filter from "@/components/Filter/Filter";
import { useSearchParams} from "next/navigation";
import {AnecdoteBase} from "@/types/anecdote.types";


const getAnecdotes = async (page: number, categories: string[]) => {
    const categoryParams = categories.length > 0 ? `&categories=${categories.join(',')}` : '';
    try {
        const res = await fetch(`/api/anecdotes?new=true&page=${page}${categoryParams}`, {
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
    const [newAnecdotes, setNewAnecdotes] = useState<AnecdoteBase[]>([]);
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
                setNewAnecdotes(userAnecdotes.newest)
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
        <div className="flex flex-col mx-auto md:mt-11 pb-16 ">
            <div className="flex flex-col sm:flex-row gap-5 md:gap-5 pb-20">
                <Filter/>

                <section className={`relative w-full flex ${anecdotes.length === 0 && !loading.anecdotes ? `justify-center items-center` : ''}`}>
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


            <section className="sm:w-[80%]">
                <h1 className="text-[#1e1e1e] text-2xl font-extrabold">Ласкаво просимо на сайт єАнекдот — Вашого джерела для найкращих анекдотів!</h1>
                <br/>
                <p className="text-[#1e1e1e] text-sm font-medium">єАнекдот – новий законопроєкт від Зеленського, це ваш найкращий вибір для якісного українського гумору!
                    Якщо ви шукаєте смішні анекдоти, анекдоти українською, або просто хочете підняти собі настрій новими анекдотами, то ви потрапили за адресою.
                    Наша база даних налічує тисячі анекдотів, що робить її найбільшою колекцією, доступною в Інтернеті.
                </p>
                <br/>
                <p className="text-[#1e1e1e] text-sm font-medium">Ми зібрали для вас найкращі жарти, приколи та історії, які гарантовано розсмішать вас до сліз.
                    Не знайшли анекдоту? Не смішно?  Створіть свій анекдот, і ви зможете поділитисясвоїм гумором з всіма
                    єАнекдот – це не просто сміх; це про святкування та збереження багатства українського гумору та мови.
                </p>
                <br/>
                <p className="text-[#1e1e1e] text-sm font-medium">
                    Як це працює?<br/>  Просто оберіть категорію, яка вам цікава, і насолоджуйтесь сміхом. Наш сайт є ідеальним місцем для пошуку смішних історій, щоб розвеселити себе і своїх друзів.
                    єАнекдот — сміх, який завжди під рукою. <br/>Насолоджуйтесь свіжими анекдотами щодня!
                </p>
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