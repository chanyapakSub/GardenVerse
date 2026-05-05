import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if the user is authenticated (using a simple cookie check for now)
  const isAuthenticated = request.cookies.get('is_authenticated')?.value === 'true';
  const pathname = request.nextUrl.pathname;

  // If the user navigates to the root `/` or `/home` and is not authenticated, redirect to `/login`
  if ((pathname === '/' || pathname === '/home') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If they are on the login page but ARE authenticated, redirect them back to `/home`
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If they visit `/` but ARE authenticated, redirect them to `/home`
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to the root route, home, and the login route
export const config = {
  matcher: ['/', '/home', '/login'],
};
