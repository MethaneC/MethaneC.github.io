'use strict';
const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');
const yaml = require('js-yaml');
const { prepare, rootPath } = require('../lib/prepare.cjs');
const base = path.resolve(__dirname, '..');
const command = process.argv[2] || 'build';

async function main() {
  if (command === 'clean') {
    for (const name of ['public', '.cache/source']) {
      const target = path.resolve(base, name);
      if (!target.startsWith(base + path.sep)) throw new Error('Invalid cleanup target');
      fs.rmSync(target, { recursive: true, force: true });
    }
    fs.rmSync(path.join(base, 'db.json'), { force: true });
    console.log('Generated site and database cleared. Your source notes are unchanged.');
    return;
  }
  const config = yaml.load(fs.readFileSync(path.join(base, '_config.yml'), 'utf8'));
  const root = rootPath(process.env.SITE_ROOT || config.root || '/');
  const overrides = { root, url: process.env.SITE_URL || config.url };
  fs.mkdirSync(path.join(base, '.cache'), { recursive: true });
  fs.writeFileSync(path.join(base, '.cache/deploy.yml'), yaml.dump(overrides));
  // Serve the exact fonts used by the build-time MathJax renderer, without a CDN.
  const fonts = path.join(base, 'site/vendor/mathjax/woff-v2');
  fs.mkdirSync(fonts, { recursive: true });
  fs.cpSync(path.join(path.dirname(require.resolve('mathjax-full/package.json')), 'es5/output/chtml/fonts/woff-v2'), fonts, { recursive: true });
  const vendors = path.join(base, 'site/vendor');
  const fontawesome = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
  fs.cpSync(path.join(fontawesome, 'css'), path.join(vendors, 'fontawesome/css'), { recursive: true });
  fs.cpSync(path.join(fontawesome, 'webfonts'), path.join(vendors, 'fontawesome/webfonts'), { recursive: true });
  for (const [pkg, file, destination] of [
    ['mathjax-full', 'LICENSE', 'mathjax/LICENSE.txt'],
    ['@fortawesome/fontawesome-free', 'LICENSE.txt', 'fontawesome/LICENSE.txt']
  ]) {
    const license = path.join(path.dirname(require.resolve(pkg + '/package.json')), file);
    if (fs.existsSync(license)) fs.copyFileSync(license, path.join(vendors, destination));
  }
  const manifest = prepare(base, { root });
  console.log(`Prepared ${manifest.notes.length} notes and ${manifest.assets.length} attachments (${root}).`);
  // A fresh process must pick up renderer/config changes, not reuse cached rendered HTML.
  fs.rmSync(path.join(base, 'db.json'), { force: true });
  const hexo = new Hexo(base, { config: '_config.yml,.cache/deploy.yml', silent: false });
  await hexo.init();
  if (command === 'build') {
    // Clean output first so deleted notes never survive a new build.
    const output = path.resolve(base, 'public');
    if (!output.startsWith(base + path.sep)) throw new Error('Invalid output path');
    fs.rmSync(output, { recursive: true, force: true });
    await hexo.call('generate', { force: true });
    await hexo.exit();
  } else if (command === 'server') {
    await hexo.call('server', { port: Number(process.env.PORT || 4000), ip: '127.0.0.1' });
    let pending;
    const watcher = require('chokidar').watch([path.join(base, 'source'), path.join(base, 'site')], { ignoreInitial: true, ignored: /(^|[/\\])\./ });
    watcher.on('all', () => {
      clearTimeout(pending);
      pending = setTimeout(() => {
        try { prepare(base, { root }); console.log('Source synchronized.'); } catch (error) { console.error(error.message); }
      }, 150);
    });
    const close = async () => { clearTimeout(pending); await watcher.close(); await hexo.unwatch(); await hexo.exit(); process.exit(0); };
    process.once('SIGINT', close); process.once('SIGTERM', close);
  } else throw new Error(`Unknown command: ${command}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
