'use strict';
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { createHash } = require('node:crypto');

function walk(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    const relative = prefix + entry.name;
    return entry.isDirectory() ? walk(path.join(dir, entry.name), relative + '/') : entry.isFile() ? [relative] : [];
  }).sort();
}

function parseNote(raw) {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n(?:([\s\S]*?)\r?\n)?---(?:\r?\n|$)/);
  return match ? { meta: yaml.load(match[1]) || {}, body: raw.replace(/^\uFEFF/, '').slice(match[0].length) } : { meta: {}, body: raw };
}

function writeChanged(file, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buffer)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
}

const encodePath = value => value.split('/').map(encodeURIComponent).join('/');
const rootPath = value => '/' + (value || '').split('/').filter(Boolean).join('/') + ((value || '').split('/').filter(Boolean).length ? '/' : '');

function prepare(base, options = {}) {
  const source = path.join(base, 'source');
  const target = path.resolve(base, '.cache/source');
  const root = rootPath(options.root);
  const expected = new Set();
  const pending = new Map();
  const manifest = { root, notes: [], pages: [], assets: [] };
  const inputs = walk(source).map(relative => ({ relative, content: fs.readFileSync(path.join(source, relative)) }));
  const digest = createHash('sha256').update(root);
  for (const { relative, content } of inputs) digest.update(relative).update('\0').update(content).update('\0');
  const revision = digest.digest('hex');
  const write = (relative, content) => {
    if (expected.has(relative)) throw new Error(`Duplicate output path: ${relative}. Rename one source note.`);
    expected.add(relative);
    pending.set(relative, content);
  };
  for (const { relative, content } of inputs) {
    const file = path.join(source, relative);
    if (/\.md$/i.test(relative)) {
      const raw = content.toString('utf8');
      let parsed;
      try { parsed = parseNote(raw); } catch (error) { throw new Error(`${relative}: invalid YAML: ${error.message}`); }
      const { meta, body } = parsed;
      if (meta.publish === false || meta.published === false || meta.draft === true || relative.startsWith('_drafts/')) continue;
      const stats = fs.statSync(file);
      const notePath = relative.replace(/^_posts\//, '').replace(/\.md$/i, '');
      const title = String(meta.title || path.posix.basename(notePath));
      const date = meta.date || '2000-01-01 00:00:00';
      const isHome = relative === 'index.md';
      const route = isHome ? '' : 'notes/' + notePath + '/';
      const data = { ...meta, title, date, updated: meta.updated || stats.mtime.toISOString(),
        layout: isHome ? 'page' : 'post', permalink: route, obsidian_source: relative, obsidian_revision: revision, mathjax: false };
      if (data.tags == null) data.tags = [];
      if (data.categories == null) data.categories = [];
      // A stable fallback date avoids Git checkout times changing the order on every build.
      write(isHome ? 'index.md' : '_posts/' + notePath + '.md', '---\n' + yaml.dump(data, { lineWidth: -1 }) + '---\n' + body);
      (isHome ? manifest.pages : manifest.notes).push({ source: relative, title, url: root + encodePath(route), body, aliases: meta.aliases || [] });
    } else {
      write('attachments/' + relative, content);
      manifest.assets.push({ source: relative, url: root + 'attachments/' + encodePath(relative) });
    }
  }
  for (const relative of walk(path.join(base, 'site'))) write(relative, fs.readFileSync(path.join(base, 'site', relative)));
  // Publish the complete resolver manifest before Hexo's watcher sees staged note updates.
  writeChanged(path.join(base, '.cache/manifest.json'), JSON.stringify(manifest, null, 2));
  for (const [relative, content] of pending) writeChanged(path.join(target, relative), content);
  // Only remove stale generated files under this project's staging directory.
  for (const relative of walk(target)) {
    const absolute = path.resolve(target, relative);
    if (!absolute.startsWith(target + path.sep)) throw new Error('Invalid staging path');
    if (!expected.has(relative)) fs.unlinkSync(absolute);
  }
  return manifest;
}

module.exports = { prepare, parseNote, walk, writeChanged, encodePath, rootPath };
