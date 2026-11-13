import { useState } from 'react';
import { Lock, LogOut } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PromotionsTool from '@/components/PromotionsTool';
import { hcRequest } from '@/lib/hc-api';

export default function HighCommandInfo() {
  const [token, setToken] = useState(() => sessionStorage.getItem('fib-hc-session') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function unlock(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try { const data = await hcRequest({ action: 'unlock', password }); sessionStorage.setItem('fib-hc-session', data.token); setToken(data.token); setPassword(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Access denied.'); setPassword(''); }
    finally { setBusy(false); }
  }
  return <Layout>{token ? <div className="container mx-auto max-w-6xl px-4 py-10"><header className="mb-10 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-primary">FEDERAL INVESTIGATION BUREAU</p><h1 className="mt-2 text-4xl font-bold">High Command Info</h1></div><Button variant="outline" onClick={() => { sessionStorage.removeItem('fib-hc-session'); setToken(''); }}><LogOut />Lock page</Button></header><PromotionsTool token={token} /></div> : <div className="flex min-h-[70vh] items-center justify-center px-4"><form onSubmit={unlock} className="w-full max-w-sm rounded-lg border border-gold bg-card p-6 text-center"><Lock className="mx-auto h-10 w-10 text-primary" /><h1 className="mt-3 text-2xl font-bold">High Command Info</h1><p className="mt-2 text-sm text-muted-foreground">RESTRICTED · HIGH COMMAND ONLY</p><Input className="mt-5" aria-label="Access code" type="password" autoComplete="current-password" placeholder="Access code" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required disabled={busy} />{error && <p role="alert" className="mt-3 text-sm font-bold text-destructive">{error}</p>}<Button className="mt-4 w-full" disabled={busy} type="submit">{busy ? 'Verifying…' : 'Unlock'}</Button></form></div>}</Layout>;
}