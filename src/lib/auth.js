import crypto from 'crypto';
import { cookies } from 'next/headers';

export const COOKIE = 'dpvn_admin';
const sign = (v) => crypto.createHmac('sha256', process.env.AUTH_SECRET || 'dev-only-secret').update(v).digest('hex');

export function makeToken() {
  const exp = String(Date.now() + 8 * 3600 * 1000);
  return `${exp}.${sign(exp)}`;
}
export function verifyToken(t) {
  if (!t) return false;
  const [exp, sig] = t.split('.');
  if (!exp || !sig) return false;
  const good = sign(exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) && Number(exp) > Date.now();
}
export async function isAdmin() {
  return verifyToken((await cookies()).get(COOKIE)?.value);
}
