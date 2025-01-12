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
import {HelpCircle, X} from "react-feather";
import Link from "next/link";
import {toast} from "sonner";
import {NextResponse} from "next/server";

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
    const { title, content, categories } = anecdote;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/anecdotes`, {
            cache: 'no-cache',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                categories: {
                    connect: categories.map((category: Category) => ({ id: category.id }))
                }
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to publish anecdote', { cause: res.status });
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
};


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
            await publishAnecdote({
                ...anecdoteDraft,
                categories: anecdoteCategories,
            });

            setTitle('');
            setEditorState(EditorState.createEmpty());
            setAnecdoteCategories([]);

            toast("Анекдот був успішно створений", {
                description: "Ваші дані було передано у СБУ та ТЦК 😆",
                action: {
                    label: "Передати",
                    onClick: () => console.log("Undo"),
                },
            });
        } catch (error: any) {
            toast("Анекдот не створено", {
                description: "Зате дані було передано у СБУ та ТЦК 😆",
                action: {
                    label: "Повторити",
                    onClick: () => handlePublishAnecdote(),
                },
            });
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
        <div className="flex w-full pt-24 ms:p-24 gap-8 justify-center">
            <div className="flex flex-1 max-w-[569px] flex-col gap-4">
                <div>
                    <h1 className="text-[#1e1e1e] text-[28px] font-bold font-['Manrope']">Створення анекдоту</h1>
                    <Link href='/rules' className="flex gap-1 pt-1 ms:pt-3">
                        <p className="text-[#616161] text-xs font-medium font-['Manrope'] leading-tight">правила анекдтоів</p>
                        <HelpCircle size={15}/>
                    </Link>
                </div>

                <ArticleEditor
                    title={title}
                    setTitle={setTitle}
                    editorState={editorState}
                    setEditorState={setEditorState}
                    onSave={handleSaveContent}/>

                <div className="flex justify-between flex-wrap gap-5">
                    <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                        <PopoverTrigger asChild>
                            <Button
                                role="combobox"
                                className="w-full sm:w-[200px] h-[50px] justify-between"
                            >
                                Додати категорію
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full sm:w-[200px] p-0">
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
                            <Button
                                className="flex w-full items-center justify-center h-[50px] sm:w-fit bg-random-anecdote-button-gradient text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-[30px]"
                                variant="ghost"
                            >
                                Створити власну категорію
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                     fill="none">
                                    <path
                                        d="M14.5 9.33333V12.6667C14.5 13.0203 14.3595 13.3594 14.1095 13.6095C13.8594 13.8595 13.5203 14 13.1667 14H3.83333C3.47971 14 3.14057 13.8595 2.89052 13.6095C2.64048 13.3594 2.5 13.0203 2.5 12.6667V3.33333C2.5 2.97971 2.64048 2.64057 2.89052 2.39052C3.14057 2.14048 3.47971 2 3.83333 2H7.16667V3.33333H3.83333V12.6667H13.1667V9.33333H14.5Z"
                                        fill="black"/>
                                    <path
                                        d="M14.5002 4.66667H11.8335V2H10.5002V4.66667H7.8335V6H10.5002V8.66667H11.8335V6H14.5002V4.66667Z"
                                        fill="black"/>
                                </svg>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-transparent w-full p-4 border-none">
                            <div className="ms:max-w-[425px] w-full flex flex-col gap-5 bg-white p-5 rounded-[20px]">
                                <DialogTitle>Оберіть назву для категорії</DialogTitle>
                                <div className="text-red-700 text-[0.8rem]">{errorMessage && errorMessage}</div>
                                <Input
                                    placeholder="Назва тут"
                                    className="border border-[#1e1e1e] text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-[30px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring"
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
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-wrap gap-4">
                    {
                        anecdoteCategories.map(category => (
                            <Button
                                onClick={() => handleCategory(category)}
                                variant="outline"
                                className="border border-[#1e1e1e]"
                                key={category.id}>
                                {category.title}
                                <X/>
                            </Button>
                        ))
                    }
                </div>

                <Button
                    className="w-full h-[50px]"
                    onClick={handlePublishAnecdote}
                    disabled={isReadyToPublish}
                >
                    Створити анекдот
                </Button>
            </div>
        </div>
    );
};

export default Page;