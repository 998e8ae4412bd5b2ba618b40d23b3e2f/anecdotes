import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";

export const GET = async() => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }

        const anecdotes = await prisma.saved.findMany({
            where: {userId: session.user.id},
            include: {
                anecdote: true,
            }
        });

        return new NextResponse(JSON.stringify({data: anecdotes}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { anecdoteId } = body;

        const savedAnecdote = await prisma.saved.findUnique({
            where: {
                userId_anecdoteId: { userId, anecdoteId },
            },
        });

        if (savedAnecdote) {
            await prisma.saved.delete({
                where: {
                    userId_anecdoteId: { userId, anecdoteId },
                },
            });
            return new NextResponse(JSON.stringify({ message: 'Anecdote removed from saved' }), { status: 200 });
        }

        const newSaved = await prisma.saved.create({
            data: {
                userId,
                anecdoteId,
            },
        });

        return new NextResponse(JSON.stringify({ data: newSaved }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};
