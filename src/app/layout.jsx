import './globals.css';
import { Bricolage_Grotesque, Public_Sans } from 'next/font/google';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = Public_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: { default: 'Donyi Polo Vidya Niketan, Pasighat', template: '%s | Donyi Polo Vidya Niketan' },
  description: 'CBSE school in Pasighat, East Siang, Arunachal Pradesh, teaching LKG to Class X.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
