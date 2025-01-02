import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";

export const GET = async() => {
    try {
        const categories = await prisma.category.findMany();

        return new NextResponse(JSON.stringify({data: categories}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}


export const POST = async(req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
        }

        const body = await req.json()
        const categoryTitle = body.categoryTitle;

        const categoryExist = await prisma.category.findFirst({
            where: {
                title: categoryTitle
            }
        });

        if (categoryExist) {{
            return new NextResponse(JSON.stringify({message: "category already exist"}), { status: 200 });
        }}

        const category = await prisma.category.create({
            data: {
                title: categoryTitle,
                userId: session.user.id
            }
        })

        return new NextResponse(JSON.stringify({data: category}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}