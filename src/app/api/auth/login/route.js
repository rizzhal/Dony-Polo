import { NextResponse } from 'next/server';
import { makeToken, COOKIE } from '@/lib/auth';

export async function POST(req) {
  const { username, password } = await req.json();
  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD || username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong username or password.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 8 * 3600 });
  return res;
}
