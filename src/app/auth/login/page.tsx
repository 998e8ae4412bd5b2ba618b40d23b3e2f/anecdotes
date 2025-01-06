'use client'
import React from 'react';
import {Card, CardContent,  CardFooter, CardHeader } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub, FaGoogle} from 'react-icons/fa';
import {signIn} from "next-auth/react";

const Login = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Card className="w-fit">
                <CardHeader>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 w-[300px]">
                    <Button onClick={() => signIn("google")}>
                        <FaGoogle/>
                        Google
                    </Button>
                    <Button onClick={() => signIn("github")}>
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