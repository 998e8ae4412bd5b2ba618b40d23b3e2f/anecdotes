'use client'
import React, { useEffect, useState } from 'react';
import Anecdote from "@/components/Anecdote";
import AnecdotePopup from "@/components/AnecdotePopup";
import { usePathname } from "next/navigation";

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

const deleteAnecdote = async (id: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes/${id}`, {
        cache: 'no-cache',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const AnecdotesGrid = ({ anecdotes, setAnecdotes }: { anecdotes: Anecdote[], setAnecdotes: (anecdotes: Anecdote[]) => void }) => {
    const [openAnecdotePopup, setOpenAnecdotePopup] = useState<boolean>(false);
    const [popupAnecdote, setPopupAnecdote] = useState<string>('');
    const pathname = usePathname();

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

    const handleDeleteAnecdote = (id: string) => {
        deleteAnecdote(id)
        const anecdotesCopy = anecdotes.filter(anecdote => {
            return anecdote.id !== id;
        })

        setAnecdotes(anecdotesCopy)
    }

    const handleOpenPopup = (id: string) => {
        document.documentElement.style.overflow = 'hidden';
        setOpenAnecdotePopup(true)
        setPopupAnecdote(id)
    }

    const handleClosePopup = () => {
        document.documentElement.style.overflow = 'auto';
        setOpenAnecdotePopup(false)
        setPopupAnecdote('')
        pathname !== '/profile' && window.history.replaceState({}, '', `${process.env.NEXT_PUBLIC_URL}/dashboard`);
    }

    const save = (newAnecdotes: Anecdote[]) => {
        setAnecdotes([...newAnecdotes])
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            handleOpenPopup(id);
        }
    }, [pathname]);

    return (
        <section className="flex w-full  flex-wrap gap-8">
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
                    deleteAnecdote={() => handleDeleteAnecdote(anecdote.id)}
                    key={anecdote.id}
                />
            ))}
        </section>
    );
};

export default AnecdotesGrid;