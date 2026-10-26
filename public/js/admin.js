import { t, L, klass, getLang, applyStatic, mountLangSwitch, onLang, brandHTML } from './i18n.js';
import { esc, ICON, watchSegs } from './ui.js';
import { xlsx } from './xlsx.js';
import { RIASEC } from './score.js';
import { PROFESSIONS } from '../data/professions.js';
import { GRADES, TRACKS } from '../data/countries.js';
import { TYPES } from '../data/content.js';

const $ = id => document.getElementById(id);
const PROF = Object.fromEntries(PROFESSIONS.map(p => [p.id, p]));
const title = id => (PROF[id] ? (getLang() === 'en' ? PROF[id].en : PROF[id].ru) : id);
const when = iso => new Intl.DateTimeFormat(getLang() === 'ru' ? 'ru-RU' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
const fullName = r => [r.surname, r.name].filter(Boolean).join(' ');
let rows = null, failed = false, grade = 'all', track = 'all', q = '', shown = [];
// Sortable table columns; rows arrive newest first and sort is stable, so ties stay newest first.
const COLS = { name: fullName, grade: klass, code: r => r.code, best: r => r.match, date: r => r.createdAt };
let sort = { key: 'date', dir: -1 };

function sorted(list) {
  const f = COLS[sort.key], coll = new Intl.Collator(getLang(), { numeric: true }); // numeric: "8 ..." before "10 ..."
  return [...list].sort((a, b) => { const x = f(a), y = f(b); return sort.dir * (typeof x === 'number' ? x - y : coll.compare(x, y)); });
}

// Grade and track filters combine into one class, e.g. 10 + Медицинский. Results saved before tracks existed only show under all tracks.
const count = (g, tr) => rows.filter(r => (g === 'all' || r.grade === g) && (tr === 'all' || r.track === tr)).length;
const inClass = () => rows.filter(r => (grade === 'all' || r.grade === grade) && (track === 'all' || r.track === track));

// Each button counts what it would show alongside the other filter's current choice.
function counts() {
  $('grades').querySelectorAll('[data-g]').forEach(b => { b.querySelector('.num').textContent = count(b.dataset.g, track); });
  $('tracks').querySelectorAll('[data-tr]').forEach(b => { b.querySelector('.num').textContent = count(grade, b.dataset.tr); });
}

function chrome() {
  document.title = `${t('adm.title')} · ${t('adm.label')}`;
  document.querySelector('[data-brand]').innerHTML = brandHTML();
  $('xlsx').innerHTML = `${ICON.download} ${t('adm.export')}`;
  if (!rows) return;
  $('total').textContent = t('adm.total', { n: rows.length });
  $('grades').innerHTML = ['all', ...GRADES].map(g => `
    <button type="button" data-g="${g}" aria-pressed="${grade === g}">${g === 'all' ? t('adm.all') : t(`grade.${g}`)} <span class="muted num"></span></button>`).join('');
  $('tracks').innerHTML = ['all', ...TRACKS].map(k => `
    <button type="button" data-tr="${k}" aria-pressed="${track === k}">${k === 'all' ? t('adm.allTracks') : t(`track.${k}`)} <span class="muted num"></span></button>`).join('');
  counts();
}

// What this class looks like: leading interest type and the career that most often comes first.
function summary(list) {
  const lead = RIASEC.map(k => [k, list.filter(r => r.code[0] === k).length]).sort((a, b) => b[1] - a[1]);
  const freq = {};
  for (const r of list) freq[r.top[0]] = (freq[r.top[0]] || 0) + 1;
  const careers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pct = v => Math.round((100 * v) / list.length);
  return `
    <div class="adm-sum">
      <div class="panel">
        <h2 class="sub-h">${t('adm.types')}</h2>
        <div class="vals">${lead.map(([k, v], i) => `
          <div class="val"><span><b class="lt"${i === 0 && v ? ' data-lead' : ''}>${k}</b>${L(TYPES[k].name)}</span><div class="bar"><i style="--v:${pct(v)}%"></i></div><b class="num">${v}</b></div>`).join('')}</div>
      </div>
      <div class="panel">
        <h2 class="sub-h">${t('adm.careers')}</h2>
        <ol class="adm-top">${careers.map(([id, v]) => `<li><span>${title(id)}</span><b class="num">${v}</b></li>`).join('')}</ol>
      </div>
    </div>`;
}

function table(list) {
  if (!list.length) return `<p class="muted adm-empty">${t('adm.noMatch')}</p>`;
  return `
    <div class="panel adm-table"><table>
      <thead><tr>${Object.keys(COLS).map(k => {
        const on = sort.key === k, up = sort.dir > 0;
        return `<th scope="col" aria-sort="${on ? (up ? 'ascending' : 'descending') : 'none'}"><button type="button" data-sort="${k}">${t(`adm.${k}`)}<span aria-hidden="true">${on ? (up ? '↑' : '↓') : ''}</span></button></th>`;
      }).join('')}<th><span class="sr-only">${t('adm.open')}</span></th></tr></thead>
      <tbody>${list.map(r => `
        <tr>
          <td><a href="/results/${r.id}" target="_blank" rel="noopener">${esc(fullName(r))}</a></td>
          <td>${klass(r)}</td>
          <td><span class="tag tag-mono">${r.code}</span>${r.flat ? ` <span class="tag tag-dash">${t('adm.flat')}</span>` : ''}</td>
          <td>${title(r.top[0])} <span class="muted num">${r.match}%</span></td>
          <td class="num muted">${when(r.createdAt)}</td>
          <td><a class="btn btn-ghost btn-sm" href="/results/${r.id}" target="_blank" rel="noopener">${t('adm.open')} ${ICON.right}</a></td>
        </tr>`).join('')}</tbody>
    </table></div>`;
}

function body() {
  shown = [];
  $('xlsx').disabled = true;
  if (failed) return void ($('body').innerHTML = `<div class="state"><p>${t('adm.error')}</p></div>`);
  if (!rows) return;
  if (!rows.length) return void ($('body').innerHTML = `<div class="state"><div><p class="muted">${t('adm.empty')}</p></div></div>`);
  const list = inClass();
  if (!list.length) return void ($('body').innerHTML = `<div class="state"><p class="muted">${t('adm.emptyGrade')}</p></div>`);
  shown = sorted(q ? list.filter(r => `${fullName(r)} ${klass(r)}`.toLowerCase().includes(q)) : list);
  $('xlsx').disabled = !shown.length;
  $('body').innerHTML = `${summary(list)}<h2 class="sub-h">${t('adm.showing', { n: shown.length })}</h2>${table(shown)}`;
}

function pick(e, attr) {
  const b = e.target.closest(`[data-${attr}]`);
  if (!b) return null;
  b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  return b.dataset[attr];
}
$('grades').addEventListener('click', e => { const v = pick(e, 'g'); if (v) { grade = v; counts(); body(); } });
$('tracks').addEventListener('click', e => { const v = pick(e, 'tr'); if (v) { track = v; counts(); body(); } });
$('body').addEventListener('click', e => {
  const k = e.target.closest('[data-sort]')?.dataset.sort;
  if (!k) return;
  sort = sort.key === k ? { key: k, dir: -sort.dir } : { key: k, dir: k === 'best' || k === 'date' ? -1 : 1 };
  body();
  $('body').querySelector(`[data-sort="${k}"]`).focus(); // the table is rebuilt, keep keyboard users in place
});
$('q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); body(); });
// Exactly the students on screen (grade, search and sort applied), labelled in the current language.
$('xlsx').addEventListener('click', () => {
  const head = [t('form.surname'), t('form.name'), t('adm.grade'), t('adm.code'), ...[1, 2, 3].map(n => t('adm.top', { n })), t('adm.match'), t('adm.date'), t('adm.link')];
  const data = shown.map(r => [r.surname, r.name, klass(r), r.flat ? `${r.code} (${t('adm.flat')})` : r.code,
    ...r.top.map(title), r.match, when(r.createdAt), `${location.origin}/results/${r.id}`]);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(xlsx([head, ...data], [18, 16, 26, 12, 24, 24, 24, 12, 16, 48]));
  a.download = `cana-${[grade !== 'all' && `grade-${grade}`, track !== 'all' && track].filter(Boolean).join('-') || 'all'}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

applyStatic();
chrome();
mountLangSwitch();
watchSegs();
onLang(() => { chrome(); body(); });
try {
  const res = await fetch('/api/admin/results', { cache: 'no-store' });
  if (!res.ok) throw new Error(String(res.status));
  rows = await res.json();
} catch {
  failed = true;
}
chrome();
body();
