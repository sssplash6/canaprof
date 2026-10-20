import { t, L, getLang, years, money, shortMoney, date, applyStatic, mountLangSwitch, onLang, brandHTML } from './i18n.js';
import { esc, load, save, ICON, watchSegs } from './ui.js';
import { score, rank, readiness, salary, manual, level, isFlat, RIASEC, BIG5, STYLES } from './score.js';
import { QUESTIONS } from '../data/questions.js';
import { PROFESSIONS } from '../data/professions.js';
import { COUNTRIES } from '../data/countries.js';
import * as C from '../data/content.js';

const $ = id => document.getElementById(id);
const id = location.pathname.match(/^\/results\/([A-Za-z0-9_-]{12})$/)?.[1];
const SKILL = Object.fromEntries(QUESTIONS.filter(q => q.part === 'skills').map(q => [q.key, q.title]));
const SECTIONS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
const STAGES = ['early', '10', '11', 'uni'];
const PRI = { critical: 0, recommended: 1, optional: 2 };
const GROWTH = { high: 0, mid: 1, low: 2 };
const stageOf = g => (g === 'uni' || g === '10' || g === '11' ? g : 'early');
const title = p => (getLang() === 'en' ? p.en : p.ru);
const subtitle = p => (getLang() === 'en' ? L(p.field) : p.en);
const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
const fmt1 = n => new Intl.NumberFormat(getLang() === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 1 }).format(n);
const cells = cls => [1, 2, 3, 4, 5].map(k => `<i class="${cls(k)}"></i>`).join('');

let rec, s, ranked, home, io;
const view = { list: 'top10', sort: 'match', compare: [], prof: null, years: 5, country: 'us', stage: 'all' };
const doneKey = `cana:done:${id || 'demo'}`;
const doneSet = new Set(load(doneKey) || []);
const flat = () => isFlat(s);
const name = () => (rec.demo ? (getLang() === 'en' ? 'Madina' : 'Мадина') : rec.name);

// The sample report: a fixed, plausible profile generated from the real question bank.
function demo() {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const near = m => Math.min(5, Math.max(1, Math.round(m + rnd() * 1.6 - 0.8)));
  const interest = { R: 2.3, I: 3.2, A: 3.5, S: 3.0, E: 4.1, C: 2.7 };
  const trait = { O: 4.0, C: 2.6, E: 3.9, A: 3.3, N: 3.2 };
  const values = { achievement: 5, independence: 5, recognition: 4, relationships: 3, support: 2, conditions: 3 };
  const skills = { comm: 4, team: 4, problem: 4, critical: 3, creative: 4, digital: 3, time: 2, lead: 4, data: 2, english: 3 };
  const answers = {};
  for (const q of QUESTIONS) {
    if (q.part === 'interest') answers[q.id] = near(interest[q.key]);
    else if (q.part === 'personality') { const v = near(trait[q.key]); answers[q.id] = q.rev ? 6 - v : v; }
    else if (q.part === 'values') answers[q.id] = values[q.key];
    else if (q.part === 'skills') answers[q.id] = skills[q.key];
    else answers[q.id] = q.options.findIndex(o => o.style === (q.id === 'j02' ? 'collab' : 'lead'));
  }
  return { demo: true, grade: '10', country: 'uz', createdAt: new Date().toISOString(), answers };
}

const section = (n, body, tools = '') => `
  <section id="s${n}" aria-labelledby="s${n}-h">
    <div class="sec-head"><span class="n" aria-hidden="true">0${n}</span><div><h2 id="s${n}-h">${t(`s${n}`)}</h2><p>${t(`s${n}.sub`)}</p></div></div>
    ${tools}
    <div class="panel">${body}</div>
  </section>`;

