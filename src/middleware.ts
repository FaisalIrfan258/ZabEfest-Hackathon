import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === '/' || 
                       pathname === '/login' || 
                       pathname === '/signup' || 
                       pathname.startsWith('/auth/') || 
                       pathname.startsWith('/forgot-password') ||
                       pathname.includes('/reset-password');
  
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;

  // If the path is not public and the user is not authenticated,
  // redirect to the login page
  if (!isPublicPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login/signup,
  // redirect to the dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 