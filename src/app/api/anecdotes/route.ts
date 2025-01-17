import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";
import {transformAnecdotesWithStats} from "@/utils/transformAnecdotesWithStats";


export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        const POST_PER_PAGE = 12;
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

        const totalCount = await prisma.anecdote.count({
            where: whereClause,
        });

        const totalPages = Math.ceil(totalCount / POST_PER_PAGE);

        const anecdotesWithCounts = transformAnecdotesWithStats(anecdotes, session?.user.id || '');

        return new NextResponse(JSON.stringify({
            data: anecdotesWithCounts,
            totalPages
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

        return new NextResponse(JSON.stringify({message: anecdoteCreate}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}