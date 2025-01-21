import React, {Suspense} from 'react';
import AnecdotesGrid from "@/components/AnecdoteGrid/AnecdotesGrid";

const AnecdoteGridLayout = ({ currentPage, pagesAmount, setCurrentPage, anecdotes, setAnecdotes }:
                           {
                               currentPage: number,
                               pagesAmount: number,
                               setCurrentPage: (currentPage: number) => void,
                               anecdotes: AnecdoteBase[],
                               setAnecdotes: (anecdotes: AnecdoteBase[]) => void }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AnecdotesGrid
                currentPage={currentPage}
                pagesAmount={pagesAmount}
                setCurrentPage={setCurrentPage}
                anecdotes={anecdotes}
                setAnecdotes={setAnecdotes}
            />
        </Suspense>
    );
};

export default AnecdoteGridLayout;