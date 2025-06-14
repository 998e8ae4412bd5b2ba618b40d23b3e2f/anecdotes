'use client'
import React, {Suspense, useEffect, useState} from 'react';
import AnecdotesGrid from "@/components/AnecdoteGrid/AnecdotesGrid";
import {Button} from "@/components/ui/button";
import AnecdoteGridLayout from "@/components/AnecdoteGrid/AnecdoteGridLayout";
import EmptyMessage from "@/components/EmptyMessage";
import Filter from "@/components/Filter/Filter";
import {AnecdoteBase} from "@/types/anecdote.types";

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
        <section className="flex flex-col sm:flex-row justify-start pt-6 md:mt-11 gap-12">
            {/*<Filter></Filter>*/}

            {anecdotes.length === 0 && !loading.anecdotes ?
                <EmptyMessage
                    title='На жаль жодного анекдоту не було знайдено!'
                    content='I am the man who sold the world'
                /> : <AnecdoteGridLayout
                    currentPage={currentPage}
                    pagesAmount={1}
                    setCurrentPage={setCurrentPage}
                    anecdotes={anecdotes}
                    setAnecdotes={setAnecdotes}
                />
            }

        </section>
    );
};

export default Page;