'use client'
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const Cookie = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
        if (!hasAcceptedCookies) {
            setShowBanner(true);
        }
    }, []);

    // Кнопка прийняття cookies
    const handleAcceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            className="fixed bottom-[2%] right-[2%] max-w-[685px] min-h-[255px] p-[30px] z-[100] bg-white rounded-[20px] shadow-[0px_2px_20px_-5px_rgba(0,0,0,0.258)] flex-col justify-center items-center gap-[25px] inline-flex">
            <div className="self-stretch"><span className="text-black text-lg font-normal ">Ми використовуємо файли cookie для покращення роботи нашого сайту, аналізу трафіку та персоналізації контенту.<br/>Продовжуючи користування сайтом, ви погоджуєтесь із нашою </span><span
                className="text-black text-lg font-normal  underline"><Link href="/policy">Політикою використання cookie</Link></span><span
                className="text-black text-lg font-normal ">. Ви можете налаштувати використання cookie або відмовитися від них.</span>
            </div>
            <div className="self-stretch justify-center items-start gap-5 flex flex-col sm:flex-row">
                <div
                    onClick={handleAcceptCookies}
                    className="cursor-pointer grow shrink basis-0 self-stretch px-5 py-2.5 bg-[#e8e8e8] order-1 sm:order-none rounded-[10px] justify-center items-center gap-2.5 flex">
                    <div className="text-[#1e1e1e] text-lg font-normal " >Відхилити</div>
                </div>
                <div
                    onClick={handleAcceptCookies}
                    className="cursor-pointer grow shrink basis-0 self-stretch px-5 py-2.5 bg-[#1e1e1e] rounded-[10px] justify-center items-center gap-2.5 flex">
                    <div className="text-white text-base font-medium font-['Manrope'] leading-[30px]">Прийняти cookie
                    </div>
                </div>
            </div>
            <div className="left-[50%] top-[-80px] sm:left-[-70px] sm:top-[-70px] absolute text-black text-[84.05px] font-normal ">🍪</div>
            <div className="left-[30%] top-[-20px] sm:left-[-30px] sm:top-[53px] absolute text-black text-[34.61px] font-normal ">🍪</div>
            <div className="left-[80%] top-[-10px] sm:left-[56px] sm:top-[-35px] absolute text-black text-5xl font-normal ">🍪</div>
        </div>
    );
};

export default Cookie