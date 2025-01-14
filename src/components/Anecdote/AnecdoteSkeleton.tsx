import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const AnecdoteSkeleton = () => {
    return (
        <div className="flex flex-col justify-between lg:w-64 lg:h-64">
            <Skeleton className="h-7" />

            <div className="flex flex-col gap-3 pt-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-[80%]" />
                <Skeleton className="h-5 w-36" />
            </div>

            <div className="flex justify-end gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
            </div>
        </div>
    );
};

export default AnecdoteSkeleton;