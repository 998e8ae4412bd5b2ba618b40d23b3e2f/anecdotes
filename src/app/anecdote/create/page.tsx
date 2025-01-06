'use client'
import React, {useEffect, useState} from 'react';
import {ContentState, convertFromRaw, EditorState} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ArticleEditor from "@/components/Editor";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

interface AnecdoteCreateData {
    title: string
    content: string
    categories: Category[]
}

const createCategory = async (title: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
        cache: 'no-cache',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            categoryTitle: title
        })
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    return await res.json();
}

const getCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
        cache: 'no-cache',
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    const {data} = await res.json();
    return data;
}

const publishAnecdote = async (anecdote: AnecdoteCreateData) => {
    const {title, content, categories } = anecdote;

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes`, {
        cache: 'no-cache',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            content: content,
            categories: {
                connect: categories.map((category: Category) => ({ id: category.id }))
            }
        })
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    return await res.json();
}

const Page = () => {
    const draftData = {
        title: 'Lorem Ipsum is simply',
        content: `<p><strong>Lorem Ipsum is simply</strong>&nbsp;</p>
<p><em>dummy text of the printing</em></p>
<p><u>and typesetting industry.&nbsp;</u></p>
<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions\\n of Lorem Ipsum.</p>`,
        categories: [{
            "id": "test",
            "title": "test"
        }]
    }

    const [anecdoteDraft, setAnecdoteDraft] = useState<AnecdoteCreateData>({
        title: draftData.title,
        content: draftData.content,
        categories: draftData.categories
    });
    const [anecdoteCategories, setAnecdoteCategories] = React.useState<Category[]>([]);
    const isReadyToPublish = !(anecdoteDraft.title !== draftData.title && anecdoteDraft.content !== draftData.content && anecdoteCategories.length !== 0);
    const [openCategorySelect, setOpenCategorySelect] = React.useState(false);
    const [openCategoryCreate, setOpenCategoryCreate] = useState(false);
    const [categories, setCategories] = React.useState<Category[]>([])
    const [categoryToCreate, setCategoryToCreate] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [anecdotePublishStatus, setAnecdotePublishStatus] = useState<string>('')

    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
            ContentState.createFromText('')
        )
    );

    const handleSaveContent = (content: string, title: string) => {
        const contentState = convertFromRaw(JSON.parse(content));
        const html = stateToHTML(contentState);

        setAnecdoteDraft(prevState => ({
            ...prevState,
            title: title,
            content: html,
            categories: anecdoteCategories
        }));
    };
    const handleCategory = (category: Category) => {
        const catIds = anecdoteCategories.map(category => category.id);

        if (catIds.includes(category.id)) {
            const catFiltered = anecdoteCategories.filter(cat => cat.id !== category.id);
            setAnecdoteCategories(catFiltered)
        } else {
            setAnecdoteCategories([
                ...anecdoteCategories,
                category,
            ])
        }
    }
    const handleCreateCategory = async (title: string) => {
        try {
            const {data, message} = await createCategory(title);
            if (message === "Category already exists") {
                setErrorMessage("Категорія із таким іменем уже існує!, bitch");
                setCategoryToCreate('')
                return;
            }

            if (message === "Category title must be 10 characters or less") {
                setErrorMessage("Максимальна кількість символів рівна 10 або менше");
                setCategoryToCreate('')
                return;
            }
            setOpenCategoryCreate(false)
            handleCategory(data)
            setCategories([...categories, data])
            setCategoryToCreate('')
            setErrorMessage('');
        } catch (e) {
            console.log(e)
        }
    }
    const handlePublishAnecdote = async () => {
        try {
            const res = await publishAnecdote({
                ...anecdoteDraft,
                categories: anecdoteCategories
            });

            if (res.ok) {
                setAnecdotePublishStatus('Щось пішло не так....');
                return;
            }

            setTitle('');
            setEditorState(EditorState.createEmpty());
            setAnecdoteCategories([]);
            setAnecdotePublishStatus('Щось пішло добре....');
        } catch (error) {
            console.error(error);
            setAnecdotePublishStatus('Помилка публікації.');
        }
    };
    useEffect(() => {
        const fetchAnecdotes = async () => {
            try {
                const userAnecdotes = await getCategories();
                setCategories(userAnecdotes);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            }
        };

        fetchAnecdotes()
    }, [])



    return (
        <div className="flex w-full p-24 gap-8 justify-center">
            <div className="flex flex-1 max-w-[569px] flex-col gap-4">
                <h1 className="text-[#1e1e1e] text-[28px] font-bold font-['Manrope']">Створення анекдоту</h1>

                <ArticleEditor
                    title={title}
                    setTitle={setTitle}
                    editorState={editorState}
                    setEditorState={setEditorState}
                    onSave={handleSaveContent}/>

                <div className="flex justify-between">
                    <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-[200px] justify-between"
                            >
                                Категорії
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Знайти категорію..." />
                                <CommandList>
                                    <CommandEmpty>Немає категорій...</CommandEmpty>
                                    <CommandGroup>
                                        {categories?.map((category: Category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.title}
                                                onSelect={() => {
                                                    handleCategory(category);
                                                    setOpenCategorySelect(false);
                                                }}
                                            >
                                                {category.title}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Dialog open={openCategoryCreate} onOpenChange={setOpenCategoryCreate}>
                        <DialogTrigger asChild>
                            <Button className="w-fit">Створити власну</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle>Оберіть назву для категорії</DialogTitle>
                            <div className="text-red-700 text-[0.8rem]">{errorMessage && errorMessage}</div>
                            <Input
                                placeholder="Назва тут"
                                className="font-semibold text-lg"
                                value={categoryToCreate}
                                onChange={(e) => setCategoryToCreate(e.target.value)}
                                required
                            />

                            <Button
                                onClick={() => handleCreateCategory(categoryToCreate)}
                                disabled={categoryToCreate === ''}
                            >
                                Створити
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-4">
                    {
                        anecdoteCategories.map(category => (
                            <Button
                                onClick={() => handleCategory(category)}
                                variant="outline"
                                key={category.id}>
                                {category.title}
                            </Button>
                        ))
                    }
                </div>

                <p>{anecdotePublishStatus !== '' && anecdotePublishStatus}</p>
                <Button className="w-full" onClick={handlePublishAnecdote}
                        disabled={isReadyToPublish}>Створити анекдот</Button>
            </div>
        </div>
    );
};

export default Page;