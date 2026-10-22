const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { prepare } = require('../lib/prepare.cjs');
const { parseNote } = require('../lib/prepare.cjs');

test('empty YAML frontmatter is not part of the note body', () => {
  assert.equal(parseNote('---\n---\n# Note').body, '# Note');
});

test('source/index.md is an editable root page, not an archived note', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-home-'));
  try {
    fs.mkdirSync(path.join(base, 'source'));
    const original = '---\ntitle: My directory\n---\n## Geometry\n\n- [[Manifold]]';
    fs.writeFileSync(path.join(base, 'source/index.md'), original);
    fs.writeFileSync(path.join(base, 'source/Manifold.md'), 'Notes');
    const manifest = prepare(base, { root: '/blog/' });
    assert.equal(manifest.notes.length, 1);
    assert.equal(manifest.pages[0].url, '/blog/');
    assert.equal(manifest.pages[0].source, 'index.md');
    assert.ok(fs.existsSync(path.join(base, '.cache/source/index.md')));
    assert.ok(!fs.existsSync(path.join(base, '.cache/source/_posts/index.md')));
    assert.match(fs.readFileSync(path.join(base, '.cache/source/index.md'), 'utf8'), /layout: page/);
    assert.equal(fs.readFileSync(path.join(base, 'source/index.md'), 'utf8'), original);
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

test('unchanged source, empty metadata, nested notes, attachments and deletion', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-next-'));
  try {
    fs.mkdirSync(path.join(base, 'source', '数学'), { recursive: true });
    const original = '---\ntitle:\ndate:\ntags:\n---\n\n>[!math] **Definition:** $X$';
    fs.writeFileSync(path.join(base, 'source', '数学', 'Manifold.md'), original);
    fs.writeFileSync(path.join(base, 'source', '图.svg'), '<svg/>');
    fs.writeFileSync(path.join(base, 'source', 'hidden.md'), '---\npublish: false\n---\nsecret');
    const result = prepare(base, { root: '/notes/' });
    assert.equal(result.notes.length, 1);
    assert.equal(result.notes[0].title, 'Manifold');
    assert.equal(result.notes[0].url, '/notes/notes/%E6%95%B0%E5%AD%A6/Manifold/');
    assert.equal(fs.readFileSync(path.join(base, 'source', '数学', 'Manifold.md'), 'utf8'), original);
    const staged = fs.readFileSync(path.join(base, '.cache/source/_posts/数学/Manifold.md'), 'utf8');
    assert.match(staged, /title: Manifold/);
    assert.match(staged, /\[!math\]/);
    assert.ok(fs.existsSync(path.join(base, '.cache/source/attachments/图.svg')));
    fs.unlinkSync(path.join(base, 'source', '图.svg'));
    fs.unlinkSync(path.join(base, 'source', '数学', 'Manifold.md'));
    prepare(base);
    assert.ok(!fs.existsSync(path.join(base, '.cache/source/attachments/图.svg')));
    assert.ok(!fs.existsSync(path.join(base, '.cache/source/_posts/数学/Manifold.md')));
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

test('editing a linked or embedded target invalidates other staged notes', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-next-'));
  try {
    fs.mkdirSync(path.join(base, 'source'), { recursive: true });
    fs.writeFileSync(path.join(base, 'source', 'A.md'), '[[B]] ![[B]]');
    fs.writeFileSync(path.join(base, 'source', 'B.md'), 'first version');
    prepare(base);
    const staged = path.join(base, '.cache/source/_posts/A.md');
    const first = fs.readFileSync(staged, 'utf8');
    prepare(base);
    assert.equal(fs.readFileSync(staged, 'utf8'), first, 'no changes must not cause a rebuild loop');
    fs.writeFileSync(path.join(base, 'source', 'B.md'), 'second version');
    prepare(base);
    assert.notEqual(fs.readFileSync(staged, 'utf8'), first, 'dependent posts must be rerendered');
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
