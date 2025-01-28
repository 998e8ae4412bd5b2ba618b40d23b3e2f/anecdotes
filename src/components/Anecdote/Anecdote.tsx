'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {Bookmark, MessageSquare, MoreVertical, ThumbsDown, ThumbsUp, Trash2} from "react-feather";
import {usePathname} from "next/navigation";
import {useRequireAuth} from "@/hooks/useRequireAuth";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {AnecdoteBase} from "@/types/anecdote.types";

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

interface AnecdoteProps {
    anecdote: AnecdoteBase;
    saveAnecdote: (anecdoteId: string) => void;
    openPopup: (anecdoteId: string) => void;
    deleteAnecdote?: (anecdoteId: string) => void;
    likeAnecdote: (anecdoteId: string, likeStatus: {likeCount: number, dislikeCount: number, likeStatus: 'liked' | 'dislike' | 'none';}) => void;
}

const Anecdote = ({ anecdote, saveAnecdote, openPopup, deleteAnecdote, likeAnecdote }: AnecdoteProps) => {
    const { id, title, content, categories, isSaved} = anecdote;
    const pathname = usePathname();
    const cornerColors: string[] = ['#CFFCC0', '#BEAEFB', '#FF99C8']

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
                const likeInfo = {
                    likeCount: data.likeCount,
                    dislikeCount: data.dislikeCount,
                    likeStatus: data.likeStatus
                }

                likeAnecdote(id, likeInfo)
            }
        } catch (error) {
            console.error('Error liking the anecdote:', error);
        }
    };
    const { requireAuth, AuthModalComponent } = useRequireAuth();
    const [cornerColor] = useState(cornerColors[Math.floor(Math.random() * cornerColors.length)]);

    const truncatedContent = content.length > 200 ? content.slice(0, 200) + '...' : content;

    return (
        <div className="group relative h-fit w-full lg:w-fit">
            <Card
                className="flex flex-col justify-between rounded-[15px] relative w-full lg:w-[250px] lg:h-[250px] cursor-pointer hover:shadow-[0px_7px_23.700000762939453px_-15px_rgba(0,0,0,0.25)] shadow-[0px_7px_7.599999904632568px_-13px_rgba(0,0,0,0.10)] transition"
                onClick={() => openPopup(id)}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle
                        className="text-blackPrimary w-fit break-words text-base font-bold">
                        {title}
                    </CardTitle>

                    <div className="block w-fit lg:hidden" onClick={(e) => e.stopPropagation()}>
                        <Popover>
                            <PopoverTrigger>
                                    <MoreVertical/>
                            </PopoverTrigger>
                            <PopoverContent className="absolute p-3 -top-10 right-4 w-fit">
                                <div className="flex gap-1 items-center justify-start" onClick={() => requireAuth(() => saveAnecdote(id))}>
                                    <Bookmark fill={isSaved ? 'black' : 'white'} stroke={isSaved ? 'black' : 'black'}/>
                                    <span className="text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-tight">Зберегти</span>
                                </div>
                                {pathname === '/profile' && <Dialog>
                                    <DialogTrigger asChild>
                                        <ActionButton
                                            className="text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-tight flex items-center p-0 justify-start w-full pl-1  pt-2 gap-2.5"
                                            variant="ghost"
                                        >
                                            <Trash2 stroke='red' />
                                            Видалити
                                        </ActionButton>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[425px] w-[90vw] rounded-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Ви точно хочете удалити анекдот?</DialogTitle>
                                        </DialogHeader>
                                        {deleteAnecdote && <div>
                                            <Button
                                                className="w-full"
                                                onClick={() => requireAuth(() => deleteAnecdote(id))}>
                                                Видалити
                                            </Button>
                                        </div>}
                                    </DialogContent>
                                </Dialog>}
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 py-0 h-full">
                    <div className="flex flex-col justify-between h-full">
                        <div
                            className="text-[#4b4b4b] text-sm break-words font-normal font-['Manrope'] leading-tight"
                            dangerouslySetInnerHTML={{__html: truncatedContent}}
                        />

                        <div className="flex items-center justify-end gap-2.5 pt-4 ms:pt-0">
                            <ActionButton
                                onClick={() => requireAuth(() => handleLike(true))}
                                variant="ghost"
                                className="flex h-fit p-0 gap-2 items-center hover:bg-white"
                            >
                                <ThumbsUp
                                    stroke={anecdote.userLike === 'none' ? 'black' : anecdote.userLike === 'liked' ? 'green' : 'black'}
                                />
                                {anecdote.likeCount}
                            </ActionButton>

                            <ActionButton
                                onClick={() => requireAuth(() => handleLike(false))}
                                variant="ghost"
                                className="flex h-fit p-0 gap-2 items-center hover:bg-white"
                            >
                                <ThumbsDown
                                    stroke={anecdote.userLike === 'none' ? 'black' : anecdote.userLike === 'dislike' ? 'red' : 'black'}
                                />{anecdote.dislikeCount}

                            </ActionButton>
                            <div className="flex h-fit gap-2 pl-1 items-center">
                                <MessageSquare className="w-4 h-5"/>
                                {anecdote.commentsAmount}
                            </div>
                        </div>
                    </div>


                    <ActionButton
                        className="hidden md:flex absolute bg-black hover:bg-initial rounded-[10px] border-none h-11 w-11 items-center justify-center -top-5 -right-5 p-0 opacity-0 group-hover:opacity-100 transition-all"
                        variant="outline"
                        onClick={() => requireAuth(() => saveAnecdote(id))}
                    >
                        <Bookmark fill={isSaved ? 'white' : 'black'} stroke="white"/>
                    </ActionButton>
                </CardContent>
                <div style={{borderRightColor: cornerColor}}
                     className="w-0 h-0 border-t-[1rem] border-r-[1rem] border-t-transparent -rotate-90"/>
            </Card>


            {
                pathname === '/profile' && <Dialog>
                    <DialogTrigger asChild>
                        <ActionButton
                            className="absolute bg-[#FFC7C7] hover:bg-initial rounded-2.5 border-none h-11 w-11 items-center justify-center -bottom-5 -left-5 p-0 opacity-0 group-hover:opacity-100 transition-all delay-100"
                            variant="outline"
                        >
                            <Trash2 stroke='red'/>
                        </ActionButton>
                    </DialogTrigger>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ви точно хочете видалити анекдот???</DialogTitle>
                        </DialogHeader>
                        {deleteAnecdote && <div>
                            <Button onClick={() => requireAuth(() => deleteAnecdote(id))}>
                                Удалити
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
