import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";


export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        const POST_PER_PAGE = 100;
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const userId = url.searchParams.get("userId") || '';
        const categories = url.searchParams.get("categories")?.split(',') || [];

        const whereClause: {
            userId?: string;
            categories?: {
                some: {
                    title: {
                        in: string[];
                    };
                };
            };
        } = {};

        if (userId) {
            whereClause.userId = userId;
        }

        if (categories.length > 0) {
            whereClause.categories = {
                some: {
                    title: {
                        in: categories
                    }
                }
            };
        }

        const anecdotes = await prisma.anecdote.findMany({
            where: whereClause,
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
            include: {
                likes: true,
                categories: true,
                saved: true,
                Comment: true
            },
        });

        const anecdotesWithCounts = anecdotes.map((anecdote) => {
            const likeCount = anecdote.likes.filter(like => like.isLiked).length;
            const dislikeCount = anecdote.likes.filter(like => !like.isLiked).length;
            const isSavedByUser = anecdote.saved.some(save => save.userId === session?.user.id);

            return {
                id: anecdote.id,
                title: anecdote.title,
                content: anecdote.content,
                likeCount,
                dislikeCount,
                categories: anecdote.categories,
                isSaved: isSavedByUser,
                commentsAmount: anecdote.Comment.length
            };
        });

        return new NextResponse(JSON.stringify({
            data: anecdotesWithCounts
        }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};



export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }

        const { title, content, categories} = await req.json()

        const anecdoteCreate = await prisma.anecdote.create({
            data: {
                userId: session.user.id,
                title,
                content,
                categories
            }
        })

        return new NextResponse(JSON.stringify({message: anecdoteCreate}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}