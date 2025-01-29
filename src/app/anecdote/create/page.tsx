'use client'
import React, {useEffect, useState} from 'react';
import {ContentState, convertFromRaw, EditorState} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ArticleEditor from "@/components/Editor";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {ChevronDown, HelpCircle, X} from "react-feather";
import Link from "next/link";
import {toast} from "sonner";
import {Category} from "@/types/anecdote.types";

interface AnecdoteCreateData {
    title: string
    content: string
    categories: Category[]
    newCategories: string[]
    forContest?: boolean
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
    const res = await fetch(`/api/categories?pageSize=40`, {
        cache: 'no-cache',
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    const {data} = await res.json();
    return data;
}

const publishAnecdote = async (anecdote: AnecdoteCreateData) => {
    const { title, content, categories, newCategories, forContest } = anecdote;

    try {
        // First, create all new categories
        const createdCategories = await Promise.all(
            newCategories.map(async (categoryTitle) => {
                const { data } = await createCategory(categoryTitle);
                return data;
            })
        );

        // Combine existing and newly created categories
        const allCategories = [...categories, ...createdCategories];

        // Then publish the anecdote with all categories
        const res = await fetch(`/api/anecdotes`, {
            cache: 'no-cache',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                categories: {
                    connect: allCategories.map((category: Category) => ({ id: category.id }))
                },
                forContest
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
        title: '',
        content: '',
        categories: [],
        newCategories: []
    }

    const [anecdoteDraft, setAnecdoteDraft] = useState<AnecdoteCreateData>(draftData);
    const [anecdoteCategories, setAnecdoteCategories] = React.useState<Category[]>([]);
    const [pendingCategories, setPendingCategories] = React.useState<string[]>([]);
    const isReadyToPublish = !(anecdoteDraft.title !== draftData.title && anecdoteDraft.content !== draftData.content && (anecdoteCategories.length !== 0 || pendingCategories.length !== 0));
    const [openCategorySelect, setOpenCategorySelect] = React.useState(false);
    const [openCategoryCreate, setOpenCategoryCreate] = useState(false);
    const [categories, setCategories] = React.useState<Category[]>([])
    const [categoryToCreate, setCategoryToCreate] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [takePartInTender, setTakePartInTender] = useState(false);

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
            categories: anecdoteCategories,
            newCategories: pendingCategories
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

    const handleCreateCategory = (title: string) => {
        // Validation checks
        if (title.length > 17) {
            setErrorMessage("Максимальна кількість символів рівна 17 або менше");
            setCategoryToCreate('');
            return;
        }

        if (pendingCategories.length >= 5) {
            setErrorMessage("Ви уже створили максимальну кількість категоірй! Тобто 5");
            setCategoryToCreate('');
            return;
        }

        if (pendingCategories.includes(title) || categories.some(cat => cat.title === title)) {
            setErrorMessage("Категорія із таким іменем уже існує!");
            setCategoryToCreate('');
            return;
        }

        setPendingCategories([...pendingCategories, title]);
        setOpenCategoryCreate(false);
        setCategoryToCreate('');
        setErrorMessage('');
    }

    const removePendingCategory = (categoryTitle: string) => {
        setPendingCategories(pendingCategories.filter(cat => cat !== categoryTitle));
    }

    const handlePublishAnecdote = async () => {
        try {
            const data = await publishAnecdote({
                ...anecdoteDraft,
                forContest: takePartInTender,
                categories: anecdoteCategories,
                newCategories: pendingCategories
            });

            if (data.message === "You can only create up to 5 anecdotes in a 24-hour period") {
                toast("Ви вичерпали ліміт у 5 створених анекдотів за день!", {
                    description: "Зате як завжди дані було передано у СБУ та ТЦК 😆",
                    action: {
                        label: "Сумно...",
                        onClick: () => handlePublishAnecdote(),
                    },
                });
                return;
            }

            if (data.message === "You have already 3 anecdotes for contest") {
                toast("У вас уже 3 анекдоти для конкурсу!", {
                    description: "Танцювала риба з раком",
                    action: {
                        label: "Путін хуйло",
                        onClick: () => handlePublishAnecdote(),
                    },
                });
                return;
            }

            // Reset form after successful publish
            setTitle('');
            setEditorState(EditorState.createEmpty());
            setAnecdoteCategories([]);
            setPendingCategories([]);
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

    const handleToggle = (checked: boolean) => {
        setTakePartInTender(checked);
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
        <div className="flex w-full pt-6 pb-12 ms:p-24 gap-8 justify-center">
            <div className="flex w-full max-w-[569px] flex-col gap-4">
                <div>
                    <h1 className="text-[#1e1e1e] text-[28px] font-bold font-['Manrope']">Створення анекдоту</h1>
                    <Link href='/rules' className="flex gap-1 pt-1 ms:pt-3">
                        <p className="text-[#616161] text-xs font-medium font-['Manrope'] leading-tight">правила
                            анекдтоів</p>
                        <HelpCircle size={15}/>
                    </Link>
                </div>

                <ArticleEditor
                    title={title}
                    setTitle={setTitle}
                    editorState={editorState}
                    setEditorState={setEditorState}
                    onSave={handleSaveContent}/>


                <div className="flex flex-col justify-between flex-wrap gap-3 sm:gap-5">
                    <div className="flex items-center gap-4">
                        <span className="text-[#1e1e1e] text-sm font-medium">Взяти участь в конкурсі</span>
                        <label
                            className={`relative flex items-center w-12 h-6 rounded-[7px] transition-colors duration-300 ${
                                takePartInTender ? "bg-random-anecdote-button-gradient-anim animate-gradientAnimation bg-[length:105%_105%]" : "bg-black"
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={takePartInTender}
                                onChange={(e) => handleToggle(e.target.checked)}
                            />
                            <span
                                className={`absolute left-1 top-1 h-4 w-4 bg-white rounded-[7px] transition-all duration-300 ${
                                    takePartInTender ? "peer-checked:bg-black top-[0px] left-6 h-6 w-6" : "peer-checked:bg-white"
                                }`}
                            ></span>
                        </label>
                    </div>


                    <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                        <PopoverTrigger asChild>
                            <Button
                                role="combobox"
                                className="w-full h-[50px] justify-between"
                            >
                                Додати категорію
                                <ChevronDown/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[93vw] sm:max-w-[569px] p-0">
                            <Command>
                                <CommandInput placeholder="Знайти категорію..."/>
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

                    {(anecdoteCategories.length !== 0 || pendingCategories.length !== 0) && (
                        <div className="flex flex-wrap gap-4">
                            {anecdoteCategories.map(category => (
                                <Button
                                    onClick={() => handleCategory(category)}
                                    variant="outline"
                                    className="border border-[#1e1e1e]"
                                    key={category.id}>
                                    {category.title}
                                    <X/>
                                </Button>
                            ))}
                            {pendingCategories.map(categoryTitle => (
                                <Button
                                    onClick={() => removePendingCategory(categoryTitle)}
                                    variant="outline"
                                    className="border border-[#1e1e1e]"
                                    key={categoryTitle}>
                                    {categoryTitle} (нова)
                                    <X/>
                                </Button>
                            ))}
                        </div>
                    )}

                    <Dialog open={openCategoryCreate} onOpenChange={setOpenCategoryCreate}>
                        <DialogTrigger asChild>
                            <Button
                                className="flex w-full items-center justify-center h-[50px] bg-[#E8E8E8] text-[#1e1e1e] text-sm font-medium hover:bg-[#E8E8E8]"
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
                                {errorMessage && <div className="text-red-700 text-[0.8rem]">{errorMessage}</div>}
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

                <Button
                    className="w-full h-[50px] mt-8 sm:mt-0"
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