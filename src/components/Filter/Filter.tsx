import React, {useEffect, useState} from 'react';
import SearchCategories from "@/components/SearchCategories";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {ChevronDown, X} from "react-feather";
import {usePathname, useRouter} from "next/navigation";

const getCategories = async (query: string, size?: number) => {
    const searchParam = query === '' ? '' : `search=${query}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories?${searchParam}&page=1&pageSize=${size}`, {
        cache: 'no-cache',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    const { data } = await res.json();
    return data;
};

const Filter = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState([]);
    const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false)
    const widthClasses = ['w-24', 'w-18', 'w-32', 'w-28', 'w-20', 'w-16', 'w-24', 'w-18', 'w-32', 'w-28', 'w-20', 'w-16'];
    const categoriesColors = ['#beaefb', '#fccdf1', '#f6c4cf'];
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState({
        categories: true,
        anecdotes: true
    });

    const handleCategorySelect = (category: string) => {
        setSelectedCategories((prev) => {
            return prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category];
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams();
        if (selectedCategories.length > 0) {
            searchParams.set("categories", selectedCategories.join(","));
        } else {
            searchParams.delete("categories");
        }
        searchParams.set("page", "1");

        router.push(`${pathname}?${searchParams.toString()}`);
    }, [selectedCategories, pathname, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(prev => ({ ...prev, categories: true}));
                const data = await getCategories('', showMoreCategories ? 35 : 20);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(prev => ({ ...prev, categories: false}));
            }
        };
        fetchData();
    }, [showMoreCategories]);


    return (
        <div className="w-full sm:max-w-64 mb-4 md:mb-0">
            <div className="flex flex-col gap-2 md:gap-6 mb-2">
                    <span
                        className="text-blackPrimary text-2xl font-extrabold font-['Manrope'] leading-[30px]"
                    >Головна</span>

                <SearchCategories onCategorySelect={(cat) => handleCategorySelect(cat)}/>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 pb-4">
                {
                    selectedCategories.map((cat) => (
                        <Button
                            className="flex items-center p-0"
                            key={cat}
                            variant="ghost"
                            onClick={() => handleCategorySelect(cat)}
                        >
                            <span
                                className="text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-[5px]">
                                {cat}
                            </span>

                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                 fill="none">
                                <rect width="18" height="18" rx="4" fill="#1E1E1E"/>
                                <path d="M13 5L5 13" stroke="white" strokeWidth="1.33333" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M5 5L13 13" stroke="white" strokeWidth="1.33333" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </Button>
                    ))
                }
            </div>

            <div className="mb-2.5">
                <span className="text-blackPrimary text-xs font-semibold font-['Manrope'] leading-[15px] mb-1.5 block">Топ категорії</span>

                <ul className="flex flex-col gap-1.5">
                    {
                        loading.categories ?
                            Array.from({length: 3}, (_, i: number) => {
                                return (
                                    <Skeleton
                                        key={i}
                                        className={`rounded-md px-6 py-1 w-full h-8`}
                                    />
                                );
                            })
                            :
                            categories.slice(0, 3).map((item: Category, i: number) => {
                                const categoryColor = selectedCategories.includes(item.title) ? 'black' : categoriesColors[i];

                                return (
                                    <li
                                        style={{backgroundColor: categoryColor}}
                                        className={`rounded-md px-6 py-1 text-[#1e1e1e] text-sm font-medium font-['Manrope'] leading-[30px] cursor-pointer ${selectedCategories.includes(item.title) ? 'text-white' : ''}`}
                                        key={item.id}
                                        onClick={() => handleCategorySelect(item.title)}
                                    >
                                        {item.title}
                                    </li>
                                );
                            })
                    }
                </ul>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2.5 mb-2.5">
                {
                    loading.categories ?
                        Array.from({length: 12}, (_, i: number) => {
                            return (
                                <Skeleton
                                    key={i}
                                    className={`rounded-md ${widthClasses[i]} px-6 py-1 h-6`}
                                />
                            );
                        })
                        :
                        categories.slice(3, categories.length).map((item: Category) => {
                            return (
                                <li
                                    className={`rounded-[12px] px-2 text-blackPrimary text-sm font-normal font-['Manrope'] leading-[30px] cursor-pointer   ${selectedCategories.includes(item.title) ? 'bg-black text-white' : ''}`}
                                    key={item.id}
                                    onClick={() => handleCategorySelect(item.title)}
                                >
                                    {item.title}
                                </li>
                            );
                        })
                }
            </ul>

            <Button
                variant='ghost'
                className="p-0 gap-3 text-blackPrimary text-sm font-medium font-['Manrope'] leading-[30px]"
                onClick={() => setShowMoreCategories(true)}
            >
                {showMoreCategories ? 'Усі категорії' : 'Більше категорій'}

                {!showMoreCategories && <ChevronDown/>}
            </Button>
        </div>
    );
};

export default Filter;