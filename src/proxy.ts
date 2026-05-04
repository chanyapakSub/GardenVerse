import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if the user is authenticated (using a simple cookie check for now)
  const isAuthenticated = request.cookies.get('is_authenticated')?.value === 'true';

  // If the user navigates perfectly to the root `/` and is not authenticated, redirect to `/login`
  if (request.nextUrl.pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If they are on the login page but ARE authenticated, redirect them back to `/`
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to the root route and the login route
export const config = {
  matcher: ['/', '/login'],
};
