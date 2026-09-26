'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, FileText, ImagePlus, LogOut, Plus, Save, Trash2, Upload } from 'lucide-react';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-river focus:outline-none focus:ring-2 focus:ring-sun/60';

function FilePicker({ accept, multiple, onChange }) {
  return <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-3 py-3 text-sm font-medium hover:border-river">
    <Upload size={16} /> Choose {multiple ? 'up to 4 images' : 'PDF'}
    <input type="file" className="sr-only" accept={accept} multiple={multiple} onChange={(event) => onChange(multiple ? [...event.target.files] : event.target.files[0])} />
  </label>;
}

function Notice({ status }) { return status && <p role="status" className={`text-sm ${status.error ? 'text-red-600' : 'text-river'}`}>{status.message}</p>; }

export default function Dashboard({ initial }) {
  const router = useRouter();
  const [tab, setTab] = useState('gallery');
  const [galleries, setGalleries] = useState(initial.galleries);
  const [documents, setDocuments] = useState(initial.documents);
  const [event, setEvent] = useState({ title: '', files: [] });
  const [document, setDocument] = useState({ title: '', description: '', file: null });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [status, setStatus] = useState(null);

  function message(message, error = false) { setStatus({ message, error }); }
  async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 401) { router.push('/admin/login'); return null; }
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Request failed.');
    return body;
  }
  async function createEvent(eventObject) {
    const form = new FormData();
    form.append('title', eventObject.title);
    eventObject.files.forEach((file) => form.append('photos', file));
    return request('/api/gallery', { method: 'POST', body: form });
  }
  async function saveEvent() {
    try {
      if (!event.title.trim() || !event.files.length) throw new Error('Add an event title and at least one image.');
      if (event.files.length > 4) throw new Error('Choose a maximum of 4 images at a time.');
      message('Uploading gallery event...');
      const saved = await createEvent(event);
      if (saved) { setGalleries((items) => [saved, ...items]); setEvent({ title: '', files: [] }); message('Gallery event created.'); }
    } catch (error) { message(error.message, true); }
  }
  async function updateEvent(item) {
    try {
      const form = new FormData();
      form.append('title', item.title);
      item.files.forEach((file) => form.append('photos', file));
      item.removeIds.forEach((id) => form.append('removePhotoIds', id));
      message('Saving gallery event...');
      const saved = await request(`/api/gallery/${item._id}`, { method: 'PUT', body: form });
      if (saved) { setGalleries((items) => items.map((current) => current._id === saved._id ? saved : current)); setEditingEvent(null); message('Gallery event updated.'); }
    } catch (error) { message(error.message, true); }
  }
  async function deleteEvent(id) {
    if (!window.confirm('Delete this event and all its images?')) return;
    try { await request(`/api/gallery/${id}`, { method: 'DELETE' }); setGalleries((items) => items.filter((item) => item._id !== id)); message('Gallery event deleted.'); }
    catch (error) { message(error.message, true); }
  }
  async function saveDocument() {
    try {
      if (!document.title.trim() || !document.description.trim() || !document.file) throw new Error('Add a title, description, and PDF.');
      message('Uploading CBSE document...');
      const form = new FormData(); form.append('title', document.title); form.append('description', document.description); form.append('file', document.file);
      const saved = await request('/api/cbse', { method: 'POST', body: form });
      if (saved) { setDocuments((items) => [saved, ...items]); setDocument({ title: '', description: '', file: null }); message('CBSE document created.'); }
    } catch (error) { message(error.message, true); }
  }
  async function updateDocument(item) {
    try {
      const form = new FormData(); form.append('title', item.title); form.append('description', item.description); if (item.file) form.append('file', item.file);
      message('Saving CBSE document...');
      const saved = await request(`/api/cbse/${item._id}`, { method: 'PUT', body: form });
      if (saved) { setDocuments((items) => items.map((current) => current._id === saved._id ? saved : current)); setEditingDocument(null); message('CBSE document updated.'); }
    } catch (error) { message(error.message, true); }
  }
  async function deleteDocument(id) {
    if (!window.confirm('Delete this document and its PDF?')) return;
    try { await request(`/api/cbse/${id}`, { method: 'DELETE' }); setDocuments((items) => items.filter((item) => item._id !== id)); message('CBSE document deleted.'); }
    catch (error) { message(error.message, true); }
  }
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh(); }

  return <div className="min-h-screen bg-slate-50">
    <header className="flex items-center justify-between bg-ink px-4 py-3 text-white">
      <h1 className="font-display text-lg font-bold">Content dashboard</h1>
      <div className="flex items-center gap-4 text-sm"><a href="/" target="_blank" className="inline-flex items-center gap-1 hover:text-sun"><ExternalLink size={14} />View site</a><button onClick={logout} className="inline-flex items-center gap-1 hover:text-sun"><LogOut size={14} />Sign out</button></div>
    </header>
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="flex flex-wrap gap-2"><button onClick={() => setTab('gallery')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'gallery' ? 'bg-ink text-white' : 'bg-white'}`}><ImagePlus className="mr-2 inline" size={16} />Gallery</button><button onClick={() => setTab('documents')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'documents' ? 'bg-ink text-white' : 'bg-white'}`}><FileText className="mr-2 inline" size={16} />CBSE information</button></div>
      <Notice status={status} />
      {tab === 'gallery' ? <section className="space-y-5">
        <div className="rounded-xl border bg-white p-5"><h2 className="mb-4 font-display text-xl font-bold">Create gallery event</h2><div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">Event title</span><input className={inputClass} value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} placeholder="Annual sports day" /></label><div><span className="mb-1 block text-xs font-medium text-slate-600">Photos</span><FilePicker accept="image/*" multiple onChange={(files) => setEvent({ ...event, files })} />{event.files.length > 0 && <p className="mt-1 text-xs text-slate-500">{event.files.length} selected</p>}</div><button onClick={saveEvent} className="inline-flex items-center justify-center gap-2 rounded-lg bg-sun px-4 py-2 font-semibold text-ink"><Plus size={16} />Create</button></div></div>
        {galleries.map((item) => <div key={item._id} className="rounded-xl border bg-white p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-lg font-bold">{item.title}</h3><p className="text-sm text-slate-500">{item.photos.length} photo{item.photos.length === 1 ? '' : 's'}</p></div><div className="flex gap-3"><button onClick={() => setEditingEvent({ ...item, files: [], removeIds: [] })} className="text-sm font-semibold text-river">Edit</button><button onClick={() => deleteEvent(item._id)} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600"><Trash2 size={14} />Delete</button></div></div>{editingEvent?._id === item._id && <div className="mt-4 space-y-3 border-t pt-4"><input className={inputClass} value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} /><div className="grid gap-3 sm:grid-cols-2">{editingEvent.photos.map((photo) => <label key={photo._id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingEvent.removeIds.includes(photo._id)} onChange={(e) => setEditingEvent({ ...editingEvent, removeIds: e.target.checked ? [...editingEvent.removeIds, photo._id] : editingEvent.removeIds.filter((id) => id !== photo._id) })} />Remove <span className="truncate">{photo.originalName}</span></label>)}</div><FilePicker accept="image/*" multiple onChange={(files) => setEditingEvent({ ...editingEvent, files })} /><div className="flex gap-3"><button onClick={() => updateEvent(editingEvent)} className="inline-flex items-center gap-2 rounded-lg bg-sun px-4 py-2 text-sm font-semibold"><Save size={15} />Save</button><button onClick={() => setEditingEvent(null)} className="text-sm">Cancel</button></div></div>}</div>)}
      </section> : <section className="space-y-5">
        <div className="rounded-xl border bg-white p-5"><h2 className="mb-4 font-display text-xl font-bold">Upload CBSE information</h2><div className="grid gap-3 md:grid-cols-2"><input className={inputClass} value={document.title} onChange={(e) => setDocument({ ...document, title: e.target.value })} placeholder="Document title" /><input className={inputClass} value={document.description} onChange={(e) => setDocument({ ...document, description: e.target.value })} placeholder="Description" /></div><div className="mt-3 flex flex-wrap items-center gap-3"><FilePicker accept="application/pdf,.pdf" onChange={(file) => setDocument({ ...document, file })} /><span className="text-sm text-slate-500">{document.file?.name || 'No PDF selected'}</span><button onClick={saveDocument} className="inline-flex items-center gap-2 rounded-lg bg-sun px-4 py-2 font-semibold text-ink"><Plus size={16} />Add document</button></div></div>
        {documents.map((item) => <div key={item._id} className="rounded-xl border bg-white p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-lg font-bold">{item.title}</h3><p className="text-sm text-slate-600">{item.description}</p><a href={item.url} target="_blank" className="mt-1 block truncate text-xs text-river">{item.originalName}</a></div><div className="flex gap-3"><button onClick={() => setEditingDocument({ ...item, file: null })} className="text-sm font-semibold text-river">Edit</button><button onClick={() => deleteDocument(item._id)} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600"><Trash2 size={14} />Delete</button></div></div>{editingDocument?._id === item._id && <div className="mt-4 space-y-3 border-t pt-4"><input className={inputClass} value={editingDocument.title} onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })} /><textarea className={inputClass} rows="3" value={editingDocument.description} onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })} /><FilePicker accept="application/pdf,.pdf" onChange={(file) => setEditingDocument({ ...editingDocument, file })} /><div className="flex gap-3"><button onClick={() => updateDocument(editingDocument)} className="inline-flex items-center gap-2 rounded-lg bg-sun px-4 py-2 text-sm font-semibold"><Save size={15} />Save</button><button onClick={() => setEditingDocument(null)} className="text-sm">Cancel</button></div></div>}</div>)}
      </section>}
    </main>
  </div>;
}
