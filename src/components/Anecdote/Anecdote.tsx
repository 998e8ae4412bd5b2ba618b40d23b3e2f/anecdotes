'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {Bookmark, MessageSquare, MoreVertical, ThumbsDown, ThumbsUp, Trash2} from "react-feather";
import {usePathname} from "next/navigation";
import {useRequireAuth} from "@/hooks/useRequireAuth";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

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


    const truncatedContent = content.length > 300 ? content.slice(0, 300) + '...' : content;

    return (
        <div className="group relative h-fit w-full lg:w-fit">
            <Card
                className="flex flex-col justify-between rounded-[15px] relative w-full lg:w-64 lg:h-64 cursor-pointer hover:shadow-[0px_7px_23.700000762939453px_-15px_rgba(0,0,0,0.25)] shadow-[0px_7px_7.599999904632568px_-13px_rgba(0,0,0,0.10)] transition"
                onClick={openPopup}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle
                        className="text-blackPrimary w-fit break-words text-base font-bold font-['Manrope']">
                        {title}
                    </CardTitle>

                    <div className="block w-fit lg:hidden" onClick={(e) => e.stopPropagation()}>
                        <Popover>
                            <PopoverTrigger>
                                    <MoreVertical/>
                            </PopoverTrigger>
                            <PopoverContent className="absolute p-3 -top-10 right-4 w-fit">
                                <div className="flex gap-1 items-center justify-start" onClick={() => requireAuth(saveAnecdote)}>
                                    <Bookmark fill={isSaved ? 'white' : 'black'} stroke={isSaved ? 'black' : 'white'}/>
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

                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Ви точно хочете удалити анекдот?</DialogTitle>
                                        </DialogHeader>
                                        {deleteAnecdote && <div>
                                            <Button onClick={() => requireAuth(() => deleteAnecdote(id))}>
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
                    </div>


                    <ActionButton
                        className="hidden md:flex absolute bg-black hover:bg-initial rounded-[10px] border-none h-11 w-11 items-center justify-center -top-5 -right-5 p-0 opacity-0 group-hover:opacity-100 transition-all"
                        variant="outline"
                        onClick={() => requireAuth(saveAnecdote)}
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
