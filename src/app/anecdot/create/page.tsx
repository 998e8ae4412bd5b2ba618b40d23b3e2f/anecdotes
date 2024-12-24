'use client'
import React, { useState } from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ArticleEditor from "@/components/Editor";
import Anecdote from "@/components/Anecdote";
import {Button} from "@/components/ui/button";

const Page = () => {
    const draftData = {
        title: 'Lorem Ipsum is simply',
        content: `<p><strong>Lorem Ipsum is simply</strong>&nbsp;</p>
<p><em>dummy text of the printing</em></p>
<p><u>and typesetting industry.&nbsp;</u></p>
<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions\\n of Lorem Ipsum.</p>`,
    }

    const [anecdoteDraft, setAnecdoteDraft] = useState<Anecdote>({
        id: '1',
        slug: 'slug',
        title: draftData.title,
        content: draftData.content,
        views: 0,
        likeCount: 0,
        dislikeCount: 0
    });

    const handleSaveContent = (content: string, title: string) => {
        const contentState = convertFromRaw(JSON.parse(content));
        const html = stateToHTML(contentState);

        setAnecdoteDraft(prevState => ({
            ...prevState,
            title: title,
            content: html,
        }));
    };

    const isReadyToPublish = !(anecdoteDraft.title !== draftData.title && anecdoteDraft.content !== draftData.content);


    return (
        <div className="flex w-full p-24">
            <div className="flex flex-1 flex-col gap-4">
                <ArticleEditor onSave={handleSaveContent} />

                <Button className="w-fit" disabled={isReadyToPublish}>Publish</Button>
            </div>
            <div className="w-[400px]">
                {/* Anecdote component will dynamically update */}
                <Anecdote anecdote={anecdoteDraft} />
            </div>
        </div>
    );
};

export default Page;
