import React from 'react';

interface CommentProps {
    user: string;
    content: string;
    date: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    // Helper function to format time in 24-hour format
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Check if the date is today
    if (now.toDateString() === date.toDateString()) {
        return formatTime(date);
    }

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) {
        return `Yesterday at ${formatTime(date)}`;
    }

    // For other dates, use a short month format
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
};


const Comment: React.FC<CommentProps> = ({ user, content, date }) => {
    const formattedDate = formatDate(date);

    return (
        <div className="flex flex-col gap-4 border-[#E8E8E8] border-1 border-b pb-4">
            <div className="flex justify-between items-center text-[#4b4b4b] text-sm font-medium">
                <div className="text-[#4b4b4b] text-sm font-medium font-['Manrope'] leading-tight">#{user}</div>
                <div className="text-[#8e8e8e] text-xs font-medium font-['Manrope'] leading-tight">{formattedDate}</div>
            </div>
            <div>
                <div
                    className="text-black text-sm font-normal font-['Manrope'] leading-tight"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};

export default Comment;
