import { useMemo, useState } from 'react';
import { Copy, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hcRequest } from '@/lib/hc-api';
import { LADDER, parseSheet, parsePromos, computeAll, buildMessage, fmtMin } from '../../supabase/functions/_shared/promotions.js';

export default function PromotionsTool({ token }: { token: string }) {
  const [sheet, setSheet] = useState<any>(null);
  const [text, setText] = useState('');
  const [fixes, setFixes] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState({ pby: 'Aaron', date: new Date().toLocaleDateString('en-US'), emoji: '', minOverride: 0, doubleHours: 8, supHours: 15, supIdx: 5 });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const entries = useMemo(() => parsePromos(text), [text]);
  const result = useMemo(() => computeAll(entries, sheet, fixes, settings), [entries, sheet, fixes, settings]);
  const message = buildMessage(result.ready, settings);
  const fix = (key: string, value: object) => { setPlan(null); setFixes(old => ({ ...old, [key]: { ...old[key], ...value } })); };
  async function load() {
    setBusy(true); setError(''); setPlan(null);
    try { const data = await hcRequest({ action: 'load', token }); setSheet(parseSheet(data.values)); setStatus('FIB Main roster loaded.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Roster unavailable.'); }
    finally { setBusy(false); }
  }
  async function preview() {
    setBusy(true); setError('');
    try { const data = await hcRequest({ action: 'preview', token, text, fixes, settings }); setPlan(data.plan); setStatus(`${data.count} promotions checked against the current roster.`); }
    catch (e) { setError(e instanceof Error ? e.message : 'Preview failed.'); }
    finally { setBusy(false); }
  }
  async function apply() {
    if (!plan) return;
    setBusy(true); setError('');
    try { const data = await hcRequest({ action: 'apply', token, plan }); setSheet(parseSheet(data.values)); setText(''); setFixes({}); setStatus(`${data.count} officers promoted and verified on the roster.`); }
    catch (e) { setError(e instanceof Error ? e.message : 'Roster update failed.'); }
    finally { setBusy(false); setPlan(null); }
  }
  return <section className="min-w-0 space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
      <h2 className="text-3xl font-bold">FIB Promotions Tool</h2>
      <Button asChild variant="outline"><a href="https://docs.google.com/spreadsheets/d/1ae01yHUDrjT--aVIZAzsJzWh_6S3A4TlGtmbcpy_fZw/edit" target="_blank" rel="noreferrer"><FileSpreadsheet />Open roster</a></Button>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={load} disabled={busy}><RefreshCw />{busy ? 'Processing…' : sheet ? 'Reload roster' : 'Load roster'}</Button>
      {sheet && <span className="text-sm text-muted-foreground">FIB Main · {sheet.rows.filter((r: any) => r.name || r.id).length} officers · {sheet.vacant.flat().length} vacant slots</span>}
    </div>
    {status && <p role="status" className="text-sm text-primary">{status}</p>}
    {error && <p role="alert" className="break-words border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
    <details className="border-y py-4"><summary className="cursor-pointer font-semibold">Promotion settings</summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(['pby', 'date', 'emoji'] as const).map((key, i) => <label key={key} className="space-y-2 text-sm">{['Promoted by', 'Promotion date', 'Title emoji'][i]}<Input value={settings[key]} disabled={busy} onChange={e => { setPlan(null); setSettings(s => ({ ...s, [key]: e.target.value })); }} /></label>)}
        {(['minOverride', 'doubleHours', 'supHours'] as const).map((key, i) => <label key={key} className="space-y-2 text-sm">{['Single minimum hours (0 = bot requirement)', 'Double promotion hours', 'Supervisor double hours'][i]}<Input type="number" min="0" max="1000" step="0.25" value={settings[key]} disabled={busy} onChange={e => { setPlan(null); setSettings(s => ({ ...s, [key]: Number(e.target.value) })); }} /></label>)}
        <label className="space-y-2 text-sm">Supervisor rule starts at<select className="h-10 w-full rounded-md border bg-background px-3" value={settings.supIdx} disabled={busy} onChange={e => { setPlan(null); setSettings(s => ({ ...s, supIdx: Number(e.target.value) })); }}>{LADDER.map((r: any, i: number) => <option key={r.name} value={i}>{r.name}</option>)}</select></label>
      </div>
    </details>
    <div className="space-y-3"><label htmlFor="promotion-list" className="font-semibold">/promotions list</label>
      <Textarea id="promotion-list" className="min-h-48 font-mono text-sm" placeholder="1. @2S-63 | Oscar – 28h 7m / 4h 0m (100%)" value={text} disabled={busy} onChange={e => { setText(e.target.value); setFixes({}); setPlan(null); }} />
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{entries.length} officers found</span><Button variant="ghost" disabled={busy} onClick={() => { setText(''); setFixes({}); setPlan(null); }}>Clear</Button></div>
    </div>
    <Tabs defaultValue="ready"><TabsList><TabsTrigger value="ready">Ready ({result.ready.length})</TabsTrigger><TabsTrigger value="errors">Errors ({result.errors.length})</TabsTrigger><TabsTrigger value="left">Left out ({result.left.length})</TabsTrigger></TabsList>
      <TabsContent value="ready" className="space-y-5">
        {!result.ready.length ? <p className="py-6 text-muted-foreground">No promotions ready.</p> : <>
          <div className="overflow-x-auto rounded-md border"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-muted"><tr>{['Officer', 'Hours', 'Rank', 'Callsign', 'Type', ''].map((h, i) => <th key={i} className="p-3">{h}</th>)}</tr></thead><tbody>
            {result.ready.map((it: any) => <tr key={it.e.key} className="border-t"><td className="p-3 font-semibold">{it.row.name}</td><td className="p-3 whitespace-nowrap">{fmtMin(it.e.played)}</td><td className="p-3">{LADDER[it.idx].name} → <strong>{LADDER[it.t].name}</strong></td><td className="p-3 whitespace-nowrap">{it.row.cs} → {it.slot.cs}</td><td className="p-3"><select aria-label={`Promotion type for ${it.e.name}`} className="rounded border bg-background p-2" value={it.action} disabled={busy || it.idx < 2} onChange={e => fix(it.e.key, { action: e.target.value })}><option value="single">Single</option><option value="double">Double</option></select></td><td className="p-3"><Button variant="ghost" size="sm" disabled={busy} onClick={() => fix(it.e.key, { skip: true })}>Leave out</Button></td></tr>)}
          </tbody></table></div>
          <label className="block space-y-2 font-semibold">Promotion message<Textarea value={message} readOnly className="min-h-64 font-mono text-sm" /></label>
          <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(message); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the promotion message.'); } }}><Copy />{copied ? 'Copied' : 'Copy message'}</Button><Button disabled={busy || !settings.pby.trim() || !settings.date.trim()} onClick={preview}>Review roster update</Button></div>
          {plan && <div className="space-y-4 rounded-md border border-primary p-4"><p>Confirm {result.ready.length} promotions? New slots will be filled and old slots marked vacant.</p><div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={apply}>Confirm and update roster</Button><Button variant="outline" disabled={busy} onClick={() => setPlan(null)}>Cancel</Button></div></div>}
        </>}
      </TabsContent>
      <TabsContent value="errors" className="space-y-3">{!result.errors.length && <p className="py-6 text-muted-foreground">No matching errors.</p>}{result.errors.map((it: any) => <div key={it.e.key} className="space-y-3 rounded-md border p-4"><strong>{it.e.name} · {it.e.callsign}</strong><p className="text-sm text-destructive">{it.reason}</p><div className="flex flex-wrap items-center gap-3">{it.needId ? <Input aria-label={`Discord ID for ${it.e.name}`} className="max-w-xs" placeholder="Discord ID" disabled={busy} onChange={e => { if (/^\d{15,20}$/.test(e.target.value)) fix(it.e.key, { manualId: e.target.value }); }} /> : sheet && <select aria-label={`Match ${it.e.name}`} className="max-w-full rounded border bg-background p-2" disabled={busy} value="" onChange={e => fix(it.e.key, { rowNum: Number(e.target.value) })}><option value="">Select roster officer</option>{sheet.rows.filter((r: any) => r.name).map((r: any) => <option key={r.row} value={r.row}>{r.cs} · {r.name} · {r.rank}</option>)}</select>}<Button variant="outline" disabled={busy} onClick={() => fix(it.e.key, { skip: true })}>Leave out</Button></div></div>)}</TabsContent>
      <TabsContent value="left">{!result.left.length && <p className="py-6 text-muted-foreground">No officers left out.</p>}{result.left.map((it: any) => <div key={it.e.key} className="flex flex-wrap items-center justify-between gap-3 border-b py-4"><div><strong>{it.e.name}</strong><p className="text-sm text-muted-foreground">{it.reason}</p></div>{it.manual && <Button variant="outline" disabled={busy} onClick={() => fix(it.e.key, { skip: false })}>Put back</Button>}</div>)}</TabsContent>
    </Tabs>
  </section>;
}