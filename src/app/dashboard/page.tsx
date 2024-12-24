import React from 'react';
import Anecdote from "@/components/Anecdote";

const getData = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
        cache: 'no-cache',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    const {data} = await res.json();
    return data;
};

const getAnecdotes = async (page: number) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/anecdotes?page=${page}`, {
        cache: 'no-cache',
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    const {data} = await res.json();
    return data;
}

const Page = async () => {
    const categories = await getData();
    const anecdotes = await getAnecdotes(1);

    return (
        <div >
            <ul>
                {
                    categories?.map((item: Category) => {
                        return <li key={item.id}>{item.title}</li>
                    })
                }
            </ul>


            <section className="flex flex-wrap gap-8">
                {
                    anecdotes?.map((anecdote: Anecdote) => (
                        <Anecdote anecdote={anecdote} key={anecdote.id} />
                    ))
                }
            </section>
        </div>
    );
};

export default Page;