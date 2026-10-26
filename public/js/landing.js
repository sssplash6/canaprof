import { t, count, applyStatic, mountLangSwitch, onLang, brandHTML } from './i18n.js';
import { esc, load, save, clear, PARTS, ICON, watchSegs } from './ui.js';
import { GRADES, TRACKS } from '../data/countries.js';
import { QUESTIONS } from '../data/questions.js';

const $ = id => document.getElementById(id);
const saved = load();
const answered = saved?.meta ? Object.keys(saved.answers || {}).length : 0;

function options(sel, items, value) {
  sel.innerHTML = `<option value="" disabled ${value ? '' : 'selected'}>${t('form.choose')}</option>` +
    items.map(([v, label]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${esc(label)}</option>`).join('');
}

function render() {
  document.title = t('brand.title');
  document.querySelector('[data-brand]').innerHTML = brandHTML();
  $('parts').innerHTML = PARTS.map((p, i) => `
    <li><span>0${i + 1}</span><b>${t(`part.${p}`)}</b><small>${count(QUESTIONS.filter(q => q.part === p).length, 'q')}</small></li>`).join('');
  $('gets').innerHTML = [1, 2, 3, 4, 5, 6].map(i => `<li><span>0${i}</span><span>${t(`get.${i}`)}</span></li>`).join('');
  options($('grade'), GRADES.map(g => [g, t(`grade.${g}`)]), $('grade').value || saved?.meta?.grade);
  options($('track'), TRACKS.map(k => [k, t(`track.${k}`)]), $('track').value || saved?.meta?.track);
  $('start').innerHTML = `<span>${t('form.start')}</span>${ICON.right}`;
  $('resume').innerHTML = answered > 0 && answered < QUESTIONS.length ? `
    <div class="resume">
      <p>${esc(saved.meta.name)} · ${answered} ${t('test.of')} ${QUESTIONS.length}</p>
      <a class="btn btn-block" href="/test">${t('form.resume', { n: Math.min(answered + 1, QUESTIONS.length) })}</a>
    </div>` : '';
}

const form = $('form');
if (saved?.meta?.name) $('name').value = saved.meta.name;
if (saved?.meta?.surname) $('surname').value = saved.meta.surname;

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('name').value.trim(), surname = $('surname').value.trim(), grade = $('grade').value, track = $('track').value;
  const bad = { 'f-name': !name, 'f-surname': !surname, 'f-grade': !grade, 'f-track': !track };
  for (const [id, b] of Object.entries(bad)) $(id).toggleAttribute('data-invalid', b);
  const first = Object.entries(bad).find(([, b]) => b);
  if (first) return $(first[0]).querySelector('.input').focus();
  clear();
  save({ meta: { name, surname, grade, track }, answers: {}, i: 0, seen: {} });
  location.href = '/test';
});
form.addEventListener('input', e => e.target.closest('.field')?.removeAttribute('data-invalid'));

applyStatic();
render();
mountLangSwitch();
watchSegs();
onLang(render);
