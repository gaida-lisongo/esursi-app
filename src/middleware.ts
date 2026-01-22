import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    const { pathname } = request.nextUrl;
    
    // Log for debugging only - no redirection logic
    const allCookies = request.cookies.getAll();
    console.log('Middleware info:', { 
        pathname, 
        hasToken: !!token, 
        cookieCount: allCookies.length 
    });

    // Static files and API routes
    const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next');

    if (isPublicFile) {
        return NextResponse.next();
    }

    // Let all requests through - client-side protection will handle auth
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
