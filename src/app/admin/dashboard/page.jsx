import Dashboard from '@/components/admin/Dashboard';
import { getDocuments, getGalleries } from '@/lib/content';

export const metadata = { title: 'Admin dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [galleries, documents] = await Promise.all([getGalleries(1, 1000), getDocuments({ signStorageUrls: true })]);
  return <Dashboard initial={{ galleries: galleries.items, documents }} />;
}
