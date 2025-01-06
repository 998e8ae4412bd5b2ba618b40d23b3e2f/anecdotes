'use client'
import React, {useEffect, useState} from 'react';
import {Bookmark, HelpCircle, Send, ThumbsUp, X} from 'react-feather';
import {Input} from "@/components/ui/input";
import Comment from "@/components/Comment"
import {usePathname} from "next/navigation";

const fetchAnecdote = async (id: string): Promise<Anecdote> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes/${id}`);
    const { data } = await res.json();
    return data;
};

const postComment = async (content: string, anecdoteId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
        method: 'POST',
        body: JSON.stringify({
            content,
            anecdoteId,
        }),
    });

    const data = await res.json();
    return data;
};


const Add = () => {
    return <div className="h-[600px] min-w-[300px] bg-black mt-40 opacity-5"/>
}


const AnecdotePopup = ({anecdoteId, anecdotes, setNewAnecdotes, closePopup, saveAnecdote}:
                           {
                               anecdoteId: string,
                               anecdotes: AnecdoteBase[],
                               setNewAnecdotes: (anecdotes: AnecdoteBase[]) => void,
                               closePopup: () => void,
                               saveAnecdote: () => void}) => {
    const [anecdote, setAnecdote] = useState<Anecdote>();
    const [commentContent, setCommentContent] = useState<string>('');
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const pathname = usePathname();
    const cornerColors: string[] = ['#CFFCC0', '#BEAEFB', '#FF99C8']
    const [cornerColor] = useState(cornerColors[Math.floor(Math.random() * cornerColors.length)]);

    const handleLike = async (isLiked: boolean) => {
        try {
            const res = await fetch(`/api/anecdotes/${anecdoteId}`, {
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

                const updatedAnecdotes = anecdotes.map((a) =>
                    a.id === anecdoteId ? { ...a, likeCount: data.likeCount, dislikeCount: data.dislikeCount } : a
                );
                setNewAnecdotes(updatedAnecdotes);
            }
        } catch (error) {
            console.error('Error liking the anecdote:', error);
        }
    };

    const handlePostComment = async () => {
        const response = await postComment(commentContent, anecdoteId);
        const comment = response.data;

        setAnecdote((prevState) => {
            if (!prevState) return prevState;
            return {
                ...prevState,
                comments: [...prevState.comments, comment],
            };
        });

        const updatedAnecdotes = anecdotes.map((a) =>
            a.id === anecdoteId ? { ...a, commentsAmount: (anecdote?.comments?.length ?? 0) + 1 } : a
        );
        setNewAnecdotes(updatedAnecdotes)

        setCommentContent('');
    };

    const handleSaveAnecdote = () => {
        if (anecdote) {
            setAnecdote(prevState => {
                if (!prevState) return prevState;
                return {
                    ...prevState,
                    isSaved: !prevState?.isSaved
                }}
            );
        }

        saveAnecdote()
    };

    useEffect(() => {
        const getAnecdote = async () => {
            const anecdoteRes = await fetchAnecdote(anecdoteId);
            setAnecdote(anecdoteRes);
            setLikeCount(anecdoteRes.likeCount);
            setDislikeCount(anecdoteRes.dislikeCount);
        };

        getAnecdote();
        if (pathname === '/dashboard') {
            window.history.replaceState({}, '', `${process.env.NEXT_PUBLIC_URL}/dashboard/?id=${anecdoteId}`);
        }
    }, [anecdoteId]);

    return (
        <section className="flex justify-between gap-24 h-full w-full fixed top-0 left-0 bg-[rgba(30,30,30,0.83)] px-12 z-10">
            <Add />

            <div className="flex flex-col w-full max-w-[600px] py-40 overflow-y-auto scrollbar-hidden">
                <div className="relative mb-6">
                    <div className="bg-white p-6">
                        <div onClick={closePopup}
                             className="absolute p-2.5 bg-white rounded-[10px] top-[-60px] left-[0px] cursor-pointer">
                            <X/>
                        </div>
                        <div className="flex items-center justify-between border-b-[1px] pb-4">
                            <div className="flex items-center gap-2">
                                <img className="w-[30px] h-[30px] rounded-md object-cover" src={anecdote?.user.image}
                                     alt=""/>
                                <span>{anecdote?.user.name}</span>
                            </div>

                            <div onClick={handleSaveAnecdote}>
                                <Bookmark fill={anecdote?.isSaved ? 'black' : 'white'}/>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h2 className="text-2xl  font-bold mb-5  leading-none">{anecdote?.title}</h2>

                            <div className="text-base font-normal mb-14"
                                 dangerouslySetInnerHTML={{__html: anecdote?.content || ''}}/>

                            <div className="flex gap-4 items-center justify-end">
                                <div
                                    onClick={() => handleLike(true)}
                                    className="flex gap-2 items-center text-[12px] cursor-pointer">
                                    <ThumbsUp className="w-5 h-5"/>
                                    {likeCount}
                                </div>
                                <div
                                    onClick={() => handleLike(false)}
                                    className="flex gap-2 items-center text-[12px] cursor-pointer">
                                    <ThumbsUp className="w-5 h-5 rotate-180"/>
                                    {dislikeCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        <div style={{borderRightColor: cornerColor}}
                             className="w-0 h-0 border-t-[1rem] border-r-[1rem] border-t-transparent -rotate-90"/>
                        <div className="w-full bg-white h-4">

                        </div>
                    </div>

                </div>

                {
                    anecdote?.categories.map((cat) => {
                        return (
                            <div key={cat.id}>{cat.title}</div>
                        )
                    })
                }

                <div className="px-6 pt-6 bg-white rounded-[20px] rounded-tr-[20px]">
                    <div className="flex justify-between mb-5">
                        <h4>Коментарі ({anecdote?.comments.length})</h4>

                        <div className="flex gap-2 items-center">
                            Правила чату
                            <HelpCircle className="w-4 h-4"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mb-3.5">
                        <Input
                            className="h-[50px]"
                            placeholder="Напишіть коментар коментар"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />

                        <div onClick={handlePostComment} className="rotate-45 pr-4 cursor-pointer">
                            <Send/>
                        </div>
                    </div>
                    <div>
                        {anecdote &&
                            anecdote.comments.map((comment: Comment) => (
                                <Comment key={comment.id} user={comment.user} content={comment.content}
                                         date={comment.date}/>
                            ))}
                    </div>
                </div>
            </div>

            <Add/>
        </section>
    );
};

export default AnecdotePopup;