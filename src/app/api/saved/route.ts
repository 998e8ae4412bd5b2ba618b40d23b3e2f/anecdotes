import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";
import {transformAnecdotesWithStats} from "@/utils/transformAnecdotesWithStats";

export const GET = async(req: NextRequest) => {
    try {
        const session = await getAuthSession();
        const url = new URL(req.url);
        const categories = url.searchParams.get("categories")?.split(',') || [];

        if (!session) {
            return new NextResponse(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }

        // Build the where clause for the Saved model
        const whereClause: {
            userId: string;
            anecdote: {
                categories?: {
                    some: {
                        title: {
                            in: string[];
                        };
                    };
                };
            };
        } = {
            userId: session.user.id,
            anecdote: {}
        }

        if (categories.length > 0) {
            whereClause.anecdote.categories = {
                some: {
                    title: {
                        in: categories
                    }
                }
            };
        }

        // Fetch saved anecdotes for the user
        const savedAnecdotes = await prisma.saved.findMany({
            where: whereClause,
            include: {
                anecdote: {
                    include: {
                        likes: true,
                        categories: true,
                        saved: true,
                        Comment: true
                    }
                }
            }
        });

        const anecdotes = savedAnecdotes.map(item => item.anecdote);

        // Optionally transform anecdotes with stats
        const anecdotesWithCounts = transformAnecdotesWithStats(anecdotes, session.user.id);

        return new NextResponse(JSON.stringify({data: anecdotesWithCounts}), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({message: 'Something went wrong'}), {status: 500});
    }
};


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
