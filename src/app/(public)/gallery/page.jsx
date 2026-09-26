import PageHeader from '@/components/public/PageHeader';
import GalleryView from '@/components/public/GalleryView';
import { getGalleries } from '@/lib/content';

export const metadata = { title: 'Gallery' };

export default async function Gallery({ searchParams }) {
  const page = (await searchParams)?.page;
  const galleries = await getGalleries(page, 6, { signStorageUrls: true });
  return (
    <>
      <PageHeader title="Gallery" />
      <div className="mx-auto max-w-6xl px-4 py-16"><GalleryView {...galleries} /></div>
    </>
  );
}
