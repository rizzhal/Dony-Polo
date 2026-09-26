'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { IMG } from '@/lib/static';

const links = [['/', 'Home'], ['/about', 'About'], ['/admission', 'Admission'], ['/facilities', 'Facilities'], ['/gallery', 'Gallery'], ['/cbse-information', 'CBSE Information'], ['/contact', 'Contact']];

export default function Navbar({ name }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src={IMG + 'logo.jpeg'} alt="" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-lg font-bold">{name}</span>
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 border-b bg-white p-4 md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${path === href ? 'bg-sun text-ink' : 'text-ink/70 hover:bg-mist hover:text-ink'}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
