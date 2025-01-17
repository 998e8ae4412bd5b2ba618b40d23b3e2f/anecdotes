import React from 'react';
import Link from "next/link";

interface IEmptyMessage {
    title: string;
    content: string;
}

const EmptyMessage = ({title, content}: IEmptyMessage) => {
    return (
        <div
            className="rounded-[20px]  flex-col justify-center shadow-none items-center gap-[50px] max-w-[470px] w-full"
        >
            <div className="bg-white p-8 rounded-[20px]">
                <p className="text-center text-[#1e1e1e] text-2xl font-extrabold font-['Manrope'] leading-[30px] pb-2.5">{title}</p>
                <p className="text-center text-[#4b4b4b] text-sm font-normal font-['Manrope'] leading-tight">{content}</p>


                <div className="flex flex-wrap md:flex-nowrap w-full pt-8 gap-4">
                    <Link
                        href='/'
                        className={`bg-[#1e1e1e] text-white h-[50px] w-full px-5  rounded-[10px] flex flex-row-reverse justify-center items-center gap-2.5 text-base font-medium font-['Manrope'] leading-[30px]`}
                    >
                        Знайти анкдот
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmptyMessage;