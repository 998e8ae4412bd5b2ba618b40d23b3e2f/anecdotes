import { NextResponse } from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async () => {
    try {
        const count = await prisma.anecdote.count();
        if (count === 0) {
            return new NextResponse(JSON.stringify({ message: 'No anecdotes found' }), { status: 404 });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomAnecdote = await prisma.anecdote.findFirst({
            skip: randomIndex,
            select: { id: true },
        });

        if (!randomAnecdote) {
            return new NextResponse(JSON.stringify({ message: 'No anecdote found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ id: randomAnecdote.id }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};
