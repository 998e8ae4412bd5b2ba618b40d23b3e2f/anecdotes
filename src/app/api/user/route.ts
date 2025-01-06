import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";

export const GET = async(req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId") || '';

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({message: "error"}), {status: 500});
        }

        const useRes = {
            name: user.name,
            image: user.image
        }

        return new NextResponse(JSON.stringify({data: useRes}), { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse(JSON.stringify({message: 'smth went wrong'}), {status: 500})
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }

        const userId = session.user.id;
        const body = await req.json();
        const { name, image } = body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name || user.name,
                image: image || user.image
            },
        });

        return new NextResponse(JSON.stringify({ data: updatedUser }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}