import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { IMG } from '@/lib/static';

export default function Footer({ s }) {
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={IMG + 'logo.jpeg'} alt="" className="mb-3 h-12 w-12 rounded-full" />
          <p className="font-display text-xl font-bold text-white">{s.name}</p>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-sun" />{s.address}</li>
          <li className="flex gap-2"><Phone size={16} className="text-sun" /><a href={`tel:${s.phone}`}>{s.phone}</a></li>
          <li className="flex gap-2"><Mail size={16} className="text-sun" /><a href={`mailto:${s.email}`}>{s.email}</a></li>
        </ul>
        <ul className="space-y-2 text-sm">
          {[['/', 'Home'], ['/about', 'About'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([h, l]) => (
            <li key={h}><Link href={h} className="hover:text-sun">{l}</Link></li>
          ))}
        </ul>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} {s.name}. All rights reserved.</p>
    </footer>
  );
}