function hero() {
  const [p1, p2] = s.order, top = ranked[0];
  const chips = [C.TYPES[p1].strengths[0], C.TYPES[p1].strengths[1], C.TYPES[p2].strengths[0]];
  return `
  <section class="hero" id="top" aria-labelledby="hero-h">
    <div class="hero-grid">
      <div>
        <h1 id="hero-h">${t('r.archetype', { name: esc(name()) })}</h1>
        <p class="arch">${L(C.ARCHETYPE.adj[p2])} ${L(C.ARCHETYPE.noun[p1])}</p>
        <p class="text">${L(C.TYPES[p1].hero)} ${L(C.TYPES[p2].blend)}</p>
        <div class="chips">${chips.map(c => `<span class="chip">${L(c)}</span>`).join('')}</div>
        ${flat() ? `<p class="flat">${t('r.flat')}</p>` : ''}
      </div>
      <div class="stats">
        <div class="stat"><p class="kicker">${t('r.code')}</p><p class="v code">${s.code}</p><p class="s">${s.order.slice(0, 3).map(k => L(C.TYPES[k].name)).join(' · ')}</p></div>
        <div class="stat invert"><p class="kicker">${t('r.best')}</p><p class="v num">${top.match}%</p><p class="s">${title(top)}</p></div>
        <div class="stat"><p class="kicker">${t('r.potential')}</p><p class="v num">${money(salary(top.usd, 1, 10))}</p><p class="s">${t('r.perYearUS', { p: title(top) })}</p></div>
      </div>
    </div>
    <div class="hero-foot">
      <span>${esc(name())} · ${t(`grade.${rec.grade}`)} · ${L(COUNTRIES[rec.country])}</span>
      <span>${date(rec.createdAt)}${id ? ` · <span class="mono">${id}</span>` : ''}</span>
    </div>
  </section>`;
}

