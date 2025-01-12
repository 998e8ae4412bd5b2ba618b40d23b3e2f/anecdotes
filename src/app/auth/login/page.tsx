'use client'
import React from 'react';
import {Card, CardContent,  CardFooter, CardHeader } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

const Login = () => {
    return (
        <div className="">
            <Card className="absolute px-4 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full max-w-[500px]">
                <CardHeader className="p-0">
                    <h1 className="text-[#1e1e1e] text-[28px] font-bold font-['Manrope'] leading-[30px] pb-2.5">Ласкаво просимо</h1>
                    <p className="text-[#343434] text-sm font-medium font-['Manrope'] leading-tight">Виберіть зручний спосіб реєстрації та почніть користуватись усіма перевагами вже зараз.</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 w-full pt-12 px-0">
                    <Button
                        className="h-16 p-0 rounded-xl border border-[#d2d5da] text-black text-lg font-normal font-['Manrope'] leading-7"
                        variant='link'
                        onClick={() => signIn("google")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M5.67192 11.9996C5.67192 11.2202 5.8013 10.4728 6.03248 9.77191L1.98811 6.68359C1.19986 8.28391 0.755859 10.0873 0.755859 11.9996C0.755859 13.9104 1.19948 15.7125 1.98642 17.3118L6.02855 14.2175C5.79961 13.5198 5.67192 12.7753 5.67192 11.9996Z"
                                  fill="#FBBC05"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M12.7732 4.90912C14.4665 4.90912 15.9959 5.50913 17.1976 6.49088L20.6934 3C18.5632 1.14544 15.8321 0 12.7732 0C8.02419 0 3.94269 2.71575 1.98837 6.684L6.03256 9.77231C6.96443 6.94369 9.62075 4.90912 12.7732 4.90912Z"
                                  fill="#EA4335"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M12.7731 19.0898C9.62084 19.0898 6.96453 17.0552 6.03266 14.2266L1.98828 17.3143C3.94259 21.2831 8.02409 23.9989 12.7731 23.9989C15.7041 23.9989 18.5025 22.9581 20.6027 21.0081L16.7638 18.0403C15.6807 18.7226 14.3166 19.0898 12.7731 19.0898Z"
                                  fill="#34A853"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M24.2441 11.9982C24.2441 11.289 24.1348 10.5253 23.9709 9.81641H12.7734V14.4527H19.2189C18.8966 16.0335 18.0195 17.2487 16.7642 18.0396L20.6031 21.0073C22.8092 18.9598 24.2441 15.9096 24.2441 11.9982Z"
                                  fill="#4285F4"/>
                        </svg>
                        Увійдіть за допомогою Google
                    </Button>
                    <span className="text-center text-[#4b4b4b] text-sm font-medium font-['Manrope'] leading-tight">Або</span>
                    <Button
                        className="h-16 p-0 rounded-xl border border-[#d2d5da] text-black text-lg font-normal font-['Manrope'] leading-7"
                        variant='link'
                        onClick={() => signIn("github")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M11 0.5C5.20156 0.5 0.5 5.31875 0.5 11.2672C0.5 16.025 3.50937 20.0562 7.68125 21.4813C8.20625 21.5797 8.39844 21.2469 8.39844 20.9609C8.39844 20.7031 8.38906 20.0281 8.38437 19.1281C5.46406 19.7797 4.84531 17.6844 4.84531 17.6844C4.36719 16.4422 3.67813 16.1094 3.67813 16.1094C2.72656 15.4391 3.74844 15.4531 3.74844 15.4531C4.80313 15.5281 5.35625 16.5641 5.35625 16.5641C6.29375 18.2094 7.8125 17.7359 8.4125 17.4594C8.50625 16.7656 8.77812 16.2875 9.07812 16.0203C6.74844 15.7484 4.29688 14.825 4.29688 10.7C4.29688 9.52344 4.70469 8.5625 5.375 7.8125C5.26719 7.54063 4.90625 6.44375 5.47812 4.9625C5.47812 4.9625 6.35938 4.67188 8.36563 6.06406C9.20469 5.825 10.1 5.70781 10.9953 5.70312C11.8859 5.70781 12.7859 5.825 13.625 6.06406C15.6313 4.67188 16.5078 4.9625 16.5078 4.9625C17.0797 6.44375 16.7188 7.54063 16.6109 7.8125C17.2812 8.56719 17.6891 9.52813 17.6891 10.7C17.6891 14.8344 15.2328 15.7437 12.8937 16.0109C13.2687 16.3438 13.6063 17 13.6063 18.0031C13.6063 19.4422 13.5922 20.6047 13.5922 20.9562C13.5922 21.2422 13.7797 21.5797 14.3141 21.4719C18.4953 20.0516 21.5 16.0203 21.5 11.2672C21.5 5.31875 16.7984 0.5 11 0.5Z"
                                  fill="black"/>
                        </svg>
                        Увійдіть за допомогою GitHub
                    </Button>
                </CardContent>
                <CardFooter className="p-0">
                    <p className="text-[#616161] text-xs font-normal font-['Manrope'] leading-[20px]">Ми
                        використовуємо лише ваші основні дані для створення облікового запису.<br/>Жодних складних
                        паролів або зайвих форм — швидко та безпечно.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;