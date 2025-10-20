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

    // Protect dashboard route and redirect admins
    if (pathname.startsWith('/dashboard')) {
        const userToken = request.cookies.get('user-token');
        const adminToken = request.cookies.get('admin-token');

        // If admin is trying to access dashboard, redirect to admin
        if (adminToken) {
            try {
                await jwtVerify(adminToken.value, secret);
                return NextResponse.redirect(new URL('/admin', request.url));
            } catch (error) {
                // Invalid admin token, continue to check user token
            }
        }

        // Check user token for regular users
        if (!userToken) {
            return NextResponse.redirect(new URL('/result/login', request.url));
        }

        try {
            await jwtVerify(userToken.value, secret);
        } catch (error) {
            return NextResponse.redirect(new URL('/result/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'],
};
