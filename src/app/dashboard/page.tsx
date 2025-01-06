'use client';

import React, {Suspense, useEffect, useState} from 'react';
import AnecdotesGrid from "@/app/dashboard/(components)/AnecdotesGrid/AnecdotesGrid";
import { Button } from "@/components/ui/button";

const getData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
        cache: 'no-cache',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    const { data } = await res.json();
    return data;
};
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

const Page = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [anecdotes, setAnecdotes] = useState<AnecdoteBase[]>([]);
    const [pagesAmount, setPagesAmount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const categoriesColors = ['#beaefb', '#fccdf1', '#f6c4cf'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                const userAnecdotes = await getAnecdotes(currentPage, selectedCategories);
                setAnecdotes(userAnecdotes.data);
                setPagesAmount(userAnecdotes.totalPages);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            }
        };
        fetchAnecdotes();
    }, [selectedCategories, currentPage]);

    const handleCategorySelect = (category: string) => {
        setSelectedCategories(prev => {
            setCurrentPage(1)
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    return (
        <div className="flex mx-auto gap-5 mt-11">
            <div className="w-full max-w-64">
                <div className="flex flex-col gap-6 mb-3.5">
                        <span
                            className="text-blackPrimary text-2xl font-extrabold font-['Manrope'] leading-[30px]"
                        >
                            Категорії
                        </span>

                    <Button
                        onClick={() => setSelectedCategories([])}
                        className="h-[50px] px-5 py-2.5 bg-blackPrimary text-white rounded-[10px] justify-center items-center gap-2.5 inline-flex"
                    >
                        Всі категорії
                    </Button>
                </div>

                <div className="mb-2.5">
                        <span
                            className="text-blackPrimary text-xs font-semibold font-['Manrope'] leading-[15px]"
                        >
                            Топ категорії
                        </span>

                    <ul className="flex flex-col gap-1.5">
                        {
                            categories.slice(0, 3).map((item: Category, i: number) => {
                                const categoryColor = selectedCategories.includes(item.title) ? 'black' : categoriesColors[i];

                                return (
                                    <li
                                        style={{backgroundColor: categoryColor}}
                                        className={`rounded-[12px] px-6 py-1 text-blackPrimary text-sm font-normal font-['Manrope'] leading-[30px] cursor-pointer ${selectedCategories.includes(item.title) ? 'text-white' : ''}`}
                                        key={item.id}
                                        onClick={() => handleCategorySelect(item.title)}
                                    >
                                        {item.title}
                                    </li>
                                );
                            })
                        }

                    </ul>
                </div>

                <ul className="flex flex-wrap gap-x-5 gap-y-2.5 mb-2.5">
                    {
                        categories.slice(4, 50).map((item: Category) => {
                            return (
                                <li
                                    className={`rounded-[12px] px-2 text-blackPrimary text-sm font-normal font-['Manrope'] leading-[30px] cursor-pointer   ${selectedCategories.includes(item.title) ? 'bg-black text-white' : ''}`}
                                    key={item.id}
                                    onClick={() => handleCategorySelect(item.title)}
                                >
                                    {item.title}
                                </li>
                            );
                        })
                    }
                </ul>

                {/*<Button*/}
                {/*    variant='ghost'*/}
                {/*    className="p-0 gap-3 text-blackPrimary text-sm font-medium font-['Manrope'] leading-[30px]"*/}
                {/*>*/}
                {/*    Більше категорій*/}

                {/*    <ChevronDown />*/}
                {/*</Button>*/}
            </div>

            <section className="pb-16">
                <Suspense fallback={<div>Loading...</div>}>
                    <AnecdotesGrid
                        currentPage={currentPage}
                        pagesAmount={pagesAmount}
                        setCurrentPage={setCurrentPage}
                        anecdotes={anecdotes}
                        setAnecdotes={setAnecdotes}
                    />
                </Suspense>
            </section>
        </div>
    );
};

export default Page;
