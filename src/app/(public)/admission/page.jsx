import { FileDown } from 'lucide-react';
import PageHeader from '@/components/public/PageHeader';
import { readSite } from '@/lib/db';

export const metadata = { title: 'Admission' };

const steps = [
  ['Application form', 'Collect the form from the school and fill in all details.'],
  ['Submit documents', 'Return the form with the required documents and application fee.'],
  ['Assessment', 'Attend the entrance test and interview on the scheduled date.'],
  ['Confirmation', 'Receive your admission confirmation and complete enrolment.'],
];
const docs = [
  ['New admissions', ['Birth certificate', 'Aadhaar card (student)', 'Recent passport-size photographs', 'Previous year’s marksheet', 'Caste certificate (if applicable)']],
  ['Transfer students', ['Transfer certificate', 'Previous school report card', 'Character certificate', 'Migration certificate (for CBSE)', 'All documents required for new admissions']],
];
const classes = [['Pre-primary', 'LKG to UKG'], ['Primary', 'Class I to V'], ['Middle', 'Class VI to VIII'], ['Secondary', 'Class IX to X']];

export default async function Admission() {
  const { school } = await readSite();
  return (
    <>
      <PageHeader title="Admission" />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16">
        <section>
          <h2 className="font-display text-3xl font-bold">How to apply</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map(([t, p], i) => (
              <li key={t} className="rounded-2xl bg-mist p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun font-bold">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-ink/70">{p}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="grid gap-8 md:grid-cols-2">
          {docs.map(([t, items]) => (
            <div key={t}>
              <h2 className="font-display text-2xl font-bold">Documents for {t.toLowerCase()}</h2>
              <ul className="mt-4 space-y-2 text-ink/80">{items.map((x) => <li key={x} className="border-b border-ink/10 pb-2">{x}</li>)}</ul>
            </div>
          ))}
        </section>
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink p-8 text-white">
          <h2 className="font-display text-2xl font-bold">Fee structure, 2025-26</h2>
          <a href={school.feeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 font-semibold text-ink transition hover:brightness-110"><FileDown size={18} />Download fee PDF</a>
        </section>
        <section>
          <h2 className="font-display text-3xl font-bold">Classes offered</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map(([t, c]) => (
              <div key={t} className="rounded-2xl border-2 border-mist p-6 transition hover:border-sun"><p className="font-display text-xl font-bold">{t}</p><p className="text-ink/70">{c}</p></div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
