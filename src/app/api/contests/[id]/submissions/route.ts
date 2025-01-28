import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { getAuthSession } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();
        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const { anecdoteId } = await req.json();

        const url = req.nextUrl.pathname;
        const contestId = url.split("/")[3];

        if (!contestId) {
            return NextResponse.json(
                { error: "Contest ID is required in the URL." },
                { status: 400 }
            );
        }

        if (!contestId || !anecdoteId) {
            return NextResponse.json(
                { error: "Both contestId and anecdoteId are required." },
                { status: 400 }
            );
        }

        // Перевірка, чи існує запис у `ContestSubmission`
        const existingSubmission = await prisma.contestSubmission.findFirst({
            where: {
                contestId,
                anecdoteId,
            },
        });

        if (existingSubmission) {
            // Якщо запис існує, видаляємо його
            await prisma.contestSubmission.delete({
                where: {
                    id: existingSubmission.id,
                },
            });
            return NextResponse.json(
                { message: "Anecdote removed from contest" },
                { status: 200 }
            );
        }

        // Перевірка, чи користувач не перевищив ліміт у 3 анекдоти
        const contestAnecdotesAmount = await prisma.contestSubmission.count({
            where: {
                contestId,
                anecdote: {
                    userId: session.user.id,
                },
            },
        });

        if (contestAnecdotesAmount >= 3) {
            return new NextResponse(JSON.stringify({ message: "You already have 3 anecdotes for this contest" }), { status: 400 });
        }

        // Якщо запису немає, створюємо новий
        const submission = await prisma.contestSubmission.create({
            data: {
                contestId,
                anecdoteId,
            },
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Не вдалося обробити запит" },
            { status: 500 }
        );
    }
};
