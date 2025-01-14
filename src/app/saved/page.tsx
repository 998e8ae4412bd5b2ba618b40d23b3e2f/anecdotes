'use client'
import React, {Suspense, useEffect, useState} from 'react';
import AnecdotesGrid from "@/components/AnecdoteGrid/AnecdotesGrid";
import {Button} from "@/components/ui/button";
import AnecdoteGridLayout from "@/components/AnecdoteGrid/AnecdoteGridLayout";

const getCategories = async () => {
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
    try {
        const categoryParams = categories.length > 0 ? `&categories=${categories.join(',')}` : '';

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/saved?${categoryParams}`, {
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
    const [categories, setCategories] = useState([]);
    const [anecdotes, setAnecdotes] = useState<AnecdoteBase[]>([]);
    const [loading, setLoading] = useState({
        categories: true,
        anecdotes: true
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                setLoading({...loading, anecdotes: true})
                const userAnecdotes = await getAnecdotes(1, selectedCategories);
                setAnecdotes(userAnecdotes);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            } finally {
                setLoading({...loading, anecdotes: false})
            }
        };
        fetchAnecdotes();
    }, [selectedCategories]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(prev => ({ ...prev, categories: true}));
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(prev => ({ ...prev, categories: false}));
            }
        };
        fetchData();
    }, []);


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
        <section className="flex flex-col sm:flex-row justify-start pt-24 gap-12">
            <div className="w-full max-w-full sm:max-w-64">
                <div className="flex flex-col gap-6 mb-3.5">
                    <span
                        className="text-blackPrimary text-2xl font-extrabold font-['Manrope'] leading-[30px]"
                    >
                            Збережені анекдоти
                        </span>

                    <Button
                        onClick={() => setSelectedCategories([])}
                        className="h-[50px] px-5 py-2.5 bg-blackPrimary text-white rounded-[10px] justify-center items-center gap-2.5 inline-flex"
                    >
                        Всі категорії
                    </Button>
                </div>

                <ul className="flex flex-wrap gap-x-5 gap-y-2.5 mb-2.5">
                    {
                        categories.slice(0, 50).map((item: Category) => {
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

            {
                <AnecdoteGridLayout
                    currentPage={1}
                    pagesAmount={1}
                    setCurrentPage={() => {}}
                    anecdotes={anecdotes}
                    setAnecdotes={setAnecdotes}
                />
            }

        </section>
    );
};

export default Page;