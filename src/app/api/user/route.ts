import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async(req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId") || '';

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        return new NextResponse(JSON.stringify({data: user}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}