function interests() {
  const ang = j => (Math.PI * 2 * j) / 6 - Math.PI / 2;
  const at = (j, r) => [(Math.cos(ang(j)) * r).toFixed(1), (Math.sin(ang(j)) * r).toFixed(1)];
  const ring = f => RIASEC.map((_, j) => at(j, 140 * f).join(',')).join(' ');
  const pts = RIASEC.map((k, j) => at(j, ((s.riasec[k] - 10) / 40) * 140));
  const radar = `
    <svg class="radar" viewBox="-200 -190 400 380" role="img" aria-label="${t('radar.alt', { list: RIASEC.map(k => `${k} ${s.riasec[k]}`).join(', ') })}">
      ${[0.25, 0.5, 0.75, 1].map(f => `<polygon points="${ring(f)}" fill="none" stroke="var(--line)"/>`).join('')}
      ${RIASEC.map((_, j) => { const [x, y] = at(j, 140); return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="var(--line)"/>`; }).join('')}
      <polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="rgb(0 0 0 / 0.07)" stroke="var(--ink)" stroke-width="1.75" stroke-linejoin="round"/>
      ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="var(--bg)" stroke="var(--ink)" stroke-width="1.5"/>`).join('')}
      ${RIASEC.map((k, j) => { const [x, y] = at(j, 166); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${k}<tspan class="num" dx="5">${s.riasec[k]}</tspan></text>`; }).join('')}
    </svg>`;
  const rows = s.order.map((k, r) => `
    <div class="type-row" data-rank="${r}">
      <span class="l" aria-hidden="true">${k}</span>
      <div>
        <div class="nm"><span>${L(C.TYPES[k].name)}${r < 3 ? ` <small>· ${t(`role.${r}`)}</small>` : ''}</span></div>
        <div class="bar"><i style="--v:${((s.riasec[k] - 10) / 40) * 100}%"></i></div>
        <p class="tl">${L(C.TYPES[k].tagline)}</p>
      </div>
      <span class="sc num">${s.riasec[k]}<small>/50</small></span>
    </div>`).join('');
  return `<div class="int-grid"><div>${radar}</div><div class="types">${rows}</div></div>`;
}

function traits() {
  const dist = k => Math.abs(s.big5[k] - 50);
  const open = [...BIG5].sort((a, b) => dist(b) - dist(a)).slice(0, 2);
  return `<div class="traits">${BIG5.map(k => {
    const p = s.big5[k], lv = level(p), T = C.TRAITS[k];
    return `
    <details class="trait" ${open.includes(k) ? 'open' : ''}>
      <summary>
        <span class="l" aria-hidden="true">${k}</span>
        <div>
          <div class="hd"><b>${L(T.name)}</b><span>${t(`lv.${lv}`)}<b class="num">${p}%</b></span></div>
          <div class="bipolar" aria-hidden="true"><i style="--v:${p}%"></i></div>
          <div class="poles"><span class="${p < 50 ? 'on' : ''}">${L(T.low)}</span><span class="${p > 50 ? 'on' : ''}">${L(T.high)}</span></div>
        </div>
        <span class="chev">${ICON.chev}</span>
      </summary>
      <p class="body">${L(T.text[lv])}</p>
    </details>`;
  }).join('')}</div>`;
}

function careersShell() {
  return `
    <div class="sec-tools">
      <div class="seg" role="group" aria-label="${t('s3')}">
        ${[['top3', t('p.top3')], ['top10', t('p.top10')], ['all', t('p.all', { n: ranked.length })]]
          .map(([v, l]) => `<button type="button" data-list="${v}" aria-pressed="${view.list === v}">${l}</button>`).join('')}
      </div>
      <label class="sort">${t('p.sort')}
        <select class="input" id="sort">${['match', 'salary', 'ai', 'growth'].map(v => `<option value="${v}" ${view.sort === v ? 'selected' : ''}>${t(`sort.${v}`)}</option>`).join('')}</select>
      </label>
    </div>
    <div class="cards" id="cards"></div>
    <p class="hint-line">${t('p.compareHint')}</p>
    <div id="compare"></div>`;
}

function shown() {
  const n = { top3: 3, top10: 10, all: ranked.length }[view.list];
  const by = { match: () => 0, salary: (a, b) => b.p.usd - a.p.usd, ai: (a, b) => a.p.ai - b.p.ai, growth: (a, b) => GROWTH[a.p.growth] - GROWTH[b.p.growth] };
  return ranked.slice(0, n).map((p, r) => ({ p, r })).sort((a, b) => by[view.sort](a, b) || a.r - b.r);
}

function card({ p, r }) {
  const on = view.compare.includes(p.id);
  return `
  <article class="pcard" ${r < 3 ? 'data-top' : ''}>
    <details>
      <summary>
        <div class="row1">
          <span class="rk num">${String(r + 1).padStart(2, '0')}</span>
          <div><h3>${title(p)}</h3><p class="en">${subtitle(p)}</p></div>
          <div class="fit"><b class="num">${p.match}%</b><small>${t('p.fit')}</small></div>
        </div>
        <p class="why">${L(p.why)}</p>
        <div class="meta">
          <span class="tag num">${shortMoney(p.usd)} ${t('p.usd')}</span>
          <span class="tag num">${t('p.aiShort', { n: p.ai })}</span>
          <span class="tag ${p.growth === 'high' ? 'tag-solid' : p.growth === 'low' ? 'tag-dash' : ''}">${t(`g.${p.growth}`)}</span>
          <span class="tag tag-mono">${p.code}</span>
        </div>
      </summary>
      <div class="more">
        <div><h4>${t('p.about')}</h4><p>${L(p.about)}</p></div>
        <div><h4>${t('p.start')}</h4><p>${L(p.start)}</p></div>
        <div><h4>${t('p.skills')}</h4><div class="skill-need">${Object.entries(p.skills).map(([k, v]) =>
          `<span><span class="dots" aria-label="${v}/5">${cells(j => (j <= v ? 'on' : ''))}</span>${L(SKILL[k])}</span>`).join('')}</div></div>
        <p class="muted">${t('p.study', { field: L(p.field), years: years(p.years) })}</p>
      </div>
    </details>
    <label class="cmp"><input type="checkbox" data-cmp="${p.id}" ${on ? 'checked' : ''} ${!on && view.compare.length >= 3 ? 'disabled' : ''}>${t('p.compare')}</label>
  </article>`;
}

function compareTable() {
  const ps = view.compare.map(k => ranked.find(p => p.id === k));
  if (ps.length < 2) return '';
  const hf = home && COUNTRIES[home].factor;
  const rows = [
    [t('p.fit'), p => p.match, 1, v => `${v}%`],
    [t('p.salaryRow'), p => p.usd, 1, v => money(v)],
    ...(hf ? [[t('p.homeRow'), p => salary(p.usd, hf, 5), 1, v => money(v)]] : []),
    [t('p.aiRow'), p => p.ai, -1, v => `${v}%`],
    [t('p.demand'), p => -GROWTH[p.growth], 1, (v, p) => t(`g.${p.growth}`)],
    [t('p.studyRow'), p => p.years, 0, (v, p) => `${L(p.field)}, ${years(p.years)}`],
    [t('p.code'), p => p.code, 0, v => v],
  ];
  return `
    <h3 class="sub-h">${t('p.compareTitle')}<button type="button" class="btn btn-text btn-sm" data-act="clear">${t('p.clear')}</button></h3>
    <div class="compare"><table>
      <thead><tr><th></th>${ps.map(p => `<th scope="col">${title(p)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, f, dir, show]) => {
        const vals = ps.map(f), best = dir ? (dir > 0 ? Math.max(...vals) : Math.min(...vals)) : null;
        const clear = dir && new Set(vals).size > 1;
        return `<tr><th scope="row">${label}</th>${ps.map((p, k) => `<td class="${clear && vals[k] === best ? 'best' : ''}">${show(vals[k], p)}</td>`).join('')}</tr>`;
      }).join('')}</tbody>
    </table></div>`;
}

function renderCards() {
  $('cards').innerHTML = shown().map(card).join('');
  $('compare').innerHTML = compareTable();
}

function incomeShell() {
  const countries = Object.entries(COUNTRIES).filter(([k, c]) => c.salary || (k === home && c.factor));
  return `
    <div class="inc-top">
      <div class="field"><label for="prof">${t('i.prof')}</label>
        <select class="input" id="prof">${ranked.map(p => `<option value="${p.id}" ${p.id === view.prof ? 'selected' : ''}>${title(p)} · ${p.match}%</option>`).join('')}</select>
      </div>
      <div class="slider">
        <div class="hd"><label for="exp">${t('i.exp')}</label><b id="yrs" class="num"></b></div>
        <input type="range" id="exp" min="0" max="10" step="1" value="${view.years}">
        <div class="ticks" aria-hidden="true">${[0, 1, 2, 3, 4].map(k => `<span>${t(`i.lv${k}`)}</span>`).join('')}</div>
      </div>
    </div>
    <div id="money"></div>
    <h3 class="sub-h">${t('i.country')}</h3>
    <div class="ctry" role="group" aria-label="${t('i.country')}">
      ${countries.map(([k, c]) => `<button type="button" data-ctry="${k}" aria-pressed="${view.country === k}" ${k === home ? 'data-home' : ''}>${L(c)}</button>`).join('')}
    </div>
    <h3 class="sub-h">${t('i.curve')}</h3>
    <div class="chart" id="chart"></div>
    <h3 class="sub-h">${t('i.rank')}</h3>
    <div class="ranks" id="ranks"></div>
    <p class="fine">${t('i.note')}</p>`;
}

function niceMax(v) {
  const step = 10 ** Math.floor(Math.log10(v));
  return (Math.ceil((v / step) * 2) / 2) * step;
}

function renderIncome() {
  const p = ranked.find(x => x.id === view.prof), y = view.years, sel = COUNTRIES[view.country];
  const selV = salary(p.usd, sel.factor, y);
  const hf = home && home !== view.country ? COUNTRIES[home].factor : null, homeV = hf && salary(p.usd, hf, y);
  $('yrs').textContent = `${years(y)}${y === 10 ? '+' : ''}`;
  $('exp').style.setProperty('--p', `${y * 10}%`);
  $('exp').setAttribute('aria-valuetext', years(y));
  $('money').innerHTML = `
    <div class="money ${hf ? '' : 'one'}">
      <div class="box sel"><p class="kicker">${L(sel)}</p><p class="v num">${money(selV)}</p>
        <p class="s">${t('i.month', { x: money(Math.round(selV / 12)) })}${hf ? ` · ${t('i.times', { x: fmt1(selV / homeV) })}` : ''}</p></div>
      ${hf ? `<div class="box home"><p class="kicker">${t('i.home')}: ${L(COUNTRIES[home])}</p><p class="v num">${money(homeV)}</p>
        <p class="s">${t('i.month', { x: money(Math.round(homeV / 12)) })}</p></div>` : ''}
    </div>`;

  // Drawn at the container's real width so labels stay at their CSS size on every screen.
  const W = Math.max(300, $('chart').clientWidth || 640), H = W < 500 ? 200 : 240, L0 = 52, R0 = 14, T0 = 14, B0 = 30;
  const max = niceMax(salary(p.usd, Math.max(sel.factor, hf || 0), 10));
  const x = v => L0 + (v / 10) * (W - L0 - R0), yv = v => T0 + (1 - v / max) * (H - T0 - B0);
  const path = f => [...Array(11).keys()].map(k => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${yv(salary(p.usd, f, k)).toFixed(1)}`).join('');
  $('chart').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('i.curve')}: ${title(p)}, ${L(sel)}">
      <g class="grid">${[0, 0.25, 0.5, 0.75, 1].map(f => `<line x1="${L0}" x2="${W - R0}" y1="${yv(f * max)}" y2="${yv(f * max)}"/><text x="${L0 - 10}" y="${yv(f * max)}" text-anchor="end" dominant-baseline="middle">${shortMoney(f * max)}</text>`).join('')}</g>
      ${[0, 2, 5, 8, 10].map(v => `<text x="${x(v)}" y="${H - 6}" text-anchor="middle">${v}${v === 10 ? '+' : ''}</text>`).join('')}
      <path d="${path(sel.factor)}L${x(10)},${yv(0)}L${x(0)},${yv(0)}Z" fill="rgb(0 0 0 / 0.05)"/>
      ${hf ? `<path d="${path(hf)}" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 4"/>` : ''}
      <path d="${path(sel.factor)}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
      <line x1="${x(y)}" x2="${x(y)}" y1="${T0}" y2="${H - B0}" stroke="var(--mute-2)" stroke-dasharray="2 3"/>
      ${hf ? `<circle cx="${x(y)}" cy="${yv(homeV)}" r="4" fill="var(--bg)" stroke="var(--ink)" stroke-width="1.5"/>` : ''}
      <circle cx="${x(y)}" cy="${yv(selV)}" r="5" fill="var(--ink)" stroke="var(--bg)" stroke-width="2"/>
    </svg>
    <div class="legend"><span><i class="ln"></i>${L(sel)}</span>${hf ? `<span><i class="ln dash"></i>${t('i.legendHome')}</span>` : ''}</div>`;

  const rows = Object.entries(COUNTRIES).filter(([k, c]) => c.salary || (k === home && c.factor))
    .map(([k, c]) => ({ k, c, v: salary(p.usd, c.factor, y) })).sort((a, b) => b.v - a.v);
  $('ranks').innerHTML = rows.map((r, j) => `
    <div class="rank" ${r.k === view.country ? 'data-sel' : ''} ${r.k === home ? 'data-home' : ''}>
      <span class="i num">${j + 1}</span><span>${L(r.c)}${r.k === home ? `<small>${t('i.home')}</small>` : ''}</span>
      <div class="bar"><i style="--v:${(r.v / rows[0].v) * 100}%"></i></div><b class="num">${money(r.v)}</b>
    </div>`).join('');
}

function tasks() {
  const from = STAGES.indexOf(stageOf(rec.grade)), p1 = s.order[0];
  return [
    { id: 'try', stage: stageOf(rec.grade), priority: 'recommended', try: ranked[0] },
    ...C.ROADMAP.base.map((x, k) => ({ ...x, id: `b${k}` })),
    ...C.ROADMAP.byType[p1].map((x, k) => ({ ...x, id: `t${p1}${k}` })),
  ].filter(x => STAGES.indexOf(x.stage) >= from);
}

function planShell() {
  const cur = stageOf(rec.grade), from = STAGES.indexOf(cur);
  return `
    <div class="track" aria-hidden="true"><span class="fill" style="--v:${from * 25}%"></span>
      ${STAGES.map((st, k) => `<div data-state="${k < from ? 'past' : k === from ? 'now' : 'next'}"><i></i>${t(`st.${st}`)}</div>`).join('')}
    </div>
    <div class="sec-tools">
      <div class="seg" role="group" aria-label="${t('s5')}">
        ${['all', ...STAGES.slice(from)].map(st => `<button type="button" data-stage="${st}" aria-pressed="${view.stage === st}">${st === 'all' ? t('pl.all') : t(`st.${st}`)}</button>`).join('')}
      </div>
      <span class="muted num" id="plandone"></span>
    </div>
    <div id="plan"></div>
    <div class="legend">${['critical', 'recommended', 'optional'].map(pr => `<span><i class="${pr}"></i>${t(`pr.${pr}`)}</span>`).join('')}</div>`;
}

function task(x) {
  const done = doneSet.has(x.id);
  return `
  <details class="task" data-p="${x.priority}" ${done ? 'data-done' : ''}>
    <summary>
      <input type="checkbox" class="check" data-task="${x.id}" ${done ? 'checked' : ''} aria-label="${t('pl.mark')}">
      <span class="t">${x.try ? t('pl.try', { p: title(x.try) }) : L(x.title)}</span>
      <span class="tag">${x.try ? t('pl.month') : L(x.duration)}</span>
      <span class="chev">${ICON.chev}</span>
    </summary>
    <p class="d">${x.try ? L(x.try.start) : L(x.detail)} <span class="muted">· ${t(`pr.${x.priority}`)}</span></p>
  </details>`;
}

function planCounts() {
  const list = tasks();
  $('plandone').textContent = t('pl.done', { d: list.filter(x => doneSet.has(x.id)).length, n: list.length });
  document.querySelectorAll('[data-gcount]').forEach(el => {
    const ts = list.filter(x => x.stage === el.dataset.gcount);
    el.textContent = `${ts.filter(x => doneSet.has(x.id)).length}/${ts.length}`;
  });
}

function renderPlan() {
  const cur = stageOf(rec.grade), list = tasks();
  const stages = STAGES.slice(STAGES.indexOf(cur)).filter(st => view.stage === 'all' || view.stage === st);
  $('plan').innerHTML = stages.map(st => `
    <div class="stage-group" ${st === cur ? 'data-now' : ''}>
      <span class="badge" aria-hidden="true">${st === 'early' ? '7-9' : st === 'uni' ? 'U' : st}</span>
      <h3>${t(`st.${st}`)}${st === cur ? ` <span class="tag tag-solid">${t('pl.now')}</span>` : ''} <span class="muted num" style="font-size:13px;font-weight:400" data-gcount="${st}"></span></h3>
      <div class="tasks">${list.filter(x => x.stage === st).sort((a, b) => PRI[a.priority] - PRI[b.priority]).map(task).join('')}</div>
    </div>`).join('');
  planCounts();
}

function ready() {
  const top3 = ranked.slice(0, 3), r = readiness(s.skills, top3), circ = 2 * Math.PI * 52;
  return `
    <div class="rd-top">
      <div class="ring"><svg viewBox="0 0 120 120" role="img" aria-label="${r.percent}% ${t('rd.ready')}">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--well)" stroke-width="8"/>
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--ink)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${((circ * r.percent) / 100).toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 60 60)"/>
        <text x="60" y="60" text-anchor="middle">${r.percent}%</text>
        <text class="lbl" x="60" y="80" text-anchor="middle">${t('rd.ready').toUpperCase()}</text>
      </svg></div>
      <div class="well count"><p class="kicker">${t('rd.strong')}</p><p class="v num">${r.ready.length}</p></div>
      <div class="well count"><p class="kicker">${t('rd.grow')}</p><p class="v num">${r.gaps.length}</p></div>
    </div>
    <p class="fine">${t('rd.for', { list: top3.map(title).join(', ') })}</p>
    <h3 class="sub-h">${t('rd.priority')}</h3>
    ${r.gaps.length ? `<div class="gaps">${r.gaps.map((g, k) => `
      <div class="gap">
        <span class="i num">${k + 1}</span>
        <div><p class="nm">${L(SKILL[g.key])}</p>
          <div class="levels" aria-hidden="true">${cells(l => (l <= g.have ? 'have' : l <= g.need ? 'need' : ''))}</div>
          <p class="s">${t('rd.need', { n: g.need, h: g.have })}</p></div>
        <span class="d num">+${g.gap}</span>
      </div>`).join('')}</div>` : `<p class="muted">${t('rd.none')}</p>`}
    ${r.ready.length ? `<h3 class="sub-h">${t('rd.have')}</h3><div class="chips">${r.ready.map(x => `<span class="chip">${L(SKILL[x.key])} <span class="muted num">${x.have}/5</span></span>`).join('')}</div>` : ''}`;
}

function energy() {
  const m = manual(s, C);
  const item = (x, kind) => `
    <div class="eitem">
      <div class="hd">${cap(L(x.title))}<span class="num">${kind === 'f' ? '+' : '−'}${x.power}</span></div>
      <div class="meter ${kind}" role="img" aria-label="${t('m.power', { n: x.power })}">${cells(k => (k <= x.power ? 'on' : ''))}</div>
      <p>${L(x.detail)}</p>
    </div>`;
  const vals = Object.entries(s.values).sort((a, b) => b[1] - a[1]);
  return `
    <div class="callout"><span class="kicker">${t('m.insight')}</span>
      <p>${t('m.insightText', { f1: L(m.fuel[0].title), f2: L(m.fuel[1].title), d1: L(m.drain[0].title) })}</p></div>
    <div class="energy" style="margin-top:26px">
      <div><h3><i class="f"></i>${t('m.fuel')}</h3>${m.fuel.map(x => item(x, 'f')).join('')}</div>
      <div><h3><i class="d"></i>${t('m.drain')}</h3>${m.drain.map(x => item(x, 'd')).join('')}</div>
    </div>
    <div class="energy">
      <div><h3 class="sub-h">${t('m.values')}</h3>
        <div class="vals">${vals.map(([k, v]) => `<div class="val"><span>${L(C.VALUES[k].name)}</span><div class="bar"><i style="--v:${v * 20}%"></i></div><b class="num">${v}</b></div>`).join('')}</div>
      </div>
      <div><h3 class="sub-h">${t('m.style')}<small>${t('m.styleNote')}</small></h3>
        <div class="styles">${STYLES.map(k => `<div class="style" ${k === m.style ? 'data-top' : ''}><b>${L(C.STYLES[k].name)}</b>
          <div class="meter" aria-label="${s.styles[k]}/4">${[1, 2, 3, 4].map(j => `<i class="${j <= s.styles[k] ? 'on' : ''}"></i>`).join('')}</div></div>`).join('')}</div>
        <p class="fine">${L(C.STYLES[m.style].text)}</p>
      </div>
    </div>
    <h3 class="sub-h">${t('m.tips')}</h3>
    <div class="tips">${C.TIPS.map((x, k) => `<div class="tip"><span>0${k + 1}</span><b>${L(x.title)}</b><p>${L(x.detail)}</p></div>`).join('')}</div>`;
}

function chrome() {
  document.title = `${name()} · ${t('brand.title')}`;
  document.querySelector('[data-brand]').innerHTML = brandHTML();
  $('who').innerHTML = t('r.for', { name: esc(name()) });
  $('share').innerHTML = `${ICON.share}<span class="roll"><span>${t('r.share')}</span><span aria-hidden="true">${t('r.copied')}</span></span>`;
  $('pdf').innerHTML = `${ICON.download}<span class="hide-sm">${t('r.pdf')}</span>`;
  $('pdf').setAttribute('aria-label', t('r.pdf'));
  $('snav').innerHTML = `<ol>${SECTIONS.map((k, j) => `<li><a href="#${k}"><span>0${j + 1}</span>${t(k)}</a></li>`).join('')}</ol>`;
  $('banner').innerHTML = rec.demo ? `<div class="banner">${t('r.sample')} <a href="/">${t('f.retake')}</a></div>` : '';
}

function renderAll() {
  chrome();
  $('main').innerHTML = `
    <div class="report">
      ${hero()}
      ${section(1, interests())}
      ${section(2, traits(), `<div class="sec-tools"><span></span><span class="b5code num">${BIG5.map(k => `${k}${s.big5[k]}`).join(' · ')}</span></div>`)}
      ${section(3, careersShell())}
      ${section(4, incomeShell())}
      ${section(5, planShell())}
      ${section(6, ready())}
      ${section(7, energy())}
    </div>`;
  renderCards();
  renderIncome();
  renderPlan();
  spy();
  let w = $('chart').clientWidth;
  new ResizeObserver(() => { if ($('chart').clientWidth !== w) { w = $('chart').clientWidth; renderIncome(); } }).observe($('chart'));
}

function spy() {
  io?.disconnect();
  const links = [...document.querySelectorAll('#snav a')];
  io = new IntersectionObserver(es => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      links.forEach(a => {
        const on = a.hash === `#${e.target.id}`;
        a.setAttribute('aria-current', String(on));
        if (on) a.parentElement.parentElement.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
      });
    }
  }, { rootMargin: '-35% 0px -60% 0px' });
  SECTIONS.forEach(k => io.observe($(k)));
}

