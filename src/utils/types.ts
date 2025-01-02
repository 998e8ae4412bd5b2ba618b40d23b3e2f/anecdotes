/* eslint-disable */

interface Anecdote {
    id: string,
    slug: string,
    title: string,
    content: string,
    views: number,
    likeCount: number,
    comments: Comment[],
    dislikeCount: number,
    categories: Category[],
    deleteAnecdote?: () => void,
    saveAnecdote?: () => void,
    openPopup?: () => void,
    isSaved?: boolean,
    commentsAmount?: number,
    user: {
        image: string,
        name: string
    }
}

interface User {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string,
}

interface Category {
    id: string,
    title: string
}

interface Comment {
    id: string,
    content: string,
    user: string,
    image: string,
    date: string
}