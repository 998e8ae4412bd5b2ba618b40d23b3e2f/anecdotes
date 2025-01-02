'use client';

import React, { useEffect, useState } from 'react';
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

const Page = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [anecdotes, setAnecdotes] = useState<Anecdote[]>([]);
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

    const handleCategorySelect = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    return (
        <div className="flex mx-auto justify-between gap-5 mt-11">
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
                                const categoryColor = selectedCategories.includes(item.title) ? 'black' :  categoriesColors[i];

                                return (
                                    <li
                                        style={{ backgroundColor: categoryColor }}
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

            <AnecdotesGrid
                anecdotes={anecdotes}
                setAnecdotes={setAnecdotes}
                selectedCategories={selectedCategories}
            />
        </div>
    );
};

export default Page;
