import PageHeader from '@/components/public/PageHeader';
import { IMG } from '@/lib/static';

export const metadata = { title: 'About' };

const timeline = [
  ['1996', 'Inaugurated on 15 July by the Deputy Commissioner of East Siang as the 6th school of Arunachal Shiksha Vikas Samiti, starting as a lower primary school.'],
  ['2004', 'Elevated to upper primary level.'],
  ['2018', 'Upgraded to secondary level.'],
  ['Today', 'Teaching LKG to Class X, with plans to add higher secondary.'],
];
const core = ['Physical Education', 'Yoga Education', 'Sanskrit Education', 'Sangeet Education', 'Moral & Spiritual Education'];

export default function About() {
  return (
    <>
      <PageHeader title="About us" />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-4 leading-relaxed text-ink/80">
            <p>The school was a long-felt need of the elders and villagers of Pasighat. It was realised with the blessings of the founding leaders of Vidya Bharati and the pioneering efforts of Lt. Talom Rukbo, Shri Ojing Rukbo, Shri Ravi Kant Chanakya, Shri Tobuk Dai, Lt. B.N Sharma, Lt. Surendra Tiwari and many others.</p>
            <p>It has always aimed to give qualitative, nationalistic education based on Bharatiya culture and ideals, with special emphasis on indigenous faith, culture and traditions.</p>
          </div>
          <img src={IMG + 'school_gate.jpeg'} alt="School gate" className="rounded-3xl" />
        </section>

        <section>
          <h2 className="font-display text-3xl font-bold">How we grew</h2>
          <ol className="mt-8 space-y-6 border-l-2 border-sun pl-6">
            {timeline.map(([y, t]) => (
              <li key={y}><p className="font-display text-xl font-bold text-river">{y}</p><p className="max-w-2xl text-ink/80">{t}</p></li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl bg-mist p-8">
          <h2 className="font-display text-3xl font-bold">Curriculum and core subjects</h2>
          <p className="mt-3 max-w-2xl text-ink/80">We follow the CBSE syllabus with NCERT textbooks, with sufficient buildings for classes and a hostel. Five core subjects run alongside:</p>
          <div className="mt-5 flex flex-wrap gap-2">{core.map((c) => <span key={c} className="rounded-full bg-white px-4 py-2 text-sm font-medium">{c}</span>)}</div>
        </section>

        <section>
          <h2 className="font-display text-3xl font-bold">Parents are partners</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">As a school run by Vidya Bharati, we give priority to the participation of parents and guardians. We hold regular parent and mother meetings to share each child’s progress, and Matri Bharati, a committee of mothers, takes part in the school’s development activities.</p>
        </section>
      </div>
    </>
  );
}
