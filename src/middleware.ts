import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const protectedRoutes = ['/anecdote/create', '/profile'];

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        const token = request.cookies.get('__Secure-next-auth.session-token')?.value || request.cookies.get('next-auth.session-token')?.value;

        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/anecdote/create/:path*', '/profile/:path*'],
};
