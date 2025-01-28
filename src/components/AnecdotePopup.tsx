'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {Bookmark, HelpCircle, Send, ThumbsUp, X} from 'react-feather';
import {Input} from "@/components/ui/input";
import Comment from "@/components/Comment"
import {usePathname, useRouter} from "next/navigation";
import Dice from "@/components/Loaders/Dice";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Loader2, SearchIcon} from "lucide-react";
import {Anecdote, Comment as CommentType} from "@/types/anecdote.types"
import {useRequireAuth} from "@/hooks/useRequireAuth";

const fetchAnecdote = async (id: string): Promise<Anecdote> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes/${id}`);
    const { data } = await res.json();
    return data;
};


const Add = () => {
    return <div className="h-[600px] min-w-[300px] bg-black mt-40 opacity-5"/>
}

const AnecdotePopup = ({anecdoteId, closePopup, saveAnecdote, likeAnecdote, handlePostComment}:
                           {
                               anecdoteId: string,
                               closePopup: () => void,
                               saveAnecdote: () => void
                               likeAnecdote: (anecdoteId: string, likeStatus: {likeCount: number, dislikeCount: number, likeStatus: 'liked' | 'dislike' | 'none';}) => void;
                               handlePostComment: (commentContent: string, anecdoteId: string) => Promise<CommentType>;
                           }) => {
    const [anecdote, setAnecdote] = useState<Anecdote>();
    const [commentContent, setCommentContent] = useState<string>('');
    const pathname = usePathname();
    const cornerColors: string[] = ['#CFFCC0', '#BEAEFB', '#FF99C8']
    const [cornerColor] = useState(cornerColors[Math.floor(Math.random() * cornerColors.length)]);
    const [show, setShow] = useState<boolean>(false)
    const urlParams = new URLSearchParams(window.location.search);
    const isRandom = urlParams.get('isRandom');
    const [takePartInTender, setTakePartInTender] = useState(false);
    const { requireAuth, AuthModalComponent } = useRequireAuth();
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
                const likeInfo = {
                    likeCount: data.likeCount,
                    dislikeCount: data.dislikeCount,
                    likeStatus: data.likeStatus
                }

                likeAnecdote(anecdoteId, likeInfo)
            }

            const getAnecdote = async () => {
                const anecdoteRes = await fetchAnecdote(anecdoteId);
                setAnecdote(anecdoteRes);
            };

            getAnecdote();
        } catch (error) {
            console.error('Error liking the anecdote:', error);
        }
    };

    const postComment = async () => {
        if (commentContent === '') return

        const comment = await handlePostComment(commentContent, anecdoteId)

        setAnecdote((prevState: Anecdote | undefined) => {
            if (!prevState) {
                return undefined;
            }

            return {
                ...prevState,
                comments: [...prevState.comments, comment],
            };
        });


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
            setTakePartInTender(anecdoteRes.isInContest || false)
            setAnecdote(anecdoteRes);
        };

        getAnecdote();
        // if (pathname === '/()') {
        //     const isReadyUrl = isRandom ? "&isRandom=true" : "";
        //     window.history.replaceState({}, '', `${process.env.NEXT_PUBLIC_URL}/dashboard/?id=${anecdoteId}${isReadyUrl}`);
        // }
    }, [anecdoteId]);

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 2000)
    }, []);

    const router = useRouter();

    const handleRandomAnecdote = async () => {
        try {
            const response = await fetch('/api/anecdotes/random');
            if (!response.ok) throw new Error('Failed to fetch random anecdote');
            const data = await response.json();
            if (data?.id) {
                router.push(`?id=${data.id}&isRandom=true`);
            }
        } catch (error) {
            console.error('Error fetching random anecdote:', error);
        }
    };


    const submitAnecdoteToContest = () => {
        setTakePartInTender(prevState => !prevState);
    }


    const handleClosePopup = () => {
        try {
            if (anecdote?.isInContest !== takePartInTender) {
                fetch('/api/contests/cm6celwpp0000w40soggz8aet/submissions', {
                    method: 'POST',
                    body: JSON.stringify({ anecdoteId }),
                })
            }
        } catch (e) {
            console.log(e)
        }

        closePopup()
    }

    return (
        <section
            onClick={handleClosePopup}
            className="flex justify-center gap-24 h-full w-full fixed top-0 left-0 bg-[rgba(30,30,30,0.83)] px-4 md:px-12 z-30">
            {anecdote && show ? <div
                onClick={e => e.stopPropagation()}
                className="flex flex-col w-full max-w-[600px] pt-20 pb-10 md:py-40 overflow-y-auto scrollbar-hidden">
                <div className="relative mb-6">
                    <div className="bg-white px-6 pt-6 pb-2">
                        <div>
                            <div onClick={handleClosePopup}
                                 className="absolute p-2.5 bg-white rounded-[10px] top-[-60px] left-[0px] cursor-pointer">
                                <X/>
                            </div>
                            {pathname !== '/profile' && <div
                                onClick={handleRandomAnecdote}
                                className="absolute top-[-60px] right-0 flex xl:gap-2 cursor-pointer px-3 xl:px-5 py-2.5 rounded-[10px] bg-random-anecdote-button-gradient-anim animate-gradientAnimation bg-[length:300%_300%]"
                            >
                                <span
                                    className="text-[#1e1e1e] text-base font-medium font-['Manrope'] leading-[30px] hidden xl:block">Мені пощастить</span>
                                <img src="/random-joke-cube.svg" alt=""/>
                            </div>}

                            {pathname === '/profile' && <div className="absolute top-[-60px] right-0 flex items-center gap-4 bg-white px-3 xl:px-5 py-2.5 rounded-[10px]">
                                    <span className="text-[#1e1e1e] text-sm font-medium">{anecdote.reachedAnecdoteLimit && !anecdote.isInContest ? 'У вас уже подано 3 анекдоти' : 'Взяти участь в конкурсі'}</span>
                                    {!(anecdote.reachedAnecdoteLimit && !anecdote.isInContest) ? <label
                                        className={`relative flex items-center w-12 h-6 rounded-[7px] transition-colors duration-300 ${
                                            takePartInTender ? "bg-random-anecdote-button-gradient-anim animate-gradientAnimation bg-[length:105%_105%]" : "bg-black"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={takePartInTender}
                                            onChange={submitAnecdoteToContest}
                                        />
                                        <span
                                            className={`absolute left-1 top-1 h-4 w-4 bg-white rounded-[7px] transition-all duration-300 ${
                                                takePartInTender ? "peer-checked:bg-black top-[0px] left-6 h-6 w-6" : "peer-checked:bg-white"
                                            }`}
                                        ></span>
                                    </label> : <></>}
                                </div>
                            }
                        </div>


                        <div className="flex items-center justify-between border-b-[1px] pb-4">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    {anecdote.user.image !== undefined && <AvatarImage
                                        className="w-[30px] h-[30px] rounded-md object-cover"
                                        src={anecdote.user.image} alt="@shadcn"/>}

                                    <AvatarFallback>
                                        {anecdote?.user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
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
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex w-full md:w-fit items-center flex-wrap gap-2">
                                    {
                                        anecdote.categories.map(category => (
                                            <div
                                                className="text-[#191919] text-base font-medium font-['Manrope'] leading-[21px]"
                                                key={category.title}>
                                                #{category.title}
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex w-full md:w-fit gap-4 items-center justify-end">
                                    <div
                                        onClick={() => requireAuth(() => handleLike(true))}
                                        className="flex gap-2 items-center text-[12px] cursor-pointer">
                                        <ThumbsUp
                                            stroke={anecdote.userLike === 'none' ? 'black' : anecdote.userLike === 'liked' ? 'green' : 'black'}
                                            className="w-5 h-5"/>
                                        {anecdote.likeCount}
                                    </div>
                                    <div
                                        onClick={() => requireAuth(() => handleLike(false))}
                                        className="flex gap-2 items-center text-[12px] cursor-pointer">
                                        <ThumbsUp
                                            stroke={anecdote.userLike === 'none' ? 'black' : anecdote.userLike === 'dislike' ? 'red' : 'black'}
                                            className="w-5 h-5 rotate-180"/>
                                        {anecdote.dislikeCount}
                                    </div>
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
                <div className=" px-6 py-6 bg-white rounded-[20px] rounded-tr-[20px]">
                    <div
                        className="flex flex-wrap gap-2 justify-between mb-5 text-[#1e1e1e] text-base font-bold font-['Manrope'] leading-[30px]">
                        <h4>
                            {
                                anecdote?.comments.length === 0 ? 'Напишіть перший коментар!' : `Коментарі (${anecdote?.comments.length})`
                            }
                        </h4>
                        <div
                            className="flex gap-2 items-center text-[#616161] text-xs font-medium font-['Manrope'] leading-tight">
                            Правила чату
                            <HelpCircle className="w-4 h-4"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-6">
                        <Input
                            className="h-[50px] rounded-2.5 border-[#4b4b4b] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring"
                            placeholder="Напишіть коментар коментар"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <div onClick={postComment} className="rotate-45 pr-4 cursor-pointer">
                            <Send/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 md:gap-10 mt-6 md:mt-3.5">
                        {anecdote &&
                            anecdote.comments.map((comment: CommentType) => (
                                <Comment key={comment.id} user={comment.user} content={comment.content}
                                         date={comment.date}/>
                            ))}
                    </div>
                </div>
                </div>
                : isRandom ? <Dice/> : <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Loader2
                        className="animate-spin"
                        size={40}
                    />
                </div>}
        </section>
    );
};

export default AnecdotePopup;