const press = (sel, attr, v) => document.querySelectorAll(sel).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === v)));

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.list) { view.list = b.dataset.list; press('[data-list]', 'data-list', view.list); renderCards(); }
  else if (b.dataset.ctry) { view.country = b.dataset.ctry; press('[data-ctry]', 'data-ctry', view.country); renderIncome(); }
  else if (b.dataset.stage) { view.stage = b.dataset.stage; press('[data-stage]', 'data-stage', view.stage); renderPlan(); }
  else if (b.dataset.act === 'clear') { view.compare = []; renderCards(); }
  else if (b.id === 'pdf') window.print();
  else if (b.id === 'share') {
    const url = location.origin + location.pathname;
    if (navigator.share && matchMedia('(pointer: coarse)').matches) { try { await navigator.share({ title: document.title, url }); } catch {} return; }
    try { await navigator.clipboard.writeText(url); } catch { return; }
    const roll = b.querySelector('.roll');
    roll.classList.add('on');
    clearTimeout(b.timer);
    b.timer = setTimeout(() => roll.classList.remove('on'), 1400);
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'sort') { view.sort = el.value; renderCards(); }
  else if (el.id === 'prof') { view.prof = el.value; renderIncome(); }
  else if (el.dataset.cmp) {
    view.compare = el.checked ? [...view.compare, el.dataset.cmp].slice(-3) : view.compare.filter(k => k !== el.dataset.cmp);
    document.querySelectorAll('[data-cmp]').forEach(c => { c.disabled = !c.checked && view.compare.length >= 3; });
    $('compare').innerHTML = compareTable();
  } else if (el.dataset.task) {
    el.checked ? doneSet.add(el.dataset.task) : doneSet.delete(el.dataset.task);
    save([...doneSet], doneKey);
    el.closest('.task').toggleAttribute('data-done', el.checked);
    planCounts();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'exp') { view.years = Number(e.target.value); renderIncome(); }
});

// Paper gets the trait notes and the top three careers expanded; everything returns afterwards.
let closed = [];
addEventListener('beforeprint', () => {
  closed = [...document.querySelectorAll('.trait:not([open]), .pcard[data-top] details:not([open])')];
  closed.forEach(d => { d.open = true; });
});
addEventListener('afterprint', () => closed.forEach(d => { d.open = false; }));

async function start() {
  applyStatic();
  mountLangSwitch();
  watchSegs();
  try {
    if (location.pathname !== '/results' && !id) throw new Error('bad id');
    const r = id ? await fetch(`/api/results/${id}`).then(res => (res.ok ? res.json() : Promise.reject(res.status))) : demo();
    rec = r;
  } catch {
    $('main').innerHTML = `<div class="state"><div><h1>${t('r.notFound')}</h1><p class="muted" style="margin:8px 0 18px">${t('r.notFoundText')}</p><a class="btn" href="/">${t('f.retake')}</a></div></div>`;
    return;
  }
  s = score(QUESTIONS, rec.answers);
  ranked = rank(PROFESSIONS, s);
  home = COUNTRIES[rec.country]?.factor ? rec.country : null;
  view.prof = ranked[0].id;
  renderAll();
  onLang(renderAll);
}
start();
