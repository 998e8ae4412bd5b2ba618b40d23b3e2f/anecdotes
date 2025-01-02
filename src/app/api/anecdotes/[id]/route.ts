import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/utils/connect";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();
        const anecdoteId = req.url.split('/').pop()!;
        const anecdote = await prisma.anecdote.findUnique({
            where: {
                id: anecdoteId
            },
            include: {
                likes: true,
                Comment: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                saved: true,
                user: { select: { name: true, image: true } },
                categories: true
            }
        })

        if (!anecdote) {
            return new NextResponse(JSON.stringify({ message: 'No anecdote' }), { status: 400 });
        }

        const likeCount = anecdote.likes.filter(like => like.isLiked).length;
        const dislikeCount = anecdote.likes.filter(like => !like.isLiked).length;
        const isSavedByUser = anecdote.saved.some(save => save.userId === session?.user.id);
        const comments = anecdote.Comment.map(comment => {
            return {
                id: comment.id,
                date: comment.createdAt,
                content: comment.content,
                user: comment.user.name
            }
        })

        const anecdotesWithCounts= {
            id: anecdote.id,
            title: anecdote.title,
            content: anecdote.content,
            likeCount,
            dislikeCount,
            comments,
            categories: anecdote.categories,
            isSaved: isSavedByUser,
            user: {
                name: anecdote.user.name,
                image: anecdote.user.image
            }
        }

        return new NextResponse(JSON.stringify({data: anecdotesWithCounts}), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const anecdoteId = req.url.split('/').pop()!;
        const { isLiked } = await req.json();

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_anecdoteId: {
                    userId: session.user.id,
                    anecdoteId
                }
            }
        });

        if (existingLike && existingLike.isLiked === isLiked) {
            await prisma.like.delete({
                where: {
                    userId_anecdoteId: {
                        userId: session.user.id,
                        anecdoteId
                    }
                }
            });
        } else {
            await prisma.like.upsert({
                where: {
                    userId_anecdoteId: {
                        userId: session.user.id,
                        anecdoteId
                    }
                },
                update: {
                    isLiked
                },
                create: {
                    userId: session.user.id,
                    anecdoteId,
                    isLiked
                }
            });
        }

        const updatedAnecdote = await prisma.anecdote.findUnique({
            where: { id: anecdoteId },
            include: {
                likes: true
            }
        });

        if (!updatedAnecdote) {
            return new NextResponse(JSON.stringify({ message: "Anecdote not found" }), { status: 404 });
        }

        const likeCount = updatedAnecdote.likes.filter(like => like.isLiked).length;
        const dislikeCount = updatedAnecdote.likes.filter(like => !like.isLiked).length;

        return new NextResponse(JSON.stringify({
            message: 'ok',
            likeCount,
            dislikeCount,
            isLiked: existingLike?.isLiked === isLiked ? null : isLiked
        }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const anecdoteId = req.url.split('/').pop()!;

        const anecdote = await prisma.anecdote.findUnique({
            where: {
                id: anecdoteId,
            }
        });

        if (!anecdote) {
            return new NextResponse(JSON.stringify({ message: "Anecdote not found" }), { status: 404 });
        }

        if (anecdote.userId !== session.user.id) {
            return new NextResponse(JSON.stringify({ message: "You can only delete your own anecdote" }), { status: 403 });
        }

        await prisma.like.deleteMany({
            where: {
                anecdoteId: anecdoteId,
            }
        });

        await prisma.saved.deleteMany({
            where: {
                anecdoteId: anecdoteId,
            }
        });

        await prisma.comment.deleteMany({
            where: {
                postId: anecdoteId,
            }
        });

        await prisma.anecdote.delete({
            where: {
                id: anecdoteId,
            }
        });

        return new NextResponse(JSON.stringify({ message: "Anecdote deleted successfully" }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};