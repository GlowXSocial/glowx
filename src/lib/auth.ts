import { cookies } from 'next/headers';

const SESSION_COOKIE = 'glowx_admin_session';

/**
 * Autenticação simples por senha única.
 * O cookie armazena um HMAC-like da senha concatenada com o ADMIN_SECRET.
 * Não é high-security, mas atende um admin único com infra na Vercel.
 */

function token(): string {
  const pwd = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SECRET || '';
  // token determinístico — não usa libs externas
  return btoa(unescape(encodeURIComponent(`${pwd}::${secret}`)));
}

export function verifyPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD || '');
}

export async function createSession(): Promise<void> {
  cookies().set(SESSION_COOKIE, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function destroySession(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const c = cookies().get(SESSION_COOKIE)?.value;
  return !!c && c === token();
}