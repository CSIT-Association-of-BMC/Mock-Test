import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key");

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin-token');

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token.value, secret);
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect dashboard route
    if (pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('user-token');

        if (!token) {
            return NextResponse.redirect(new URL('/result/login', request.url));
        }

        try {
            await jwtVerify(token.value, secret);
        } catch (error) {
            return NextResponse.redirect(new URL('/result/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'],
};
