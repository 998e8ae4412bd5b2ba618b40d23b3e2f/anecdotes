'use client'
import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, RichUtils, convertToRaw } from 'draft-js';
import "draft-js/dist/Draft.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Save } from 'lucide-react';
import { Input } from "@/components/ui/input";

const DraftEditor = dynamic(
    () => import('draft-js').then(mod => ({ default: mod.Editor })),
    { ssr: false }
);

interface ArticleEditorProps {
    onSave?: (content: string, title: string) => void;
}

const Editor: React.FC<ArticleEditorProps> = ({onSave}) => {
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
            ContentState.createFromText('')
        )
    );

    const handleChange = useCallback((newState: EditorState) => {
        setEditorState(newState);
    }, []);

    const handleKeyCommand = (command: string, state: EditorState) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleStyle = (style: string) => {
        handleChange(RichUtils.toggleInlineStyle(editorState, style));
    };

    const handleSave = () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));
        onSave?.(rawContent, title);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardContent className="p-4 space-y-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('BOLD')}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('ITALIC')}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('UNDERLINE')}
                    >
                        <Underline className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        className="ml-auto"
                        disabled={!title.trim()}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                </div>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Title"
                    className="font-semibold text-lg"
                    required
                />
                <div className="min-h-[200px] border rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <DraftEditor
                        editorState={editorState}
                        onChange={handleChange}
                        handleKeyCommand={handleKeyCommand}
                        placeholder="Start writing your article..."
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default Editor;