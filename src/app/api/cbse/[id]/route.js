import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import connectDb from '@/lib/mongodb';
import { CbseDocument } from '@/lib/models';
import { createSignedUrl } from '@/config/supabase';
import { deleteDocumentFile, savePdf, validatePdf } from '@/lib/upload';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let saved;
  let signedUrl;
  try {
    const { id } = await params;
    await connectDb();
    const document = await CbseDocument.findById(id);
    if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    const description = String(form.get('description') || '').trim();
    const file = form.get('file');
    if (!title || !description) return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    document.title = title;
    document.description = description;
    if (file && file.size > 0) {
      if (!validatePdf(file)) return NextResponse.json({ error: 'Upload a PDF up to 25 MB.' }, { status: 400 });
      saved = await savePdf(file);
      signedUrl = await createSignedUrl(saved.fileName, 86400);
      const previous = document.fileName;
      Object.assign(document, saved);
      await document.save();
      try { await deleteDocumentFile(previous); } catch (error) { console.error('Error deleting replaced CBSE document', error); }
    } else {
      if (document.fileName.startsWith('cbse/')) signedUrl = await createSignedUrl(document.fileName, 86400);
      await document.save();
    }
    const response = document.toObject();
    if (signedUrl) response.url = signedUrl;
    return NextResponse.json(response);
  } catch (error) {
    if (saved) await deleteDocumentFile(saved.fileName);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await connectDb();
    const document = await CbseDocument.findByIdAndDelete(id);
    if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    await deleteDocumentFile(document.fileName);
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
