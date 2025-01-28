'use client'
import React, { useEffect, useState } from 'react';
import Anecdote from "@/components/Anecdote/Anecdote";
import AnecdotePopup from "@/components/AnecdotePopup";
import {usePathname, useSearchParams} from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import AnecdoteSkeleton from "@/components/Anecdote/AnecdoteSkeleton";
import {AnecdoteBase} from "@/types/anecdote.types";

const saveAnecdote = async (id: string) => {
    return await fetch(`/api/saved`, {
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
    return await fetch(`/api/anecdotes/${id}`, {
        cache: 'no-cache',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const postComment = async (content: string, anecdoteId: string) => {
    const res = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({
            content,
            anecdoteId,
        }),
    });

    const data = await res.json();
    return data;
};

const AnecdotesGrid = ({ currentPage, pagesAmount, setCurrentPage, anecdotes, setAnecdotes }:
                           {
                               currentPage: number,
                               pagesAmount: number,
                               setCurrentPage: (currentPage: number) => void,
                               anecdotes: AnecdoteBase[],
                               setAnecdotes: (anecdotes: AnecdoteBase[]) => void }) => {

    const [openAnecdotePopup, setOpenAnecdotePopup] = useState<boolean>(false);
    const [popupAnecdote, setPopupAnecdote] = useState<string>('');
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleLike = (anecdoteId: string, likeInfo: {likeCount: number, dislikeCount: number, likeStatus: 'liked' | 'dislike' | 'none';}) => {
        const updatedAnecdotes: AnecdoteBase[] = anecdotes.map((a) =>
            a.id === anecdoteId ? { ...a, likeCount: likeInfo.likeCount, dislikeCount: likeInfo.dislikeCount, userLike: likeInfo.likeStatus } : a
        );

        setAnecdotes(updatedAnecdotes)
    }
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

    const handlePostComment = async (commentContent: string, anecdoteId: string) => {
        const response = await postComment(commentContent, anecdoteId);
        const comment = response.data;

        const updatedAnecdotes = anecdotes.map((a) =>
            a.id === anecdoteId ? { ...a, commentsAmount: (a.commentsAmount ?? 0) + 1 } : a
        );
        updateAnecdotes(updatedAnecdotes)

        return comment;
    }


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
        pathname !== '/profile' && window.history.replaceState({}, '', `/dashboard`);
    }

    const updateAnecdotes = (newAnecdotes: AnecdoteBase[]) => {
        setAnecdotes([...newAnecdotes])
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            handleOpenPopup(id);
        }
    }, [searchParams]);

    return (
        <section className="flex w-full">
            {openAnecdotePopup &&
                <AnecdotePopup
                    anecdoteId={popupAnecdote}
                    closePopup={handleClosePopup}
                    saveAnecdote={handelSave}
                    likeAnecdote={handleLike}
                    handlePostComment={handlePostComment}
                />}
            {<div className="flex justify-between w-full">
                <div className="flex flex-col justify-start items-start gap-8 w-full lg:w-fit">
                    <div className="grid grid-cols-1 [@media(min-width:1140px)]:grid-cols-2 [@media(min-width:1425px)]:grid-cols-3 grid-rows-4 w-full sm:w-fit gap-8 mb-8 sm:min-h-[1000px]">
                        {
                            anecdotes.length === 0 ?
                                Array.from({length: 12}, (_, i: number) => (
                                    <AnecdoteSkeleton key={i}/>
                                ))
                                :
                                anecdotes.map((anecdote: AnecdoteBase) => (
                                    <Anecdote
                                        anecdote={{
                                            ...anecdote,
                                        }}
                                        likeAnecdote={handleLike}
                                        saveAnecdote={handelSave}
                                        openPopup={handleOpenPopup}
                                        deleteAnecdote={handleDeleteAnecdote}
                                        key={anecdote.id}
                                    />
                                ))
                        }
                    </div>


                    <div className="flex w-full justify-center">
                        {pagesAmount > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    {(() => {
                                        const getPaginationRange = () => {
                                            const totalNumbers = 5;
                                            const siblingCount = 1;

                                            if (pagesAmount <= totalNumbers) {
                                                return [...Array(pagesAmount).keys()].map((page) => page + 1);
                                            }

                                            const leftSibling = Math.max(currentPage - siblingCount, 1);
                                            const rightSibling = Math.min(currentPage + siblingCount, pagesAmount);

                                            const showLeftEllipsis = leftSibling > 2;
                                            const showRightEllipsis = rightSibling < pagesAmount - 1;

                                            const paginationRange = [];

                                            if (showLeftEllipsis) {
                                                paginationRange.push(1, '...');
                                            } else {
                                                for (let i = 1; i < leftSibling; i++) {
                                                    paginationRange.push(i);
                                                }
                                            }

                                            for (let i = leftSibling; i <= rightSibling; i++) {
                                                paginationRange.push(i);
                                            }

                                            if (showRightEllipsis) {
                                                paginationRange.push('...', pagesAmount);
                                            } else {
                                                for (let i = rightSibling + 1; i <= pagesAmount; i++) {
                                                    paginationRange.push(i);
                                                }
                                            }

                                            return paginationRange;
                                        };

                                        return getPaginationRange().map((page, index) => (
                                            <PaginationItem
                                                key={index}
                                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                                className={typeof page === 'number' && page === currentPage ? 'active' : ''}
                                            >
                                                {typeof page === 'number' ? (
                                                    <PaginationLink href="#"
                                                                    isActive={currentPage === page}>{page}</PaginationLink>
                                                ) : (
                                                    <span className="ellipsis">{page}</span>
                                                )}
                                            </PaginationItem>
                                        ));
                                    })()}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>

                <div className="hidden lg:flex flex-col gap-4 pl-8">
                    <div className="w-[240px] h-[400px] bg-red-800"/>
                    <div className="w-[240px] h-[400px] bg-red-800"/>
                </div>
            </div>}
        </section>
    );
};

export default AnecdotesGrid;