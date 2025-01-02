'use client'
import React, {useState, useCallback, useEffect} from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, RichUtils, convertToRaw } from 'draft-js';
import "draft-js/dist/Draft.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from 'lucide-react';
import { Input } from "@/components/ui/input";

const DraftEditor = dynamic(
    () => import('draft-js').then(mod => ({ default: mod.Editor })),
    { ssr: false }
);

interface ArticleEditorProps {
    title: string;
    setTitle: (title: string) => void;
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    onSave: (content: string, title: string) => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
                                                         title, setTitle, editorState, setEditorState, onSave
                                                     }) => {
    const handleChange = useCallback((newState: EditorState) => {
        setEditorState(newState);
    }, [setEditorState]);

    const handleKeyCommand = (command: string, state: EditorState) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleStyle = (style: string) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    useEffect(() => {
        handleSave()
    }, [title, editorState]);

    const handleSave = () => {
        const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        onSave(rawContent, title);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardContent className="p-4 space-y-4">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Title"
                    className="font-semibold text-lg"
                    required
                />
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('BOLD')}
                    >
                        <Bold className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('ITALIC')}
                    >
                        <Italic className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStyle('UNDERLINE')}
                    >
                        <Underline className="h-4 w-4"/>
                    </Button>
                </div>
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

export default ArticleEditor;
