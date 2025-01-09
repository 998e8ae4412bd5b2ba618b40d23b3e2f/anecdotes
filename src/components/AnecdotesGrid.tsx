'use client'
import React, { useEffect, useState } from 'react';
import Anecdote from "@/components/Anecdote";
import AnecdotePopup from "@/components/AnecdotePopup";
import {usePathname, useSearchParams} from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"

const saveAnecdote = async (id: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/saved`, {
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

const AnecdotesGrid = ({ currentPage, pagesAmount, setCurrentPage, anecdotes, setAnecdotes }:
                           {
                               currentPage: number,
                               pagesAmount: number,
                               setCurrentPage: (currentPage: number) => void,
                               anecdotes: AnecdoteBase[],
                               setAnecdotes: (anecdotes: AnecdoteBase[]) => void }) => {
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

    const updateAnecdotes = (newAnecdotes: AnecdoteBase[]) => {
        setAnecdotes([...newAnecdotes])
    }
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            handleOpenPopup(id);
        }
    }, [searchParams]);


    return (
        <section className="flex">
            {openAnecdotePopup &&
                <AnecdotePopup
                    anecdoteId={popupAnecdote}
                    anecdotes={anecdotes}
                    setNewAnecdotes={updateAnecdotes}
                    closePopup={handleClosePopup}
                    saveAnecdote={handelSave}
                />}
            <div className="flex flex-col justify-start items-start gap-8 w-full lg:w-fit ">
                <div className="grid  sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full md:w-fit gap-8 min-h-[1000px]">
                    {anecdotes?.map((anecdote: AnecdoteBase) => (
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
                </div>


                <div className="flex w-full justify-center">
                    {pagesAmount > 1 && <Pagination>
                        <PaginationContent>
                            {Array.from({ length: 3 }, (_, index) => {
                                const page = index + 1;
                                return (
                                    <PaginationItem
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={page === currentPage ? 'active' : ''}
                                    >
                                        <PaginationLink href="#" isActive={currentPage === page}>{page}</PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>}
                </div>
            </div>
        </section>
    );
};

export default AnecdotesGrid;