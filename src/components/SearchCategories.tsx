import React, { useEffect, useMemo, useState } from 'react';
import { Input } from "@/components/ui/input";
import { SearchIcon, Loader2 } from "lucide-react";
import debounce from 'lodash/debounce';

interface Category {
    id: string;
    title: string;
}

interface SearchCategoriesProps {
    onCategorySelect: (category: string) => void;
}

interface FetchCategoriesResponse {
    data: Category[];
    totalPages: number;
}

const getCategories = async (query: string, size?: number): Promise<Category[]> => {
    const searchParam = query === '' ? '' : `search=${query}`;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/categories?${searchParam}&page=1&pageSize=${size}`,
        { cache: 'no-cache' }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    const { data }: FetchCategoriesResponse = await res.json();
    return data;
};

const SearchCategories: React.FC<SearchCategoriesProps> = ({ onCategorySelect }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);

    const debouncedFetchCategories = useMemo(
        () =>
            debounce(async (query: string) => {
                if (!query.trim()) {
                    setSearchResults([]);
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                try {
                    const data = await getCategories(query, 30);
                    setSearchResults(data);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedFetchCategories.cancel();
        };
    }, [debouncedFetchCategories]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setSearchQuery(value);
        debouncedFetchCategories(value);
    };

    const handleCategoryClick = (category: string): void => {
        onCategorySelect(category);
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    return (
        <div className="relative">
            <div className="relative border-[1px] border-[#E8E8E8] border-solid rounded-[10px]">
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => {
                        setTimeout(() => setShowResults(false), 200);
                    }}
                    placeholder="Пошук категорій"
                    className="w-[85%] h-[44px] border-none px-5 py-2.5 text-blackPrimary placeholder-text-[#8E8E8E] rounded-[10px] justify-center items-center gap-2.5 inline-flex focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring"
                />

                {isLoading ? (
                    <Loader2
                        className="animate-spin absolute top-1/2 right-2 -translate-x-1/2 -translate-y-1/2"
                        size={22}
                    />
                ) : (
                    <SearchIcon
                        size={22}
                        className="absolute top-1/2 right-2 -translate-x-1/2 -translate-y-1/2"
                    />
                )}
            </div>

            {showResults && searchQuery.trim() && (searchResults.length > 0 || isLoading) && (
                <div className="absolute top-14 left-0 w-full max-h-[200px] py-2.5 px-4 bg-white rounded-[14px] shadow-[0px_4px_15.600000381469727px_-7px_rgba(0,0,0,0.25)] border border-[#e8e8e8] flex-col justify-start items-start gap-2.5 inline-flex overflow-y-auto">
                    {isLoading ? (
                        <div className="w-full flex justify-center py-4">
                            <Loader2 className="animate-spin" size={24} />
                        </div>
                    ) : (
                        searchResults.map((cat: Category) => (
                            <div
                                className="w-full text-[#1e1e1e] text-sm font-medium hover:bg-gray-100 p-2 rounded cursor-pointer"
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.title)}
                            >
                                {cat.title}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchCategories;