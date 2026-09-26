export default function PageHeader({ title }) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-sun/30" />
      <div className="relative mx-auto max-w-6xl px-4">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
