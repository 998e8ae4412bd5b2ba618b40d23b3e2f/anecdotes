import {NextRequest, NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {prisma} from "@/utils/connect";

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { content, anecdoteId } = body;

        const savedAnecdote = await prisma.anecdote.findUnique({
            where: {
                id: anecdoteId,
            },
        });

        if (!savedAnecdote) {
            return new NextResponse(JSON.stringify({ message: "Anecdote doesn't exist" }), { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                userId,
                anecdoteId: anecdoteId,
            },
        });

        const comment = {
            id: newComment.id,
            content: newComment.content,
            user: session.user.name,
            date: newComment.createdAt
        }

        return new NextResponse(JSON.stringify({ data: comment }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};