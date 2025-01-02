'use client'
import React, { useEffect, useState } from 'react';
import Anecdote from "@/components/Anecdote";
import AnecdotePopup from "@/components/AnecdotePopup";
import { usePathname } from "next/navigation";

const getAnecdotes = async (page: number, categories: string[] = []) => {
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

        const { data } = await res.json();
        return data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const saveAnecdote = async (id: string) => {
    return await fetch("${process.env.NEXT_PUBLIC_URL}/api/saved", {
        cache: 'no-cache',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            anecdoteId: id
        })
    });
}

const AnecdotesGrid = ({ selectedCategories, anecdotes, setAnecdotes }: { selectedCategories: string[], anecdotes: Anecdote[], setAnecdotes: (anecdotes: Anecdote[]) => void }) => {
    const [openAnecdotePopup, setOpenAnecdotePopup] = useState<boolean>(false);
    const [popupAnecdote, setPopupAnecdote] = useState<string>('');

    const handelSave = (anecdoteId?: string) => {
        const id = anecdoteId || popupAnecdote;
        saveAnecdote(id);

        const updatedAnecdote = anecdotes.find(anecdote => anecdote.id === id);

        if (updatedAnecdote) {
            const updatedAnecdotes = anecdotes.map(anecdote =>
                anecdote.id === id ? { ...anecdote, isSaved: !anecdote.isSaved } : anecdote
            );
            setAnecdotes(updatedAnecdotes);
        }
    };


    const handleOpenPopup = (id: string) => {
        document.documentElement.style.overflow = 'hidden';
        setOpenAnecdotePopup(true)
        setPopupAnecdote(id)
    }

    const handleClosePopup = () => {
        document.documentElement.style.overflow = 'auto';
        setOpenAnecdotePopup(false)
        setPopupAnecdote('')
        window.history.replaceState({}, '', `${process.env.NEXT_PUBLIC_URL}/dashboard`);
    }

    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                const data = await getAnecdotes(1, selectedCategories);
                setAnecdotes(data);
            } catch (e) {
                console.error('Failed to fetch anecdotes', e);
            }
        }

        fetchAnecdotes();
    }, [selectedCategories]);

    const save = (newAnecdotes: Anecdote[]) => {
        setAnecdotes([...newAnecdotes])
    }

    const pathname = usePathname();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            handleOpenPopup(id);
        }
    }, [pathname]);

    return (
        <section className="flex flex-wrap gap-8">
            {openAnecdotePopup &&
                <AnecdotePopup
                    anecdoteId={popupAnecdote}
                    anecdotes={anecdotes}
                    setNewAnecdotes={save}
                    closePopup={handleClosePopup}
                    saveAnecdote={handelSave}
                />}
            {anecdotes?.map((anecdote: Anecdote) => (
                <Anecdote
                    anecdote={{
                        ...anecdote,
                    }}
                    saveAnecdote={() => handelSave(anecdote.id)}
                    openPopup={() => handleOpenPopup(anecdote.id)}
                    key={anecdote.id}
                />
            ))}
        </section>
    );
};

export default AnecdotesGrid;
