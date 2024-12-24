'use client'
import React from 'react';
import {Card, CardContent,  CardFooter, CardHeader } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub, FaGoogle} from 'react-icons/fa';
import {signIn, useSession} from "next-auth/react";
import { redirect } from 'next/navigation';

const Login = () => {
    const {status} = useSession()

    if (status === "loading") {
        return <div>Loadingsss</div>
    }

    if (status === "authenticated") {
        redirect('/');
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Card className="w-fit">
                <CardHeader>
                    {status }
                </CardHeader>
                <CardContent className="flex flex-col gap-5 w-[300px]">
                    <Button onClick={() => signIn("google")}>
                        <FaGoogle/>
                        Google
                    </Button>
                    <Button>
                        <FaGithub/>
                        Github
                    </Button>
                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;