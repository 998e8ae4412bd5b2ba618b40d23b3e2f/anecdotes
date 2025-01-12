'use client'
import React, { useCallback, useEffect} from 'react';
import dynamic from 'next/dynamic';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
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
            <CardContent className="p-0">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Впишіть заголовок анекдота"
                    className="placeholder-amber-500 text-[#616161] text-base font-normal font-['Manrope'] leading-[30px] mb-5 h-12 rounded-4 p-4 border border-[#4b4b4b] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring"
                    required
                />
                <div className="flex gap-2 mb-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 w-6"
                        onClick={() => toggleStyle('BOLD')}
                    >
                        <Bold className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 w-6"
                        onClick={() => toggleStyle('ITALIC')}
                    >
                        <Italic className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 w-6"
                        onClick={() => toggleStyle('UNDERLINE')}
                    >
                        <Underline className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="min-h-[200px] border border-[#4b4b4b] text-[#616161] text-base font-normal font-['Manrope'] leading-[30px] rounded-md p-3  focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring ">
                    <DraftEditor
                        editorState={editorState}
                        onChange={handleChange}
                        handleKeyCommand={handleKeyCommand}
                        placeholder="Впишіть анекдот"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ArticleEditor;
