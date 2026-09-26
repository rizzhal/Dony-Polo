import path from 'path';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { deleteFromStorage, uploadToStorage } from '@/config/supabase';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'upload');
export const PUBLIC_UPLOAD_PREFIX = '/upload/';

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function safeOriginalName(name) {
  const base = path.basename(name || 'upload');
  return base.replace(/[^a-zA-Z0-9._ -]/g, '_').replace(/\s+/g, ' ').trim() || 'upload';
}

export function storedFileName(name) {
  const safeName = safeOriginalName(name);
  const ext = path.extname(safeName);
  const stem = path.basename(safeName, ext).slice(0, 80) || 'upload';
  return `${stem}-${crypto.randomBytes(6).toString('hex')}${ext.toLowerCase()}`;
}

export async function saveFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('A file is required.');
  const fileName = storedFileName(file.name);
  await ensureUploadDir();
  await fs.writeFile(path.join(UPLOAD_DIR, fileName), Buffer.from(await file.arrayBuffer()));
  return { originalName: safeOriginalName(file.name), fileName, url: `${PUBLIC_UPLOAD_PREFIX}${encodeURIComponent(fileName)}`, mimeType: file.type || 'application/octet-stream' };
}

export async function saveImage(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('An image is required.');
  const fileName = `gallery/${storedFileName(file.name)}`;
  const { url } = await uploadToStorage(fileName, Buffer.from(await file.arrayBuffer()), file.type || 'application/octet-stream');
  return { originalName: safeOriginalName(file.name), fileName, url, mimeType: file.type || 'application/octet-stream' };
}

export async function savePdf(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('A PDF is required.');
  const fileName = `cbse/${storedFileName(file.name)}`;
  const { url } = await uploadToStorage(fileName, Buffer.from(await file.arrayBuffer()), file.type || 'application/pdf');
  return { originalName: safeOriginalName(file.name), fileName, url, mimeType: file.type || 'application/pdf' };
}

export async function deleteFile(fileName) {
  if (!fileName) return;
  try { await fs.unlink(path.join(UPLOAD_DIR, path.basename(fileName))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

export async function deleteDocumentFile(fileName) {
  if (!fileName) return;
  if (fileName.startsWith('cbse/')) return deleteFromStorage(fileName);
  return deleteFile(fileName);
}

export async function deleteImage(fileName) {
  if (!fileName) return;
  if (fileName.startsWith('gallery/')) return deleteFromStorage(fileName);
  return deleteFile(fileName);
}

export function validateImage(file) {
  return file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024;
}

export function validatePdf(file) {
  return file && file.type === 'application/pdf' && file.size <= 25 * 1024 * 1024;
}
