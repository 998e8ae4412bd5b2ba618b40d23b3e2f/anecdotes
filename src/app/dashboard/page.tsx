import React from 'react';
import {Card, CardContent, CardHeader} from "../../../components/ui/card";

const getData = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
        cache: 'no-cache',
    });

    if(!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Page = async () => {
    const data = await getData()
    console.log(data)
    return (
        <div>
            <ul>
                {
                    data?.map((item: object) => {
                        return <li key={item.id}>{item.title}</li>
                    })
                }
            </ul>


            <section className="flex flex-wrap gap-8">
                <Card className="w-fit">
                    <CardHeader>

                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default Page;