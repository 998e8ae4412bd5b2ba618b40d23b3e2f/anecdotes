import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";
import {transformAnecdotesWithStats} from "@/utils/transformAnecdotesWithStats";
import { Anecdote } from "@prisma/client";


export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();
        const POST_PER_PAGE = 16;
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const userId = url.searchParams.get("userId") || '';
        const categories = url.searchParams.get("categories")?.split(',') || [];
        const includeNew = url.searchParams.get("new") === "true"; // Перевіряємо параметр `new`

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

        // Отримуємо основні анекдоти
        const anecdotes = await prisma.anecdote.findMany({
            where: whereClause,
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
            orderBy: {
                likes: {
                    _count: "desc",
                },
            },
            include: {
                likes: true,
                categories: true,
                saved: true,
                Comment: true,
            },
        });

        let newestAnecdotes: Anecdote[] = [];
        if (includeNew) {
            newestAnecdotes = await prisma.anecdote.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 3,
                include: {
                    likes: true,
                    categories: true,
                    saved: true,
                    Comment: true,
                },
            });
        }

        const totalCount = await prisma.anecdote.count({
            where: whereClause,
        });

        const totalPages = Math.ceil(totalCount / POST_PER_PAGE);

        // Трансформуємо анекдоти з урахуванням інформації про користувача
        const anecdotesWithCounts = transformAnecdotesWithStats(anecdotes, session?.user.id || '');
        // @ts-ignore
        const newestAnecdotesWithCounts = transformAnecdotesWithStats(newestAnecdotes, session?.user.id || '');

        return new NextResponse(JSON.stringify({
            data: anecdotesWithCounts,
            totalPages,
            newest: includeNew ? newestAnecdotesWithCounts : []
        }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};



export const POST = async (req: NextRequest) => {
    try {
        const whiteList: string[] = ['cm5fcdt400000w474yzlw7m25', 'cm5fvyt9i0000jp035ng70hak', 'cm6gmrtpp0000ih03m3unz9zo']
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const anecdoteCount = await prisma.anecdote.count({
            where: {
                userId: session.user.id,
                createdAt: {
                    gte: oneDayAgo,
                },
            },
        });

        if (!whiteList.includes(session.user.id)) {
            if (anecdoteCount >= 15) {
                return new NextResponse(JSON.stringify({ message: "You can only create up to 15 anecdotes in a 24-hour period" }), { status: 200 });
            }
        }

        const { title, content, categories, forContest} = await req.json()

        if (forContest){
            const contestAnecdotesAmount = await prisma.contestSubmission.count({
                where: {
                    anecdote: {
                        userId: session.user.id
                    }
                },
            });

            if (contestAnecdotesAmount >= 3) {
                return new NextResponse(JSON.stringify({ message: "You have already 3 anecdotes for contest" }), { status: 200 });
            }
        }


        if (title === '' || content === '' || content == '<p><br></p>' || categories.length === 0) {
            return new NextResponse(JSON.stringify({message: "Bad request"}), {status: 500});
        }

        const anecdoteCreate = await prisma.anecdote.create({
            data: {
                userId: session.user.id,
                title,
                content,
                categories
            }
        })

        if (forContest) {
            await prisma.contestSubmission.create({
                data: {
                    contestId: 'cm6celwpp0000w40soggz8aet',
                    anecdoteId: anecdoteCreate.id
                },
            });
        }

        return new NextResponse(JSON.stringify({message: anecdoteCreate}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}