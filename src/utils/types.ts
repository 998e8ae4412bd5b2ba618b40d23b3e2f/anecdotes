/* eslint-disable */

interface Anecdote {
    id: string,
    slug: string,
    title: string,
    content: string,
    views: number,
    likeCount: number,
    dislikeCount: number,
    isSaved?: boolean,
    commentsAmount?: number,
    user: {
        image: string,
        name: string
    }
    comments: Comment[],
    categories: Category[],
    deleteAnecdote?: () => void,
    saveAnecdote?: () => void,
    openPopup?: () => void,
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