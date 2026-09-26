import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import connectDb from '@/lib/mongodb';
import { Gallery } from '@/lib/models';
import { getGalleries, seedDynamicContent } from '@/lib/content';
import { deleteImage, saveImage, validateImage } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await getGalleries(searchParams.get('page'), searchParams.get('limit'), { signStorageUrls: true }));
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const saved = [];
  try {
    await connectDb();
    await seedDynamicContent();
    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    const files = form.getAll('photos').filter((file) => file && file.size > 0);
    if (!title) return NextResponse.json({ error: 'Event title is required.' }, { status: 400 });
    if (!files.length || files.length > 4) return NextResponse.json({ error: 'Upload between 1 and 4 images at a time.' }, { status: 400 });
    if (files.some((file) => !validateImage(file))) return NextResponse.json({ error: 'Only images up to 10 MB are allowed.' }, { status: 400 });
    for (const file of files) saved.push(await saveImage(file));
    const event = await Gallery.create({ title, photos: saved });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    await Promise.all(saved.map((file) => deleteImage(file.fileName)));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
