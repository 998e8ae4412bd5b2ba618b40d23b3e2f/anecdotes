import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AiFillDislike, AiFillLike} from "react-icons/ai";

const Anecdote = ({anecdote}: {anecdote: Anecdote}) => {
    const {title, content, views, likeCount, dislikeCount} = anecdote;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div dangerouslySetInnerHTML={{ __html: content }}/>

                <ul className="flex gap-8">
                    {/*<li className="flex gap-2 items-center">{views}  <FaEye /></li>*/}
                    <li className="flex gap-2 items-center">{likeCount} <AiFillLike /></li>
                    <li className="flex gap-2 items-center">{dislikeCount} <AiFillDislike /></li>
                </ul>
            </CardContent>
        </Card>
    );
};

export default Anecdote;