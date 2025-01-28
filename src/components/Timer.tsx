'use client';

import React, { useEffect, useState } from 'react';

const Timer: React.FC = () => {
    const targetDate = new Date('2025-02-28T23:59:59'); // Задана дата і час завершення

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            }; // Якщо час вийшов
        }
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval); // Очищення інтервалу
    }, []);

    return (
        <div className="flex gap-4 flex-wrap justify-center">
            <TimerBlock value={timeLeft.days} label="Днів" />
            <TimerBlock value={timeLeft.hours} label="Годин" />
            <TimerBlock value={timeLeft.minutes} label="Хвилин" />
            <TimerBlock value={timeLeft.seconds} label="Секунд" />
        </div>
    );
};

const TimerBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="w-fit">
        <div
            className="h-[120px] w-[120px] flex items-center justify-center bg-[#1e1e1e] rounded-[19px] border-2 border-[#c3fdfe]">
            <div className="text-white text-[28px] font-bold">{value}</div>
        </div>
        <div className="text-[#1e1e1e] text-center text-base font-bold leading-[30px]">{label}</div>
    </div>
);

export default Timer;
