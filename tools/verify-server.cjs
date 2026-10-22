'use strict';
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

async function main() {
  const base = path.resolve(__dirname, '..');
  const name = 'verification-' + randomUUID();
  const folder = path.join(base, 'source', name);
  if (fs.existsSync(folder)) throw new Error('Fixture folder already exists');
  fs.mkdirSync(folder);
  fs.writeFileSync(path.join(folder, 'A.md'), '![[B]]\n\n[[C]]');
  fs.writeFileSync(path.join(folder, 'B.md'), 'first-version');
  const reservation = net.createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, [path.join(base, 'tools/run.cjs'), 'server'], {
    cwd: base, windowsHide: true, env: { ...process.env, PORT: String(port), SITE_ROOT: '/repository-test/' }, stdio: ['ignore', 'pipe', 'pipe']
  });
  let log = '';
  child.stdout.on('data', data => { log += data; }); child.stderr.on('data', data => { log += data; });
  const address = `http://127.0.0.1:${port}/repository-test/notes/${name}/A/`;
  async function waitFor(check, label) {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      try { const response = await fetch(address); const html = await response.text(); if (check(response, html)) return html; } catch { /* wait for startup / rebuild */ }
      if (child.exitCode != null) throw new Error(`Preview exited: ${log}`);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    throw new Error(`Timed out: ${label}\n${log}`);
  }
  try {
    await waitFor((response, html) => response.status === 200 && html.includes('first-version') && html.includes('is-unresolved'), 'initial embed and missing link');
    fs.writeFileSync(path.join(folder, 'B.md'), 'second-version');
    fs.writeFileSync(path.join(folder, 'C.md'), 'newly-added-target');
    const updated = await waitFor((response, html) => html.includes('second-version') && html.includes(`/repository-test/notes/${name}/C/`) && !html.includes('first-version'), 'dependent embed and link refresh');
    assert.ok(!updated.includes('class="internal-link is-unresolved"'), 'new target must resolve in A');
    fs.unlinkSync(path.join(folder, 'B.md'));
    await waitFor((response, html) => html.includes('is-unresolved') && !html.includes('second-version'), 'deleted embed target refresh');
    fs.unlinkSync(path.join(folder, 'A.md'));
    await waitFor(response => response.status === 404, 'deleted note disappears');
    console.log('PASS: live source add/edit/delete, dependent links and embeds, repository subpath.');
  } finally {
    const exited = new Promise(resolve => child.once('exit', resolve));
    child.kill();
    if (child.exitCode == null) await exited;
    const absolute = path.resolve(folder);
    if (!absolute.startsWith(path.resolve(base, 'source') + path.sep) || path.basename(absolute) !== name) throw new Error('Invalid fixture cleanup path');
    fs.rmSync(absolute, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
