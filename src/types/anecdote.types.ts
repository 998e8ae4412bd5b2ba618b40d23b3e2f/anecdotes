interface AnecdoteBase  {
    id: string
    title: string
    content: string
    likeCount: number
    dislikeCount: number
    categories: Category[]
    isSaved: boolean
    commentsAmount: number;
}


interface Anecdote extends AnecdoteBase {
    comments: Comment[]
    user: {
        name: string
        image: string
    }
}





interface Category {
    id: string
    title: string
}

interface Comment {
    id: string
    date: string
    content: string
    user: string
}