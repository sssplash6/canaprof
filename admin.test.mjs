// Starts the real server on a scratch data dir and checks the admin gate end to end.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { QUESTIONS } from './public/data/questions.js';

const PORT = 3099, base = `http://127.0.0.1:${PORT}`, DATA_DIR = await mkdtemp(join(tmpdir(), 'canaprof-'));
const start = env => new Promise((ok, fail) => {
  const p = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT, DATA_DIR, ...env } });
  p.stdout.once('data', () => ok(p));
  p.once('exit', code => fail(new Error(`server exited ${code}`)));
});
const basic = pw => ({ authorization: `Basic ${Buffer.from(`admin:${pw}`).toString('base64')}` });

// Without ADMIN_PASSWORD the admin area does not exist.
let server = await start({ ADMIN_PASSWORD: '' });
assert.equal((await fetch(`${base}/admin`)).status, 404);
server.kill();
await new Promise(r => server.once('exit', r));

server = await start({ ADMIN_PASSWORD: 'correct horse' });
try {
  const answers = Object.fromEntries(QUESTIONS.map((q, i) => [q.id, q.part === 'sjt' ? 0 : 1 + (i % 5)]));
  const submit = body => fetch(`${base}/api/results`, { method: 'POST', body: JSON.stringify({ name: 'Ali', grade: '9', lang: 'ru', answers, ...body }) });
  assert.equal((await submit({ grade: 'uni' })).status, 400); // grades are 7-11 only
  const post = await submit({}); // the form no longer asks for a country
  assert.equal(post.status, 201);
  const { id } = await post.json();

  for (const path of ['/admin', '/admin.html', '/api/admin/results']) {
    assert.equal((await fetch(base + path)).status, 401, `${path} without login`);
    assert.equal((await fetch(base + path, { headers: basic('wrong') })).status, 401, `${path} wrong password`);
  }
  assert.equal((await fetch(`${base}/admin`, { headers: basic('correct horse') })).status, 200);

  const rows = await (await fetch(`${base}/api/admin/results`, { headers: basic('correct horse') })).json();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, id);
  assert.equal(rows[0].grade, '9');
  assert.equal(rows[0].country, 'uz');
  assert.match(rows[0].code, /^[RIASEC]{3}$/);
  assert.equal(rows[0].top.length, 3);
  assert.equal(rows[0].answers, undefined); // the list carries summaries, not raw answers
  console.log('admin: ok');
} finally {
  server.kill();
  await rm(DATA_DIR, { recursive: true, force: true });
}
