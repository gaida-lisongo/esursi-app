import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup') || pathname.startsWith('/reset-password');

    // Static files and API routes (some APIs might need protection, but usually handled in the route itself or here)
    const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next');

    if (isPublicFile) {
        return NextResponse.next();
    }

    if (!token && !isAuthPage) {
        // If no token and not on an auth page, redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    if (token && isAuthPage) {
        // If already logged in and trying to access signin, redirect to home
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
