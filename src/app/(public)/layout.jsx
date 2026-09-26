import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { readSite } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  const { school } = await readSite();
  return (
    <>
      <Navbar name={school.name} />
      <main>{children}</main>
      <Footer s={school} />
    </>
  );
}
