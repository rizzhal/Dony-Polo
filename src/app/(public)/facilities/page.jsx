import PageHeader from '@/components/public/PageHeader';
import PhotoGrid from '@/components/public/PhotoGrid';
import { IMG, pics } from '@/lib/static';

export const metadata = { title: 'Facilities' };

const items = [
  ['Science laboratory', pics('science_lab', [3, 4, 7, 5, 6])],
  ['Computer laboratory', pics('computer_lab', [1])],
  ['School library', [IMG + 'library.jpeg']],
  ['Playground', pics('playground', [1, 2, 3])],
  ['Indoor sport', pics('Indoor_sport', [1, 2, 3, 4])],
  ['Girls’ hostel (under construction)', pics('girl_hostel', [1])],
];

export default function Facilities() {
  return (
    <>
      <PageHeader title="Facilities" />
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-16">
        {items.map(([t, imgs]) => (
          <section key={t}>
            <h2 className="mb-4 font-display text-2xl font-bold">{t}</h2>
            <PhotoGrid images={imgs} cols="sm:grid-cols-3" />
          </section>
        ))}
      </div>
    </>
  );
}
