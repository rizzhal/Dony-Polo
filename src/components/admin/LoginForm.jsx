'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [f, setF] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    if (res.ok) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setErr((await res.json()).error);
      setBusy(false);
    }
  }
  const cls = 'w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-sun focus:outline-none';
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sun text-ink"><LockKeyhole /></span>
        <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
        <input className={cls} placeholder="Username" autoComplete="username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} required />
        <input className={cls} type="password" placeholder="Password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-sun py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
