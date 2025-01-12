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


export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            // return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
        }

        const body = await req.json();
        const categoryTitle = body.categoryTitle;

        if (!categoryTitle || categoryTitle.length > 10) {
            return new NextResponse(
                JSON.stringify({ message: "Category title must be 10 characters or less" }),
                { status: 200 }
            );
        }

        const categoryExist = await prisma.category.findFirst({
            where: {
                title: categoryTitle
            }
        });

        if (categoryExist) {
            return new NextResponse(JSON.stringify({ message: "Category already exists" }), { status: 200 });
        }

        const category = await prisma.category.create({
            data: {
                title: categoryTitle,
                // userId: session.user.id
                userId: 'cm5fcdt400000w474yzlw7m25'
            }
        });

        return new NextResponse(JSON.stringify({ data: category }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};
