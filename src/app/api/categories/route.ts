import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {getAuthSession} from "@/lib/auth";

export const GET = async (request: Request) => {
    try {
        const url = new URL(request.url);

        // Отримуємо параметри запиту
        const search = url.searchParams.get('search') || ''; // Пошуковий запит
        const page = parseInt(url.searchParams.get('page') || '1', 10); // Номер сторінки
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10); // Кількість елементів на сторінці

        // Розрахунок offset для пагінації
        const skip = (page - 1) * pageSize;

        // Фільтрація категорій за пошуковим запитом
        const categories = await prisma.category.findMany({
            where: {
                title: {
                    contains: search, // Пошук за частковим співпадінням
                    mode: 'insensitive', // Нечутливий до регістру
                },
            },
            skip: skip,
            take: pageSize,
        });

        const totalCategories = await prisma.category.count({
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(totalCategories / pageSize);

        return new NextResponse(
            JSON.stringify({
                data: categories,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalPages: totalPages,
                    totalItems: totalCategories,
                },
            }),
            { status: 200 }
        );
    } catch (e) {
        console.log(e);
        return new NextResponse(
            JSON.stringify({ message: 'Something went wrong' }),
            { status: 500 }
        );
    }
};




export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
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
                userId: session.user.id
            }
        });

        return new NextResponse(JSON.stringify({ data: category }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
};
