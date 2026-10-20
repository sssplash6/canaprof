// Small shared helpers: escaping, saved progress, segmented controls, icons.
export const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const PARTS = ['interest', 'personality', 'values', 'skills', 'sjt'];

const KEY = 'cana:progress';
export function load(key = KEY) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
export function save(v, key = KEY) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}
export function clear(key = KEY) {
  try { localStorage.removeItem(key); } catch {}
}

// Segmented controls: the pressed button decides where the ::before indicator sits.
function syncSeg(el, animate) {
  const b = el.querySelector('[aria-pressed="true"]');
  if (!b) return;
  el.classList.toggle('no-anim', !animate);
  el.style.setProperty('--x', `${b.offsetLeft}px`);
  el.style.setProperty('--w', `${b.offsetWidth}px`);
}
export function watchSegs() {
  const ro = new ResizeObserver(es => es.forEach(e => syncSeg(e.target, false)));
  const adopt = () => document.querySelectorAll('.seg').forEach(s => {
    if (s.dataset.seen) return;
    s.dataset.seen = '1';
    ro.observe(s);
    syncSeg(s, false);
  });
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === 'attributes') { const s = m.target.closest('.seg'); if (s) syncSeg(s, true); }
    }
    adopt();
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed'] });
  adopt();
  document.fonts?.ready.then(() => document.querySelectorAll('.seg').forEach(s => syncSeg(s, false)));
}

const svg = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICON = {
  right: svg('<path d="M3 8h10M9 4l4 4-4 4"/>'),
  left: svg('<path d="M13 8H3M7 4 3 8l4 4"/>'),
  share: svg('<path d="M8 10V2M5 5l3-3 3 3M3 9v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9"/>'),
  download: svg('<path d="M8 2v8M5 7l3 3 3-3M3 13h10"/>'),
  chev: svg('<path d="m4 6 4 4 4-4"/>'),
};
