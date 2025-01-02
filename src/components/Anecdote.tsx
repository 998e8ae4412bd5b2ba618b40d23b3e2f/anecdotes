'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {Bookmark, MessageSquare, ThumbsDown, ThumbsUp, Trash} from "react-feather";

const ActionButton = ({ onClick, className, variant, children }: {
    onClick: (e: React.MouseEvent) => void,
    className?: string, variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null,
    children: React.ReactNode
}) => (
    <Button
        onClick={e => {
            e.stopPropagation();
            onClick(e);
        }}
        variant={variant || 'default'}
        className={`${className || ''}`}
    >
        {children}
    </Button>
);

const Anecdote = ({ anecdote, saveAnecdote, openPopup, deleteAnecdote }: { anecdote: Anecdote, saveAnecdote: () => void, openPopup: () => void, deleteAnecdote?: () => void }) => {
    const { id, title, content, categories, isSaved} = anecdote;

    const [likeCount, setLikeCount] = useState(anecdote.likeCount);
    const [dislikeCount, setDislikeCount] = useState(anecdote.dislikeCount);

    useEffect(() => {
        setLikeCount(anecdote.likeCount);
        setDislikeCount(anecdote.dislikeCount);
    }, [anecdote]);

    const handleLike = async (isLiked: boolean) => {
        try {
            const res = await fetch(`/api/anecdotes/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isLiked: isLiked
                })
            });

            if (res.ok) {
                const data = await res.json();
                setLikeCount(data.likeCount);
                setDislikeCount(data.dislikeCount);
            }
        } catch (error) {
            console.error('Error liking the anecdote:', error);
        }
    };

    return (
        <Card className="relative w-[251px] h-fit cursor-pointer group" onClick={openPopup}>
            <CardHeader>
                <CardTitle className="text-blackPrimary break-words text-base font-bold font-['Manrope']">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div
                    className="text-[#4b4b4b] text-sm break-words font-normal font-['Manrope'] leading-tight"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="flex items-center justify-end gap-2.5">
                    <ActionButton
                        onClick={() => handleLike(true)}
                        variant="ghost"
                        className="flex h-fit p-0 gap-2 items-center"
                    >
                        <ThumbsUp stroke="black" fill="white" /> {likeCount}
                    </ActionButton>
                    <ActionButton
                        onClick={() => handleLike(false)}
                        variant="ghost"
                        className="flex h-fit p-0 gap-2 items-center"
                    >
                        <ThumbsDown /> {dislikeCount}
                    </ActionButton>
                    <div className="flex h-fit gap-2 pl-1 items-center">
                        <MessageSquare className="w-4 h-5" />
                        {anecdote.commentsAmount}
                    </div>
                </div>

                {/*<ul className="flex gap-2">*/}
                {/*    {categories?.map((category: Category) => (*/}
                {/*        <li key={category.id}>*/}
                {/*            <Button variant="outline">*/}
                {/*                {category.title}*/}
                {/*            </Button>*/}
                {/*        </li>*/}
                {/*    ))}*/}
                {/*</ul>*/}

                <ActionButton
                    className="absolute bg-black hover:bg-initial rounded-[10px] border-none h-11 w-11 items-center justify-center -top-5 -right-5 p-0 hidden group-hover:flex"
                    variant="outline"
                    onClick={saveAnecdote}
                >
                    <Bookmark fill={isSaved ? 'white' : 'black'} stroke="white" />
                </ActionButton>

                {
                    deleteAnecdote && <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="absolute bg-black hover:bg-initial rounded-[10px] border-none h-11 w-11 items-center justify-center -bottom-5 -left-5 p-0 hidden group-hover:flex"
                                variant="outline"
                            >
                                <Trash stroke='red' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                            </DialogHeader>
                            <div>
                                <Button onClick={deleteAnecdote}>
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            </CardContent>
        </Card>

    );
};

export default Anecdote;
