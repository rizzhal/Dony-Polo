import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';
import { readSite, writeSite } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await readSite());
}
export async function PUT(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await writeSite(await req.json());
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
