import { MapPin, Phone, Mail } from 'lucide-react';
import PageHeader from '@/components/public/PageHeader';
import { readSite } from '@/lib/db';

export const metadata = { title: 'Contact' };

export default async function Contact() {
  const { school: s } = await readSite();
  const rows = [[MapPin, 'Address', s.address, null], [Phone, 'Phone', s.phone, `tel:${s.phone}`], [Mail, 'Email', s.email, `mailto:${s.email}`]];
  return (
    <>
      <PageHeader title="Contact us" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[20rem_1fr]">
        <ul className="space-y-6">
          {rows.map(([Icon, t, v, href]) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun"><Icon size={20} /></span>
              <div><p className="font-display font-bold">{t}</p>{href ? <a href={href} className="text-ink/80 hover:text-river">{v}</a> : <p className="text-ink/80">{v}</p>}</div>
            </li>
          ))}
        </ul>
        <iframe title="School location" loading="lazy" className="h-96 w-full rounded-3xl border-0" src="https://www.google.com/maps?q=Donyi+Polo+Vidya+Niketan+Pasighat&output=embed" />
      </div>
    </>
  );
}
