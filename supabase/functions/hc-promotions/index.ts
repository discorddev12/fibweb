import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { parseSheet, parsePromos, computeAll, colLetter } from '../_shared/promotions.js';

const rosterId = '1ae01yHUDrjT--aVIZAzsJzWh_6S3A4TlGtmbcpy_fZw';
const tab = 'FIB Main';
const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
const settingsSchema = z.object({ pby: z.string().min(1).max(100), date: z.string().min(1).max(30), emoji: z.string().max(40), minOverride: z.number().min(0).max(1000), doubleHours: z.number().min(0).max(1000), supHours: z.number().min(0).max(1000), supIdx: z.number().int().min(0).max(11) });
const fixesSchema = z.record(z.object({ skip: z.boolean().optional(), rowNum: z.number().int().positive().optional(), action: z.enum(['single', 'double']).optional(), manualId: z.string().regex(/^\d{15,20}$/).optional() }));
const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('unlock'), password: z.string().max(200) }),
  z.object({ action: z.literal('load'), token: z.string().max(2000) }),
  z.object({ action: z.literal('preview'), token: z.string().max(2000), text: z.string().max(100000), fixes: fixesSchema, settings: settingsSchema }),
  z.object({ action: z.literal('apply'), token: z.string().max(2000), plan: z.string().max(300000) }),
]);
const encode = (v: string) => btoa(unescape(encodeURIComponent(v))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const decode = (v: string) => decodeURIComponent(escape(atob(v.replace(/-/g, '+').replace(/_/g, '/'))));
async function key() {
  const secret = Deno.env.get('HC_SESSION_SECRET');
  if (!secret) throw new Error('High Command access is not configured.');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function sign(payload: object) {
  const data = encode(JSON.stringify(payload));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await key(), new TextEncoder().encode(data)));
  return data + '.' + encode(String.fromCharCode(...sig));
}
async function verify(value: string, kind: string) {
  const [data, signature] = value.split('.');
  if (!data || !signature) throw new Error('Access expired. Unlock High Command Info again.');
  const bytes = Uint8Array.from(decode(signature), c => c.charCodeAt(0));
  if (!await crypto.subtle.verify('HMAC', await key(), bytes, new TextEncoder().encode(data))) throw new Error('Invalid access credentials.');
  const payload = JSON.parse(decode(data));
  if (payload.kind !== kind || payload.exp < Date.now()) throw new Error('Access expired. Unlock High Command Info again.');
  return payload;
}
async function sheets(path: string, body?: object) {
  const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey || !lovableKey) throw new Error('Google Sheets connection is not configured.');
  const response = await fetch(`https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${rosterId}${path}`, {
    method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': apiKey, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const details = await response.text();
    console.error(`Sheets [${response.status}]: ${details}`);
    throw new Error(`Google Sheets [${response.status}]: ${details}`);
  }
  return response.json();
}
async function load() { const data = await sheets(`/values/'${tab}'!A1:L503`); return data.values || []; }
function snapshot(item: any) { return { row: item.row, rank: item.rank, name: item.name, id: item.id, cs: item.cs, join: item.join, pby: item.pby, pdate: item.pdate, status: item.status }; }

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers, status: 405 });
    const input = requestSchema.parse(await req.json());
    if (input.action === 'unlock') {
      const password = Deno.env.get('HC_ACCESS_PASSWORD');
      if (!password || input.password !== password) return new Response(JSON.stringify({ error: 'PERMISSION NOT GRANTED' }), { headers, status: 401 });
      return new Response(JSON.stringify({ token: await sign({ kind: 'session', exp: Date.now() + 4 * 60 * 60 * 1000 }) }), { headers });
    }
    await verify(input.token, 'session');
    if (input.action === 'load') return new Response(JSON.stringify({ values: await load(), tab }), { headers });
    if (input.action === 'preview') {
      const sheet = parseSheet(await load());
      const result = computeAll(parsePromos(input.text), sheet, input.fixes, input.settings);
      if (!result.ready.length) throw new Error('No promotions are ready. Reload the roster and review the list.');
      const items = result.ready.map((it: any) => ({ from: snapshot(it.row), to: snapshot(it.slot), id: it.id }));
      return new Response(JSON.stringify({ count: items.length, plan: await sign({ kind: 'plan', exp: Date.now() + 5 * 60 * 1000, items, settings: input.settings }) }), { headers });
    }
    const plan = await verify(input.plan, 'plan');
    const fresh = parseSheet(await load());
    const used = new Set();
    for (const item of plan.items) {
      if (JSON.stringify(snapshot(fresh.byRow.get(item.from.row) || {})) !== JSON.stringify(item.from) || JSON.stringify(snapshot(fresh.byRow.get(item.to.row) || {})) !== JSON.stringify(item.to) || used.has(item.from.row) || used.has(item.to.row)) throw new Error('The roster changed. Nothing was written. Reload the roster and review again.');
      used.add(item.from.row); used.add(item.to.row);
    }
    const data = [];
    for (const item of plan.items) {
      for (const [column, value] of [[fresh.cols.name, item.from.name], [fresh.cols.id, item.id], [fresh.cols.join, item.from.join], [fresh.cols.pby, plan.settings.pby], [fresh.cols.pdate, plan.settings.date], [fresh.cols.status, 'Active']]) data.push({ range: `'${tab}'!${colLetter(column)}${item.to.row}`, values: [[value]] });
      for (const column of [fresh.cols.name, fresh.cols.id, fresh.cols.join, fresh.cols.pby, fresh.cols.pdate, fresh.cols.status]) data.push({ range: `'${tab}'!${colLetter(column)}${item.from.row}`, values: [[column === fresh.cols.status ? 'Vacant' : '']] });
    }
    await sheets('/values:batchUpdate', { valueInputOption: 'RAW', data });
    const values = await load();
    const check = parseSheet(values);
    for (const item of plan.items) {
      const target = check.byRow.get(item.to.row), source = check.byRow.get(item.from.row);
      if (target?.id !== item.id || target?.name !== item.from.name || source?.name || source?.id) throw new Error('Write sent, but verification failed. Check the roster before trying again.');
    }
    return new Response(JSON.stringify({ values, count: plan.items.length }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Request failed' }), { headers, status: error instanceof z.ZodError ? 400 : 409 });
  }
});