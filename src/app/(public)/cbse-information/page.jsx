import { FileText } from 'lucide-react';
import PageHeader from '@/components/public/PageHeader';
import { getDocuments } from '@/lib/content';

export const metadata = { title: 'CBSE information' };

export default async function Cbse() {
  const documents = await getDocuments({ signStorageUrls: true });
  return (
    <>
      <PageHeader title="CBSE information" />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {documents.map((d) => (
          <a key={d._id} href={d.url} target="_blank" rel="noreferrer" className="group rounded-2xl bg-mist p-6 transition hover:bg-ink hover:text-white">
            <FileText className="text-river transition group-hover:text-sun" />
            <p className="mt-4 font-display text-lg font-bold">{d.title}</p>
            <p className="mt-2 text-sm opacity-70">{d.description || 'Open PDF'}</p>
            <p className="mt-3 truncate text-xs opacity-60">{d.originalName}</p>
          </a>
        ))}
      </div>
    </>
  );
}
