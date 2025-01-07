'use client'
import React, { useEffect, useRef, useState } from 'react';

const Dice = () => {
    const diceRef = useRef<HTMLDivElement>(null);
    const [diceValue, setDiceValue] = useState(1);

    const rollDice = (value: number) => {
        if (diceRef.current) {
            diceRef.current.style.animation = 'rolling 4s';

            setTimeout(() => {
                if (diceRef.current) { // Add null check here
                    switch (value) {
                        case 1:
                            diceRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
                            break;
                        case 2:
                            diceRef.current.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                            break;
                        case 3:
                            diceRef.current.style.transform = 'rotateX(0deg) rotateY(90deg)';
                            break;
                        case 4:
                            diceRef.current.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                            break;
                        case 5:
                            diceRef.current.style.transform = 'rotateX(90deg) rotateY(0deg)';
                            break;
                        case 6:
                            diceRef.current.style.transform = 'rotateX(180deg) rotateY(0deg)';
                            break;
                        default:
                            break;
                    }
                    diceRef.current.style.animation = 'none';
                }
            }, 4050);
        }
    };

    useEffect(() => {
        // First immediate roll
        const initialRoll = () => {
            const random = Math.floor(Math.random() * 6) + 1;
            setDiceValue(random);
            rollDice(random);
        };

        initialRoll(); // Start rolling immediately

        const interval = setInterval(() => {
            const random = Math.floor(Math.random() * 6) + 1;
            setDiceValue(random);
            rollDice(random);
        }, 5000); // Roll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <section className="dice-section">
            <div className="dice-container">
                <div ref={diceRef} className="dice">
                    <div className="face front"></div>
                    <div className="face back"></div>
                    <div className="face top"></div>
                    <div className="face bottom"></div>
                    <div className="face right"></div>
                    <div className="face left"></div>
                </div>

                <div
                    className="pt-16 text-[#1e1e1e] text-base font-medium font-['Manrope'] leading-[30px]">Зачекайте...
                </div>
            </div>
        </section>
    );
};

export default Dice;