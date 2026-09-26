import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import connectDb from '@/lib/mongodb';
import { CbseDocument } from '@/lib/models';
import { getDocuments, seedDynamicContent } from '@/lib/content';
import { createSignedUrl } from '@/config/supabase';
import { deleteDocumentFile, savePdf, validatePdf } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET() {
  try { return NextResponse.json(await getDocuments({ signStorageUrls: true })); }
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
    saved = await savePdf(file);
    const signedUrl = await createSignedUrl(saved.fileName, 86400);
    const document = await CbseDocument.create({ title, description, ...saved });
    const response = document.toObject();
    response.url = signedUrl;
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (saved) await deleteDocumentFile(saved.fileName);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
