import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Checks if the user has reached the maximum allowed anecdotes for a contest.
 * @param contestId - The ID of the contest.
 * @param userId - The ID of the user.
 * @param maxAnecdotes - The maximum number of anecdotes allowed (default: 3).
 * @returns A boolean indicating whether the limit has been exceeded.
 */
export async function hasReachedAnecdoteLimit(
    contestId: string,
    userId: string,
    maxAnecdotes = 3
): Promise<boolean> {
    const count = await prisma.contestSubmission.count({
        where: {
            contestId,
            anecdote: {
                userId,
            },
        },
    });

    return count >= maxAnecdotes;
}
