// Pure scoring, shared by the browser and score.test.mjs.
export const RIASEC = ['R', 'I', 'A', 'S', 'E', 'C'];
export const BIG5 = ['O', 'C', 'E', 'A', 'N'];
export const STYLES = ['lead', 'collab', 'plan', 'solo'];

const sum = xs => xs.reduce((a, b) => a + b, 0);
const zeros = keys => Object.fromEntries(keys.map(k => [k, 0]));
const top = obj => Object.keys(obj).reduce((a, b) => (obj[b] > obj[a] ? b : a));

export function score(questions, answers) {
  const riasec = zeros(RIASEC), raw = zeros(BIG5), styles = zeros(STYLES), values = {}, skills = {};
  for (const q of questions) {
    const a = answers[q.id];
    if (a == null) continue;
    if (q.part === 'interest') riasec[q.key] += a;
    else if (q.part === 'personality') raw[q.key] += q.rev ? 6 - a : a;
    else if (q.part === 'values') values[q.key] = a;
    else if (q.part === 'skills') skills[q.key] = a;
    else if (q.part === 'sjt') styles[q.options[a].style]++;
  }
  // 4 items of 1..5 per trait: a sum of 4..20 maps onto 0..100
  const big5 = Object.fromEntries(BIG5.map(k => [k, Math.round(((raw[k] - 4) / 16) * 100)]));
  const order = [...RIASEC].sort((a, b) => riasec[b] - riasec[a]); // stable: ties keep RIASEC order
  return { riasec, big5, values, skills, styles, order, code: order.slice(0, 3).join('') };
}

export const level = p => (p < 40 ? 'low' : p > 60 ? 'high' : 'mid');

function pearson(x, y) {
  const mx = sum(x) / x.length, my = sum(y) / y.length;
  let sxy = 0, sxx = 0, syy = 0;
  x.forEach((_, i) => { const dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; });
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

// Interest fit: correlation between the six scores and the job's code weighted 3/2/1, mapped to 0..100.
// A flat profile correlates with nothing and lands on 50 for every job, which is the honest answer.
export function match(riasec, code) {
  const y = RIASEC.map(k => (code.includes(k) ? 3 - code.indexOf(k) : 0));
  return Math.round(50 + 50 * pearson(RIASEC.map(k => riasec[k]), y));
}

export function readiness(skills, profs) {
  const need = {};
  for (const p of profs) for (const [k, v] of Object.entries(p.skills)) need[k] = Math.max(need[k] ?? 0, v);
  const items = Object.entries(need).map(([key, n]) => ({ key, need: n, have: skills[key] ?? 1, gap: n - (skills[key] ?? 1) }));
  if (!items.length) return { percent: 0, gaps: [], ready: [] };
  return {
    percent: Math.round((100 * sum(items.map(i => Math.min(i.have, i.need)))) / sum(items.map(i => i.need))),
    gaps: items.filter(i => i.gap > 0).sort((a, b) => b.gap - a.gap || b.need - a.need),
    ready: items.filter(i => i.gap <= 0).sort((a, b) => b.have - a.have),
  };
}

// Interest decides the order; skill readiness only breaks ties between jobs with the same fit.
export function rank(professions, s) {
  return professions
    .map(p => ({ ...p, match: match(s.riasec, p.code), fit: readiness(s.skills, [p]).percent }))
    .sort((a, b) => b.match - a.match || b.fit - a.fit);
}

// ponytail: one US mid-level figure x a country factor x a shared experience curve. Real per-country,
// per-job salary tables would replace this once we have a source we trust.
const CURVE = [[0, 0.5], [2, 0.7], [5, 1], [8, 1.25], [10, 1.45]];
export function salary(usd, factor, years) {
  const y = Math.min(Math.max(years, 0), 10);
  const i = CURVE.findIndex(([x]) => x >= y);
  const [x0, m0] = CURVE[Math.max(i - 1, 0)], [x1, m1] = CURVE[i];
  const m = x1 === x0 ? m1 : m0 + ((m1 - m0) * (y - x0)) / (x1 - x0);
  return Math.round((usd * factor * m) / 1000) * 1000;
}

// What charges and drains this person, strongest first. Power is a 1..5 meter.
export function manual(s, C) {
  const meter = v => Math.min(5, Math.max(1, Math.round((v - 10) / 8)));
  const fuel = [], drain = [];
  for (const k of s.order.slice(0, 2)) fuel.push({ ...C.TYPES[k].fuel, power: meter(s.riasec[k]) });
  for (const k of s.order.slice(4)) drain.push({ ...C.TYPES[k].drain, power: 6 - meter(s.riasec[k]) });
  for (const k of BIG5) {
    const lv = level(s.big5[k]);
    if (lv === 'mid') continue;
    const power = Math.min(5, 3 + Math.round(Math.abs(s.big5[k] - 50) / 20));
    if (C.TRAITS[k].fuel[lv]) fuel.push({ ...C.TRAITS[k].fuel[lv], power });
    if (C.TRAITS[k].drain[lv]) drain.push({ ...C.TRAITS[k].drain[lv], power });
  }
  const value = top(s.values), style = top(s.styles);
  fuel.push({ ...C.VALUES[value].fuel, power: s.values[value] });
  fuel.push({ ...C.STYLES[style].fuel, power: Math.min(5, 2 + s.styles[style]) });
  const byPower = (a, b) => b.power - a.power;
  return { fuel: fuel.sort(byPower).slice(0, 4), drain: drain.sort(byPower).slice(0, 4), value, style };
}
