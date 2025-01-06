interface Anecdote {
    id: string;
    title: string;
    content: string;
    likes: { isLiked: boolean }[];
    saved: { id: string; userId: string; anecdoteId: string }[];
    categories: { title: string; id: string; userId: string }[];
    Comment: { id: string; content: string; userId: string; anecdoteId: string; createdAt: Date }[];
}

interface TransformedAnecdote {
    id: string;
    title: string;
    content: string;
    likeCount: number;
    dislikeCount: number;
    categories: Category[];
    isSaved: boolean;
    commentsAmount: number;
}

export function transformAnecdotesWithStats(anecdotes: Anecdote[], userId: string): TransformedAnecdote[] {
    return anecdotes.map((anecdote) => {
        const likeCount = anecdote.likes.filter(like => like.isLiked).length;
        const dislikeCount = anecdote.likes.filter(like => !like.isLiked).length;
        const isSavedByUser = anecdote.saved.some((save: {userId: string}) => save.userId === userId);
        const categories = anecdote.categories.map(cat => {
            return {
                id: cat.id,
                title: cat.title,
            };
        });

        return {
            id: anecdote.id,
            title: anecdote.title,
            content: anecdote.content,
            likeCount,
            dislikeCount,
            categories,
            isSaved: isSavedByUser,
            commentsAmount: anecdote.Comment.length
        };
    });
}
