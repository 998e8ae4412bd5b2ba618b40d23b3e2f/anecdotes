import {NextResponse} from "next/server";
import {prisma} from "../../../utils/connect";

export const GET = async(req, res) => {
    try {
        const categories = await prisma.category.findMany();
        return new NextResponse(JSON.stringify(categories, {status: 200}))
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}, {status: 500}))
    }
}