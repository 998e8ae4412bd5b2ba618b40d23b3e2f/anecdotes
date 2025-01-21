import React from 'react';
import Link from "next/link";

interface Button {
    name: string;
    url: string;
}

interface AlertModalProps {
    title: string;
    content: string;
    buttons: Button[];
}

const AlertMessage = ({title, content, buttons}: AlertModalProps) => {
    return (
        <div
            className="p-4 rounded-[20px] flex-col justify-center items-center gap-[50px]"
        >
            <div className="p-10 bg-white rounded-[20px] shadow-[0px_2px_20px_-5px_rgba(0,0,0,0.08)]">
                <p className="text-center text-black text-[32px] font-semibold font-['Manrope'] ">{title}</p>
                <p className="text-center text-black text-lg font-normal font-['Manrope']">{content}</p>


                <div className="flex flex-wrap md:flex-nowrap w-full pt-12 gap-4">
                    {
                        buttons.map((button: Button, index: number) => (
                            <Link
                                href={button.url}
                                key={button.name}
                                className={`h-[55px] w-full px-5  rounded-[10px] flex flex-row-reverse justify-center items-center gap-2.5 text-base font-medium font-['Manrope'] leading-[30px] ${
                                    index !== 0
                                        ? 'bg-[#e8e8e8] text-[#1e1e1e]'
                                        : 'bg-[#1e1e1e] text-white'
                                }`}
                            >
                                {button.name}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default AlertMessage;