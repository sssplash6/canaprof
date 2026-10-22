import { t, L, getLang, applyStatic, mountLangSwitch, onLang, brandHTML } from './i18n.js';
import { esc, ICON, watchSegs } from './ui.js';
import { xlsx } from './xlsx.js';
import { RIASEC } from './score.js';
import { PROFESSIONS } from '../data/professions.js';
import { GRADES } from '../data/countries.js';
import { TYPES } from '../data/content.js';

const $ = id => document.getElementById(id);
const PROF = Object.fromEntries(PROFESSIONS.map(p => [p.id, p]));
const title = id => (PROF[id] ? (getLang() === 'en' ? PROF[id].en : PROF[id].ru) : id);
const when = iso => new Intl.DateTimeFormat(getLang() === 'ru' ? 'ru-RU' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
let rows = null, failed = false, grade = 'all', q = '', shown = [];

const inGrade = () => rows.filter(r => grade === 'all' || r.grade === grade);

function chrome() {
  document.title = `${t('adm.title')} · ${t('adm.label')}`;
  document.querySelector('[data-brand]').innerHTML = brandHTML();
  $('xlsx').innerHTML = `${ICON.download} ${t('adm.export')}`;
  if (!rows) return;
  $('total').textContent = t('adm.total', { n: rows.length });
  const n = g => rows.filter(r => g === 'all' || r.grade === g).length;
  $('grades').innerHTML = ['all', ...GRADES].map(g => `
    <button type="button" data-g="${g}" aria-pressed="${grade === g}">${g === 'all' ? t('adm.all') : t(`grade.${g}`)} <span class="muted num">${n(g)}</span></button>`).join('');
}

// What this grade looks like: leading interest type and the career that most often comes first.
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
      <thead><tr>${['adm.name', 'adm.grade', 'adm.code', 'adm.best', 'adm.date'].map(k => `<th scope="col">${t(k)}</th>`).join('')}<th><span class="sr-only">${t('adm.open')}</span></th></tr></thead>
      <tbody>${list.map(r => `
        <tr>
          <td><a href="/results/${r.id}" target="_blank" rel="noopener">${esc(r.name)}</a></td>
          <td>${t(`grade.${r.grade}`)}</td>
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
  const list = inGrade();
  if (!list.length) return void ($('body').innerHTML = `<div class="state"><p class="muted">${t('adm.emptyGrade')}</p></div>`);
  shown = q ? list.filter(r => r.name.toLowerCase().includes(q)) : list;
  $('xlsx').disabled = !shown.length;
  $('body').innerHTML = `${summary(list)}<h2 class="sub-h">${t('adm.showing', { n: shown.length })}</h2>${table(shown)}`;
}

$('grades').addEventListener('click', e => {
  const b = e.target.closest('[data-g]');
  if (!b) return;
  grade = b.dataset.g;
  document.querySelectorAll('[data-g]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  body();
});
$('q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); body(); });
// Exactly the students on screen (grade and search applied), labelled in the current language.
$('xlsx').addEventListener('click', () => {
  const head = [t('adm.name'), t('adm.grade'), t('adm.code'), ...[1, 2, 3].map(n => t('adm.top', { n })), t('adm.match'), t('adm.date'), t('adm.link')];
  const data = shown.map(r => [r.name, t(`grade.${r.grade}`), r.flat ? `${r.code} (${t('adm.flat')})` : r.code,
    ...r.top.map(title), r.match, when(r.createdAt), `${location.origin}/results/${r.id}`]);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(xlsx([head, ...data], [22, 12, 12, 24, 24, 24, 12, 16, 48]));
  a.download = `cana-${grade === 'all' ? 'all' : `grade-${grade}`}-${new Date().toISOString().slice(0, 10)}.xlsx`;
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
