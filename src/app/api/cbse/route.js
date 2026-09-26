import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import connectDb from '@/lib/mongodb';
import { CbseDocument } from '@/lib/models';
import { getDocuments, seedDynamicContent } from '@/lib/content';
import { saveFile, validatePdf } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET() {
  try { return NextResponse.json(await getDocuments()); }
  catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let saved;
  try {
    await connectDb();
    await seedDynamicContent();
    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    const description = String(form.get('description') || '').trim();
    const file = form.get('file');
    if (!title || !description) return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    if (!validatePdf(file)) return NextResponse.json({ error: 'Upload a PDF up to 25 MB.' }, { status: 400 });
    saved = await saveFile(file);
    return NextResponse.json(await CbseDocument.create({ title, description, ...saved }), { status: 201 });
  } catch (error) {
    if (saved) { const { deleteFile } = await import('@/lib/upload'); await deleteFile(saved.fileName); }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
