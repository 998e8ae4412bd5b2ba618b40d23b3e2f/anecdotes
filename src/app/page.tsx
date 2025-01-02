import React from "react";
import Link from "next/link";

export default async function Home() {
    return (<div className="h-full flex flex-col justify-center">
        <Link href="/auth/login" className="text-3xl font-bold underline">Login</Link>
        <Link href="/anecdot/create" className="text-3xl font-bold underline">Create anecdot</Link>
        <Link href="/dashboard" className="text-3xl font-bold underline">Dashboard</Link>
    </div>);
}
