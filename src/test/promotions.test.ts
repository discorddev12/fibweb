import { describe, expect, it } from 'vitest';
import { parseSheet, parsePromos, computeAll } from '../../supabase/functions/_shared/promotions.js';
const settings = { pby: 'Aaron', date: '11/13/26', emoji: '', minOverride: 0, doubleHours: 8, supHours: 15, supIdx: 5 };
const values = [
  ['Rank', 'Name', 'Discord ID', 'Callsign', 'Join Date', 'Promoted By', 'Promotion Date', 'Status'],
  ['Agent', 'Test Officer', '1190294713882923129', '5S-01', '1/1/26', '', '', 'Active'],
  ['Jr Agent', '', '', '5S-02', '', '', '', 'Vacant'],
  ['Field Agent', '', '', '4S-01', '', '', '', 'Vacant'],
  ['Supervisory Special Agent', 'Supervisor', '1190294713882923130', '3S-01', '', '', '', 'Active'],
  ['Executive Agent', '', '', '3S-02', '', '', '', 'Vacant'],
  ['Asst. Special Agent in Charge', '', '', '2S-01', '', '', '', 'Vacant'],
  ['Branch Director', 'Command', '1190294713882923131', '2S-02', '', '', '', 'Active'],
];
const run = (name: string, cs: string, hours: number) => computeAll(parsePromos(`1. @${cs} | ${name} – ${hours}h 0m / 4h 0m (100%)`), parseSheet(values), {}, settings);
describe('Promotion rules from the supplied tool', () => {
  it('requires the bot minimum of 4 hours', () => { expect(run('Test Officer', '5S-01', 3).left).toHaveLength(1); expect(run('Test Officer', '5S-01', 4).ready[0].steps).toBe(1); });
  it('gives a double at 8 hours for agents', () => { expect(run('Test Officer', '5S-01', 7).ready[0].steps).toBe(1); expect(run('Test Officer', '5S-01', 8).ready[0].steps).toBe(2); });
  it('requires 15 hours for a supervisor double', () => { expect(run('Supervisor', '3S-01', 14).ready[0].steps).toBe(1); expect(run('Supervisor', '3S-01', 15).ready[0].steps).toBe(2); });
  it('does not promote Branch Directors', () => { expect(run('Command', '2S-02', 30).ready).toHaveLength(0); expect(run('Command', '2S-02', 30).left).toHaveLength(1); });
  it('rejects names that do not match a callsign', () => { expect(run('Wrong Person', '5S-01', 8).errors).toHaveLength(1); });
  it('cannot allocate one officer twice through manual matching', () => { const entries = parsePromos('1. @5S-01 | Test Officer – 4h 0m / 4h 0m (100%)\n2. @5S-99 | Other – 8h 0m / 4h 0m (100%)'); const result = computeAll(entries, parseSheet(values), { '5S-99': { rowNum: 2 } }, settings); expect(result.ready).toHaveLength(1); expect(result.errors).toHaveLength(1); });
});