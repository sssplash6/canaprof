import assert from 'node:assert/strict';
import { score, match, readiness, salary, rank } from './public/js/score.js';

// Big Five: 4 items per trait, item sums 15 / 10 / 13 give 69 / 38 / 56 percent, reversed items flip.
const qs = [
  ...[0, 1, 2, 3].map(i => ({ id: `o${i}`, part: 'personality', key: 'O', rev: i > 1 })),
  ...[0, 1, 2, 3].map(i => ({ id: `c${i}`, part: 'personality', key: 'C' })),
  ...[0, 1, 2, 3].map(i => ({ id: `n${i}`, part: 'personality', key: 'N' })),
  { id: 'r1', part: 'interest', key: 'E' }, { id: 'r2', part: 'interest', key: 'A' }, { id: 'r3', part: 'interest', key: 'I' },
  { id: 'j1', part: 'sjt', options: [{ style: 'lead' }, { style: 'solo' }] },
];
const s = score(qs, { o0: 5, o1: 4, o2: 3, o3: 3, c0: 4, c1: 2, c2: 2, c3: 2, n0: 4, n1: 3, n2: 3, n3: 3, r1: 5, r2: 4, r3: 3, j1: 1 });
assert.deepEqual([s.big5.O, s.big5.C, s.big5.N], [69, 38, 56]);
assert.equal(s.code, 'EAI');
assert.equal(s.styles.solo, 1);

// Matching discriminates: same code beats a disjoint one, a flat profile is 50 everywhere.
const prof = { R: 25, I: 31, A: 32, S: 30, E: 39, C: 28 };
assert.ok(match(prof, 'EAI') > 85, `EAI fit ${match(prof, 'EAI')}`);
assert.ok(match(prof, 'EAI') - match(prof, 'RCS') > 50);
assert.equal(match({ R: 30, I: 30, A: 30, S: 30, E: 30, C: 30 }, 'EAI'), 50);

// Readiness takes the strictest requirement across jobs and reports gaps largest first.
const r = readiness({ comm: 4, data: 2 }, [{ skills: { comm: 3, data: 4 } }, { skills: { comm: 4, lead: 3 } }]);
assert.deepEqual(r.gaps.map(g => [g.key, g.gap]), [['data', 2], ['lead', 2]]);
assert.equal(r.percent, Math.round((100 * (4 + 2 + 1)) / (4 + 4 + 3)));

// Salary curve: 5 years is the base figure, interpolates between knots, clamps past 10.
assert.equal(salary(100000, 1, 5), 100000);
assert.equal(salary(100000, 0.5, 0), 25000);
assert.equal(salary(100000, 1, 1), 60000);
assert.equal(salary(100000, 1, 25), 145000);

// Ties on interest are broken by skill fit.
const ranked = rank([{ id: 'a', code: 'EAI', skills: { comm: 5 } }, { id: 'b', code: 'EAI', skills: { comm: 2 } }], { riasec: prof, skills: { comm: 3 } });
assert.deepEqual(ranked.map(p => p.id), ['b', 'a']);

console.log('score: ok');
