interface Category {
    id: string,
    slug: string,
    title: string
}

interface Anecdote {
    id: string,
    slug: string,
    title: string,
    content: string,
    views: number,
    likeCount: number,
    dislikeCount: number
}

interface User {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string,
}