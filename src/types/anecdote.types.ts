export interface AnecdoteBase  {
    id: string
    title: string
    content: string
    likeCount: number
    dislikeCount: number
    categories: Category[]
    isSaved: boolean
    commentsAmount: number;
    userLike: 'liked' | 'dislike' | 'none';
}


export interface Anecdote extends AnecdoteBase {
    comments: Comment[]
    user: {
        name: string
        image: string
    }
}





export interface Category {
    id: string
    title: string
}

export interface Comment {
    id: string
    date: string
    content: string
    user: string
}