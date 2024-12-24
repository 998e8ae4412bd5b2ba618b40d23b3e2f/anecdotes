import {NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async() => {
    try {
        const categories = await prisma.category.findMany();

        return new NextResponse(JSON.stringify({data: categories}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}