// Career test: static pages plus a tiny JSON-file store for submitted answers.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QUESTIONS } from './public/data/questions.js';
import { COUNTRIES, GRADES } from './public/data/countries.js';

const ROOT = fileURLToPath(new URL('./public/', import.meta.url));
const DATA = process.env.DATA_DIR || fileURLToPath(new URL('./data/', import.meta.url));
const PORT = Number(process.env.PORT) || 3030;
const HOST = process.env.HOST || '127.0.0.1';
const ID = /^[A-Za-z0-9_-]{12}$/;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json',
};
const PAGES = { '/': 'index.html', '/test': 'test.html', '/results': 'results.html' };

await mkdir(DATA, { recursive: true });

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type, 'x-content-type-options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

// Trust boundary: everything the client sends is checked against the question bank.
function validate(b) {
  if (!b || typeof b !== 'object') return 'body';
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name || name.length > 60) return 'name';
  if (!GRADES.includes(b.grade)) return 'grade';
  if (!(b.country in COUNTRIES) || !COUNTRIES[b.country].intake) return 'country';
  if (b.lang !== 'ru' && b.lang !== 'en') return 'lang';
  const a = b.answers;
  if (!a || typeof a !== 'object') return 'answers';
  for (const q of QUESTIONS) {
    const v = a[q.id], max = q.part === 'sjt' ? q.options.length - 1 : 5, min = q.part === 'sjt' ? 0 : 1;
    if (!Number.isInteger(v) || v < min || v > max) return `answer ${q.id}`;
  }
  return { name, grade: b.grade, country: b.country, lang: b.lang, answers: Object.fromEntries(QUESTIONS.map(q => [q.id, a[q.id]])) };
}

async function readBody(req, limit = 64 * 1024) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > limit) throw new Error('too large'); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function serveFile(res, rel, status = 200) {
  const path = normalize(join(ROOT, rel));
  if (!path.startsWith(ROOT)) return send(res, 404, 'Not found', 'text/plain');
  try {
    send(res, status, await readFile(path), TYPES[extname(path)] || 'application/octet-stream');
  } catch {
    rel === '404.html' ? send(res, 404, 'Not found', 'text/plain') : serveFile(res, '404.html', 404);
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  try {
    if (pathname === '/api/results' && req.method === 'POST') {
      const r = validate(await readBody(req));
      if (typeof r === 'string') return send(res, 400, { error: `invalid ${r}` });
      const id = randomBytes(9).toString('base64url');
      await writeFile(join(DATA, `${id}.json`), JSON.stringify({ id, createdAt: new Date().toISOString(), ...r }));
      return send(res, 201, { id });
    }
    const api = pathname.match(/^\/api\/results\/([^/]+)$/);
    if (api && req.method === 'GET') {
      if (!ID.test(api[1])) return send(res, 404, { error: 'not found' });
      try { return send(res, 200, await readFile(join(DATA, `${api[1]}.json`))); }
      catch { return send(res, 404, { error: 'not found' }); }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
    if (PAGES[pathname]) return serveFile(res, PAGES[pathname]);
    if (/^\/results\/[A-Za-z0-9_-]+$/.test(pathname)) return serveFile(res, 'results.html');
    return serveFile(res, pathname.slice(1));
  } catch (e) {
    send(res, 400, { error: e.message === 'too large' ? 'too large' : 'bad request' });
  }
}).listen(PORT, HOST, () => console.log(`career test on http://${HOST}:${PORT}`));
