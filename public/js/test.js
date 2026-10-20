import { t, L, count, getLang, applyStatic, mountLangSwitch, onLang, brandHTML } from './i18n.js';
import { esc, load, save, clear, PARTS, ICON, watchSegs } from './ui.js';
import { QUESTIONS } from '../data/questions.js';

const state = load();
if (!state?.meta) location.replace('/');
state.answers ||= {};
state.seen ||= {};
const N = QUESTIONS.length;
const $ = id => document.getElementById(id);
const LETTERS = ['A', 'B', 'C', 'D'];
let i = Math.min(state.i ?? 0, N - 1);
let mode = state.seen[QUESTIONS[i].part] ? 'q' : 'intro'; // 'intro' | 'q' | 'send' | 'error'
let busy = false;

const q = () => QUESTIONS[i];
const done = () => Object.keys(state.answers).length;
const persist = () => { state.i = i; save(state); };

function progress() {
  $('prog').innerHTML = `
    <div class="prog-head"><span>${t('test.partOf', { n: PARTS.indexOf(q().part) + 1 })}</span><span class="num"><b>${done()}</b> / ${N}</span></div>
    <div class="prog-segs">
      ${PARTS.map(p => {
        const items = QUESTIONS.filter(x => x.part === p), a = items.filter(x => state.answers[x.id] != null).length;
        const st = p === q().part ? 'current' : a === items.length ? 'done' : 'todo';
        return `<div class="prog-seg" data-state="${st}"><div class="bar"><i style="--v:${(100 * a) / items.length}%;width:var(--v)"></i></div><span>${t(`part.${p}`)}</span></div>`;
      }).join('')}
    </div>`;
}

function stage(animate) {
  const cur = q(), part = cur.part, el = $('stage');
  if (mode === 'intro') {
    const n = PARTS.indexOf(part) + 1;
    el.innerHTML = `
      <div class="intro ${animate ? 'q-enter' : ''}">
        <span class="n">0${n}</span>
        <p class="kicker">${t('test.partOf', { n })}</p>
        <h1>${t(`part.${part}`)}</h1>
        <p>${t(`intro.${part}`)}</p>
        <div class="meta"><span class="chip">${count(QUESTIONS.filter(x => x.part === part).length, 'q')}</span></div>
        <div><button class="btn btn-lg" data-act="begin">${t('test.begin')} ${ICON.right}</button></div>
      </div>`;
  } else if (mode === 'send' || mode === 'error') {
    el.innerHTML = mode === 'send'
      ? `<div class="sending"><div class="spinner" aria-hidden="true"></div><p>${t('test.sending')}</p></div>`
      : `<div class="sending"><p>${t('test.sendError')}</p><button class="btn" data-act="retry">${t('test.retry')}</button></div>`;
  } else {
    const a = state.answers[cur.id];
    const body = part === 'sjt'
      ? `<h1 class="q-situation">${esc(L(cur.text))}</h1>
         <div class="opts" role="group" aria-label="${t('ask.sjt')}">
           ${cur.options.map((o, k) => `<button type="button" data-v="${k}" aria-pressed="${a === k}"><span>${LETTERS[k]}</span>${esc(L(o.text))}</button>`).join('')}
         </div>`
      : `<h1>${esc(L(cur.title || cur.text))}</h1>
         ${cur.title ? `<p class="sub">${esc(L(cur.text))}</p>` : ''}
         <div class="scale">
           <div class="scale-ends" aria-hidden="true"><span>${t(`lo.${part}`)}</span><span>${t(`hi.${part}`)}</span></div>
           <div class="scale-btns" role="group" aria-label="${t(`ask.${part}`)}">
             ${[1, 2, 3, 4, 5].map(v => `<button type="button" data-v="${v}" aria-pressed="${a === v}" aria-label="${v}${v === 1 ? `, ${t(`lo.${part}`)}` : v === 5 ? `, ${t(`hi.${part}`)}` : ''}">${v}</button>`).join('')}
           </div>
         </div>`;
    el.innerHTML = `
      <div class="q ${animate ? 'q-enter' : ''}">
        <p class="ask"><span class="num">${i + 1} / ${N}</span> · ${t(`ask.${part}`)}</p>
        ${body}
      </div>`;
  }
}

