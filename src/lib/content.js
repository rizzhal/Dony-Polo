import { promises as fs } from 'fs';
import path from 'path';
import connectDb from './mongodb';
import { Gallery, CbseDocument } from './models';
import { createSignedUrl } from '@/config/supabase';

const seedFile = path.join(process.cwd(), 'data', 'site.json');
let seeded = false;

export async function seedDynamicContent() {
  if (seeded) return;
  await connectDb();
  if (!(await Gallery.exists({})) && !(await CbseDocument.exists({}))) {
    const source = JSON.parse(await fs.readFile(seedFile, 'utf8'));
    await Gallery.insertMany((source.albums || []).map((album) => ({ title: album.title, photos: (album.images || []).map((url) => ({ originalName: path.basename(url), fileName: '', url, mimeType: 'image/jpeg' })) })));
    await CbseDocument.insertMany((source.documents || []).map((doc) => ({ title: doc.title, description: '', originalName: path.basename(doc.url), fileName: '', url: doc.url, mimeType: 'application/pdf' })));
  }
  seeded = true;
}

export async function getGalleries(page = 1, limit = 6, { signStorageUrls = false } = {}) {
  await seedDynamicContent();
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(24, Math.max(1, Number(limit) || 6));
  const [items, total] = await Promise.all([
    Gallery.find().sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    Gallery.countDocuments(),
  ]);
  const galleries = await Promise.all(items.map(async (item) => ({
    ...item,
    _id: String(item._id),
    photos: await Promise.all(item.photos.map(async (photo) => ({
      ...photo,
      _id: String(photo._id),
      url: signStorageUrls && photo.fileName.startsWith('gallery/')
        ? await createSignedUrl(photo.fileName)
        : photo.url,
    }))),
  })));
  return { items: galleries, page: safePage, limit: safeLimit, total, pages: Math.max(1, Math.ceil(total / safeLimit)) };
}

export async function getDocuments() {
  await seedDynamicContent();
  const documents = await CbseDocument.find().sort({ createdAt: -1 }).lean();
  return documents.map((document) => ({ ...document, _id: String(document._id) }));
}
