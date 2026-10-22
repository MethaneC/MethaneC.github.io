'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

async function main() {
  const base = path.resolve(__dirname, '..');
  const output = path.join(base, 'public');
  const results = path.join(base, 'test-results');
  fs.mkdirSync(results, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(path.join(base, '.cache/manifest.json'), 'utf8'));
  const mime = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif' };
  const server = http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); } catch { response.writeHead(400).end(); return; }
    if (!pathname.startsWith(manifest.root)) { response.writeHead(404).end(); return; }
    let relative = pathname.slice(manifest.root.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const absolute = path.resolve(output, relative);
    if (!absolute.startsWith(output + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', mime[path.extname(absolute)] || 'application/octet-stream');
    fs.createReadStream(absolute).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = `http://127.0.0.1:${server.address().port}`;
  const installed = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => p && fs.existsSync(p));
  const browser = await chromium.launch({ ...(installed ? { executablePath: installed } : {}), headless: true });
  const errors = [], failures = [], external = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await context.route('**/*', route => {
    if (!route.request().url().startsWith(address)) { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  const goto = async url => { await page.goto(address + url, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
  try {
    await goto(manifest.root);
    const home = manifest.pages.find(note => note.source === 'index.md');
    assert.ok(home, 'The editable Markdown homepage must exist');
    assert.equal(await page.locator('.post-title').innerText(), home.title);
    assert.equal(await page.locator('.post-body .markdown-reading-view').count(), 1);
    assert.equal(await page.locator('.note-home, .home-intro, .home-note-list').count(), 0);
    assert.equal(await page.locator('link[href$="/assets/home.css"]').count(), 0);
    assert.equal(await page.locator('.post-body .is-unresolved').count(), 0);
    await page.screenshot({ path: path.join(results, 'home-desktop.png'), fullPage: true });
    await page.locator('.theme-toggle').click();
    await page.screenshot({ path: path.join(results, 'home-dark.png'), fullPage: true });
    await page.locator('.theme-toggle').click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: path.join(results, 'home-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await goto(manifest.root + 'posts/');
    const excerpts = await page.locator('.post-body').allTextContents();
    assert.ok(excerpts.every(text => text.trim() === ''), 'The optional post list has no excerpts');
    const note = manifest.notes.find(n => n.source === 'Manifold.md');
    assert.ok(note, 'Manifold reference note must exist');
    await goto(note.url);
    assert.equal(await page.locator('.post-toc').count(), 0, 'Article table of contents is disabled');
    assert.equal(await page.locator('body.sidebar-active').count(), 0, 'The sidebar does not open automatically');
    assert.equal(await page.locator('.callout[data-callout="math"]').count(), 17);
    assert.equal(await page.locator('mjx-container').count() > 70, true);
    assert.equal(await page.locator('mjx-merror').count(), 0);
    const colors = await page.evaluate(() => ({
      label: getComputedStyle(document.querySelector('.callout-title-inner > strong')).color,
      rule: getComputedStyle(document.querySelector('.callout[data-callout="math"]')).borderLeftWidth,
      key: getComputedStyle(document.querySelector('.callout-title-inner > strong:not(:first-child)') || document.querySelectorAll('.callout-title-inner > strong')[1]).color,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      formulas: document.querySelectorAll('mjx-container').length
    }));
    assert.equal(colors.label, 'rgb(53, 94, 133)');
    assert.equal(colors.key, 'rgb(152, 81, 59)');
    assert.equal(colors.rule, '2px');
    assert.equal(colors.overflow, false);
    await page.screenshot({ path: path.join(results, 'manifold-desktop.png'), fullPage: true });
    await page.locator('.theme-toggle').click();
    assert.equal(await page.evaluate(() => document.body.classList.contains('theme-dark')), true);
    await page.screenshot({ path: path.join(results, 'manifold-dark.png'), fullPage: true });
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.header').isVisible(), false);
    assert.equal(await page.locator('.theme-toggle').isVisible(), false);
    const printLabel = await page.locator('.callout-title-inner > strong').first().evaluate(el => getComputedStyle(el).color);
    assert.equal(printLabel, 'rgb(53, 94, 133)');
    await page.screenshot({ path: path.join(results, 'manifold-print.png'), fullPage: true });
    await page.emulateMedia({ media: 'screen' });
    await page.locator('.theme-toggle').click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(results, 'manifold-mobile.png'), fullPage: true });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) {
      console.log('Mobile overflow:', await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => ({ tag: el.tagName, cls: el.className?.baseVal ?? el.className, right: el.getBoundingClientRect().right, width: el.getBoundingClientRect().width })).filter(el => el.right > innerWidth + 1).slice(0, 12)));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    const demo = manifest.notes.find(n => n.source === '兼容性示例.md');
    if (demo) {
      await goto(demo.url);
      assert.equal(await page.locator('.post-toc').count(), 0);
      assert.equal(await page.locator('body.sidebar-active').count(), 0);
      const folded = page.locator('.callout[data-callout="math"].is-collapsible').first();
      assert.equal(await folded.locator(':scope > .callout-content').isVisible(), false);
      await folded.locator(':scope > .callout-title').click();
      assert.equal(await folded.locator(':scope > .callout-content').isVisible(), true);
      await folded.locator(':scope > .callout-title').focus();
      await page.keyboard.press('Enter');
      assert.equal(await folded.locator(':scope > .callout-content').isVisible(), false);
      await page.getByRole('button', { name: '全部展开' }).click();
      assert.equal(await folded.locator(':scope > .callout-content').isVisible(), true);
      assert.equal(await page.locator('.markdown-rendered').innerText().then(text => text.includes('这条 Obsidian 注释')), false);
      assert.equal(await page.locator('.is-unresolved').count(), 0);
      assert.ok((await page.locator('pre').innerText()).includes('[[Manifold]]'));
      assert.equal(await page.locator('.footnotes').count(), 1);
      assert.equal(await page.locator('.callout-title-inner .footnotes').count(), 0);
      await page.screenshot({ path: path.join(results, 'compatibility-mobile.png'), fullPage: true });
      await page.locator('.sidebar-toggle').click();
      assert.equal(await page.locator('.sidebar').isVisible(), true);
      await page.locator('.sidebar-toggle').click();
      assert.equal(await page.locator('.sidebar').isVisible(), false);
    }
    await goto(manifest.root + 'tags/');
    await goto(manifest.root + 'archives/');
    if (errors.length || failures.length || external.length) console.log(JSON.stringify({ errors, failures, external }, null, 2));
    assert.deepEqual(errors, [], 'Browser JavaScript errors');
    assert.deepEqual(failures, [], 'Missing local resources');
    assert.deepEqual(external, [], 'Site must work with all external requests blocked');
    const report = { root: manifest.root, checks: 'desktop, mobile, light/dark, print, folding, keyboard, code, comments, fonts, offline resources', colors, errors, failures, external };
    fs.writeFileSync(path.join(results, 'browser-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await context.close(); await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
