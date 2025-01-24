'use client';

import React, { useEffect, useState } from 'react';

const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 12,
        hours: 12,
        minutes: 12,
        seconds: 12,
    });

    // Хук для оновлення таймера
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                const { days, hours, minutes, seconds } = prevTime;

                if (seconds > 0) {
                    return { ...prevTime, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { ...prevTime, seconds: 59, minutes: minutes - 1 };
                } else if (hours > 0) {
                    return { ...prevTime, seconds: 59, minutes: 59, hours: hours - 1 };
                } else if (days > 0) {
                    return { ...prevTime, seconds: 59, minutes: 59, hours: 23, days: days - 1 };
                } else {
                    clearInterval(interval);
                    return prevTime; // Таймер завершився
                }
            });
        }, 1000);

        return () => clearInterval(interval); // Очищення інтервалу
    }, []);

    return (
        <div className="flex gap-4 flex-wrap justify-center ">
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
        <div className="text-[#1e1e1e] text-center text-base font-bold  leading-[30px]">{label}</div>
    </div>
);

export default Timer;
