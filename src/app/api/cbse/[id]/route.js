import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import connectDb from '@/lib/mongodb';
import { CbseDocument } from '@/lib/models';
import { deleteFile, saveFile, validatePdf } from '@/lib/upload';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let saved;
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
      saved = await saveFile(file);
      const previous = document.fileName;
      Object.assign(document, saved);
      await document.save();
      await deleteFile(previous);
    } else await document.save();
    return NextResponse.json(document);
  } catch (error) {
    if (saved) await deleteFile(saved.fileName);
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
    await deleteFile(document.fileName);
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
