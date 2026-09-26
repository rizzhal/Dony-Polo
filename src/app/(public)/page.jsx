import Link from 'next/link';
import { GraduationCap, HeartHandshake, BookOpen, Award, ShieldCheck, CalendarCheck, School, Palette, Trophy } from 'lucide-react';
import Counter from '@/components/public/Counter';
import { readSite } from '@/lib/db';
import { IMG, pics } from '@/lib/static';

const highlights = [
  [GraduationCap, 'Certified teachers', 'Qualified, dedicated faculty committed to academic excellence.'],
  [HeartHandshake, 'Special education', 'Specialised support so every learner can grow.'],
  [BookOpen, 'Books and library', 'A well-equipped library that feeds curiosity.'],
  [Award, 'Certification', 'Recognised certificates that validate achievement.'],
];
const offers = [[ShieldCheck, 'Safety first'], [CalendarCheck, 'Regular classes'], [GraduationCap, 'Certified teachers'], [School, 'Sufficient classrooms'], [Palette, 'Creative lessons'], [Trophy, 'Sports facilities']];
const wrap = 'mx-auto max-w-6xl px-4 py-16';

export default async function Home() {
  const d = await readSite();
  return (
    <>
      <section className="overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">Students are the best explorers in the world</h1>
            <p className="mt-5 max-w-md text-lg text-white/75">A CBSE school in Pasighat teaching LKG to Class X, rooted in the culture of Arunachal Pradesh.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admission" className="rounded-full bg-sun px-6 py-3 font-semibold text-ink transition hover:brightness-110">Apply for admission</Link>
              <Link href="/gallery" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">See school life</Link>
            </div>
          </div>
          <div className="relative mx-auto h-72 w-72 md:h-[26rem] md:w-[26rem]">
            <img src={IMG + 'school_gate.jpeg'} alt="School gate" className="h-full w-full rounded-full border-8 border-sun object-cover" />
            <div className="orbit absolute -inset-6">
              <span className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-mist shadow-[inset_-10px_-4px_0_0_#b9c7c2]" />
            </div>
          </div>
        </div>
      </section>

      {d.notices.length > 0 && (
        <section className="bg-sun">
          <div className="mx-auto flex max-w-6xl gap-8 overflow-x-auto px-4 py-3 text-sm font-medium">
            {d.notices.map((n, i) => {
              const t = <>{n.date && <b>{n.date}: </b>}{n.title}</>;
              return n.link ? <a key={i} href={n.link} className="whitespace-nowrap underline-offset-4 hover:underline">{t}</a> : <span key={i} className="whitespace-nowrap">{t}</span>;
            })}
          </div>
        </section>
      )}

      <section className={`${wrap} grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
        {highlights.map(([Icon, t, p]) => (
          <div key={t}>
            <Icon className="text-river" size={32} />
            <h3 className="mt-3 font-display text-lg font-bold">{t}</h3>
            <p className="mt-1 text-sm text-ink/70">{p}</p>
          </div>
        ))}
      </section>

      <section className={`${wrap} grid items-center gap-10 pt-0 md:grid-cols-2`}>
        <img src={IMG + 'school_gate.jpeg'} alt="" className="rounded-3xl object-cover" />
        <div>
          <h2 className="font-display text-3xl font-bold">Welcome to {d.school.name}</h2>
          <p className="mt-4 leading-relaxed text-ink/80">{d.school.welcome}</p>
          <Link href="/about" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-river">Read our story</Link>
        </div>
      </section>

      <section className="bg-mist">
        <div className={wrap}>
          <h2 className="font-display text-3xl font-bold">What we offer</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map(([Icon, t]) => (
              <div key={t} className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition hover:-translate-y-1 hover:bg-ink hover:text-white">
                <Icon className="text-river transition group-hover:text-sun" />
                <span className="font-semibold">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${wrap} grid items-center gap-10 md:grid-cols-[1fr_16rem]`}>
        <div>
          <h2 className="font-display text-3xl font-bold">Principal’s message</h2>
          <div className="mt-5 space-y-4 border-l-4 border-sun pl-5 leading-relaxed text-ink/80">
            {d.principal.message.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <img src={d.principal.image} alt="Principal" className="aspect-[3/4] w-full rounded-3xl object-cover" />
      </section>

      {d.achievers.length > 0 && (
        <section className="bg-mist">
          <div className={wrap}>
            <h2 className="font-display text-3xl font-bold">Our pride</h2>
            <p className="mt-2 text-ink/70">{d.school.pride}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {d.achievers.map((a, i) => (
                <div key={i} className="rounded-2xl bg-ink p-6 text-white">
                  <p className="font-display text-2xl font-bold text-sun">{a.rank}</p>
                  <p className="mt-4 text-lg font-semibold">{a.name}</p>
                  <p className="text-sm text-white/70">{a.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${wrap} grid gap-10 md:grid-cols-2`}>
        <div><h2 className="font-display text-3xl font-bold">Our vision</h2><p className="mt-4 leading-relaxed text-ink/80">To be a premier institution that nurtures responsible global citizens while preserving the cultural heritage of Arunachal Pradesh, and to raise leaders who are academically excellent, morally upright and socially conscious.</p></div>
        <div><h2 className="font-display text-3xl font-bold">Our mission</h2><p className="mt-4 leading-relaxed text-ink/80">To cultivate excellence in five dimensions of education (intellectual, moral, cultural, physical and social) through critical thinking, ethical values, cultural awareness, wellbeing and social responsibility.</p></div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-4">
          {d.stats.map((s) => <Counter key={s.label} {...s} />)}
        </div>
      </section>

      <section className={wrap}>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Life at school</h2>
          <Link href="/gallery" className="font-semibold text-river hover:underline">Full gallery</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...pics('home_gallery', [1, 2, 3]), ...pics('science_exhibition', [5])].map((s) => (
            <img key={s} src={s} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
          ))}
        </div>
      </section>
    </>
  );
}
