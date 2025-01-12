import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const encodedCategoryName = url.pathname.split('/').pop();

        if (!encodedCategoryName) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        const categoryName = decodeURIComponent(encodedCategoryName);

        const res = await prisma.category.findMany({
            where: { title: categoryName },
        });

        console.log(res)

        if (res.length === 0)  {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(res[0]);
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
