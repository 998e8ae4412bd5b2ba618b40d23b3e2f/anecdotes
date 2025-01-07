'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {Bookmark, MessageSquare, ThumbsDown, ThumbsUp, Trash2} from "react-feather";
import {usePathname} from "next/navigation";
import {useRequireAuth} from "@/hooks/useRequireAuth";

const ActionButton = ({ onClick, className, variant, children }: {
    onClick?: (e: React.MouseEvent) => void,
    className?: string, variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null,
    children: React.ReactNode
}) => {
    return (
            <Button
                onClick={e => {
                    e.stopPropagation();
                    onClick && onClick(e);
                }}
                variant={variant || 'default'}
                className={`${className || ''}`}
            >
                {children}
            </Button>
        )

};

const Anecdote = ({ anecdote, saveAnecdote, openPopup, deleteAnecdote }: { anecdote: AnecdoteBase, saveAnecdote: () => void, openPopup: () => void, deleteAnecdote?: (id: string) => void }) => {
    const { id, title, content, categories, isSaved} = anecdote;
    const pathname = usePathname();
    const [likeCount, setLikeCount] = useState(anecdote.likeCount);
    const [dislikeCount, setDislikeCount] = useState(anecdote.dislikeCount);
    const cornerColors: string[] = ['#CFFCC0', '#BEAEFB', '#FF99C8']

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
    const { requireAuth, AuthModalComponent } = useRequireAuth();
    const [cornerColor] = useState(cornerColors[Math.floor(Math.random() * cornerColors.length)]);

    return (
        <div className="group relative h-fit">
            <Card
                className="relative w-64 h-fit cursor-pointer shadow-[0px_7px_19.600000381469727px_-13px_rgba(0,0,0,0.25)]"
                onClick={openPopup}>
                <CardHeader>
                    <CardTitle
                        className="text-blackPrimary break-words text-base font-bold font-['Manrope']">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 py-0">
                    <div
                        className="text-[#4b4b4b] text-sm break-words font-normal font-['Manrope'] leading-tight"
                        dangerouslySetInnerHTML={{__html: content}}
                    />

                    <div className="flex items-center justify-end gap-2.5">
                        <ActionButton
                            onClick={() => requireAuth(() => handleLike(true))}
                            variant="ghost"
                            className="flex h-fit p-0 gap-2 items-center"
                        >
                            <ThumbsUp stroke="black" fill="white"/> {likeCount}
                        </ActionButton>
                        <ActionButton
                            onClick={() => requireAuth(() => handleLike(false))}
                            variant="ghost"
                            className="flex h-fit p-0 gap-2 items-center"
                        >
                            <ThumbsDown/> {dislikeCount}
                        </ActionButton>
                        <div className="flex h-fit gap-2 pl-1 items-center">
                            <MessageSquare className="w-4 h-5"/>
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
                        className="absolute bg-black hover:bg-initial rounded-[10px] border-none h-11 w-11 items-center justify-center -top-5 -right-5 p-0 opacity-0 group-hover:opacity-100 transition-all"
                        variant="outline"
                        onClick={() => requireAuth(saveAnecdote)}
                    >
                        <Bookmark fill={isSaved ? 'white' : 'black'} stroke="white"/>
                    </ActionButton>
                </CardContent>

                <div style={{borderRightColor: cornerColor}}
                     className="w-0 h-0 border-t-[1rem] border-r-[1rem] border-t-transparent -rotate-90"></div>


            </Card>
            {
                pathname === '/profile' && <Dialog>
                    <DialogTrigger asChild>
                        <ActionButton
                            className="absolute bg-[#FFC7C7] hover:bg-initial rounded-2.5 border-none h-11 w-11 items-center justify-center -bottom-5 -left-5 p-0 opacity-0 group-hover:opacity-100 transition-all delay-100"
                            variant="outline"
                        >
                            <Trash2 stroke='red' />
                        </ActionButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete?</DialogTitle>
                        </DialogHeader>
                        {deleteAnecdote && <div>
                            <Button onClick={() => requireAuth(() => deleteAnecdote(id))}>
                                Delete
                            </Button>
                        </div>}
                    </DialogContent>
                </Dialog>
            }

            {AuthModalComponent}
        </div>
    );
};

export default Anecdote;
