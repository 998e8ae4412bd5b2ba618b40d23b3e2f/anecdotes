import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/connect";

export const GET = async (req: NextRequest) => {
    const POST_PER_PAGE = 6;
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const userId = url.searchParams.get("userId") || '';

    try {
        const anecdotes = await prisma.anecdote.findMany({
            where: userId ? { userId } : undefined,
            take: POST_PER_PAGE,
            skip: POST_PER_PAGE * (page - 1),
            include: {
                likes: true
            },
        });

        const anecdotesWithCounts = anecdotes.map((anecdote) => {
            const likeCount = anecdote.likes.filter(like => like.isLiked).length;
            const dislikeCount = anecdote.likes.filter(like => !like.isLiked).length;

            const userLike = anecdote.likes.find(like => like.userId === userId);
            const likeExist = userLike !== undefined ? userLike.isLiked : null;

            const response = {
                id: anecdote.id,
                slug: anecdote.slug,
                title: anecdote.title,
                content: anecdote.content,
                catSlug: anecdote.catSlug,
                userId: anecdote.userId,
                likeCount,
                dislikeCount,
                ...(likeExist !== null && { userHasLiked: likeExist })
            };

            return response;
        });

        return new NextResponse(JSON.stringify({ data: anecdotesWithCounts }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};


export const POST = async (req: NextRequest) => {
    try {
        return new NextResponse(JSON.stringify({message: "success"}), { status: 200 });
    } catch(e) {
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}