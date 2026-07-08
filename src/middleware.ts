import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'glowx_admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Só protege rotas /admin
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Libera a tela de login
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const pwd = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SECRET || '';
  const expected = btoa(unescape(encodeURIComponent(`${pwd}::${secret}`)));

  if (session && session === expected) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};