function foot() {
  const quiz = mode === 'q';
  $('foot').innerHTML = mode === 'send' || mode === 'error' ? '' : `
    <button class="btn btn-ghost" data-act="back" ${i === 0 && mode === 'intro' ? 'disabled' : ''}>${ICON.left}<span>${t('test.back')}</span></button>
    <p class="hint">${quiz ? t(q().part === 'sjt' ? 'test.keysSjt' : 'test.keys') : t('test.saved')}</p>
    <button class="btn btn-ghost" data-act="next" ${quiz && state.answers[q().id] != null ? '' : 'disabled'}><span>${t('test.next')}</span>${ICON.right}</button>`;
}

function render(animate = false) {
  document.title = `${i + 1}/${N} · ${t('brand.title')}`;
  document.querySelector('[data-brand]').innerHTML = brandHTML();
  progress();
  stage(animate);
  foot();
}

function go(to, animate) {
  if (to >= N) return submit();
  const prevPart = q().part;
  i = Math.max(0, to);
  mode = q().part !== prevPart && !state.seen[q().part] ? 'intro' : 'q';
  persist();
  render(animate);
}

function next(animate) {
  if (mode === 'intro') { state.seen[q().part] = true; mode = 'q'; persist(); return render(animate); }
  if (state.answers[q().id] == null) return;
  if (i === N - 1 || done() === N) {
    const gap = QUESTIONS.findIndex(x => state.answers[x.id] == null);
    return gap < 0 ? submit() : go(gap, animate);
  }
  go(i + 1, animate);
}

function back(animate) {
  if (mode === 'intro') { if (i > 0) { i--; mode = 'q'; persist(); render(animate); } return; }
  if (i > 0) go(i - 1, animate);
}

// Keyboard answers swap instantly; pointer answers hold the pressed state for a beat, then move on.
function answer(v, viaKey) {
  if (busy) return;
  state.answers[q().id] = v;
  persist();
  $('stage').querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.v) === v)));
  foot();
  progress();
  busy = true;
  setTimeout(() => { busy = false; next(!viaKey); }, viaKey ? 90 : 220);
}

async function submit() {
  mode = 'send';
  render();
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...state.meta, lang: getLang(), answers: state.answers }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const { id } = await res.json();
    save({ id, name: state.meta.name }, 'cana:last');
    clear();
    location.href = `/results/${id}`;
  } catch {
    mode = 'error';
    render();
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  if (b.dataset.v != null && mode === 'q') return answer(Number(b.dataset.v), e.detail === 0);
  const act = b.dataset.act, kb = e.detail === 0;
  if (act === 'begin') next(!kb);
  else if (act === 'next') next(!kb);
  else if (act === 'back') back(!kb);
  else if (act === 'retry') submit();
});

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, select, textarea')) return;
  if (mode === 'intro' && e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); return next(false); }
  if (mode !== 'q') { if (e.key === 'ArrowLeft') back(false); return; }
  const sjt = q().part === 'sjt';
  const k = e.key.toUpperCase();
  if (!sjt && /^[1-5]$/.test(k)) answer(Number(k), true);
  else if (sjt && LETTERS.includes(k)) answer(LETTERS.indexOf(k), true);
  else if (sjt && /^[1-4]$/.test(k)) answer(Number(k) - 1, true);
  else if (e.key === 'ArrowRight') next(false);
  else if (e.key === 'ArrowLeft') back(false);
});

applyStatic();
render(false);
mountLangSwitch();
watchSegs();
onLang(() => render(false));
