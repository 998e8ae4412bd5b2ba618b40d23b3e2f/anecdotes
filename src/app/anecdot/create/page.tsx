'use client'
import React, {useEffect, useState} from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ArticleEditor from "@/components/Editor";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Category} from "@prisma/client";

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

    const data = await res.json();
    return data;
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
                connect: categories.map(category => ({ id: category.id }))
            }
        })
    })

    if(!res.ok) {
        throw new Error("Failed");
    }

    const data = await res.json();
    return data;
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
            const {data} = await createCategory(title);
            if (data.message === "category already exist") {
                setErrorMessage("Category already exists");
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
        <div className="flex w-full p-24 gap-8">
            <div className="flex flex-1 flex-col gap-4">
                <ArticleEditor onSave={handleSaveContent}/>

                <div>
                    <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-[200px] justify-between"
                            >
                                Choose category
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search framework..." />
                                <CommandList>
                                    <CommandEmpty>No categories found.</CommandEmpty>
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
                            <Button className="w-fit">Create category</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle>Create category</DialogTitle>
                            <div className="text-red-700 text-[0.8rem]">{errorMessage && errorMessage}</div>
                            <Input
                                placeholder="Category name"
                                className="font-semibold text-lg"
                                value={categoryToCreate}
                                onChange={(e) => setCategoryToCreate(e.target.value)}
                                required
                            />

                            <Button
                                onClick={() => handleCreateCategory(categoryToCreate)}
                                disabled={categoryToCreate === ''}
                            >
                                Create
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

                <Button className="w-fit" onClick={() => publishAnecdote(anecdoteDraft)}
                        disabled={isReadyToPublish}>Publish</Button>
            </div>
            <div className="w-[400px]">
                {/*<Anecdote anecdote={anecdoteDraft}/>*/}
            </div>
        </div>
    );
};

export default Page;