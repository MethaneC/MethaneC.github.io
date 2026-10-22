const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRenderer } = require('../lib/renderer.cjs');

const manifest = {
  root: '/blog/',
  notes: [
    { source: '几何/Manifold.md', title: 'Manifold', url: '/blog/notes/几何/Manifold/' },
    { source: '几何/Other.md', title: 'Other', url: '/blog/notes/几何/Other/' },
    { source: '代数/Other.md', title: 'Other', url: '/blog/notes/代数/Other/' }
  ],
  assets: [{ source: '附件/diagram.svg', url: '/blog/attachments/附件/diagram.svg' }]
};
const render = (text, source = '几何/Manifold.md') => createRenderer(manifest).render(text, { source });

test('math callout title, body, lists and nested folding preserve structure', () => {
  const html = render('>[!math] **Definition:** $X_1$ 是 **流形**\n>\n> 1. first\n> 2. second\n>\n> >[!note]- Proof\n> > body');
  assert.match(html, /data-callout="math"/);
  assert.match(html, /callout-title-inner[^>]*><strong>Definition:<\/strong>/);
  assert.match(html, /mjx-container/);
  assert.match(html, /<ol>/);
  assert.match(html, /data-callout="note"/);
  assert.match(html, /is-collapsed/);
  assert.doesNotMatch(html, /\[!math\]/);
});

test('TeX is protected from Markdown and Obsidian syntax', () => {
  const html = render('$a_*b* + \\{x\\} + [[A]]$\n\n> [!math] Formula\n> $$\n> \\mathrm{supp}f=\\overline{\\{p:f(p)\\ne 0\\}}\n> $$');
  assert.equal((html.match(/<mjx-container/g) || []).length, 2);
  assert.doesNotMatch(html, /<em>/);
  assert.doesNotMatch(html, /internal-link/);
  assert.doesNotMatch(html, /data-mjx-error|mjx-merror/);
});

test('code stays literal, highlights, comments, tasks and footnotes work', () => {
  const html = render('`[[Other]] $x$ ==literal==`\n\n```text\n>[!math] $x$ [[Other]]\n```\n\n==remember== %%hidden%%\n\n- [x] done\n\nText[^1]\n\n[^1]: Footnote');
  assert.match(html, /<code>\[\[Other\]\] \$x\$ ==literal==<\/code>/);
  assert.match(html, /<mark>remember<\/mark>/);
  assert.doesNotMatch(html, /hidden/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /footnote/);
});

test('wikilinks resolve relative duplicates and headings; attachments keep dimensions', () => {
  const html = render('[[Other#Heading|see]] ![[附件/diagram.svg|400]] [other](Other.md#Heading)');
  assert.match(html, /href="\/blog\/notes\/几何\/Other\/#Heading"/);
  assert.match(html, />see<\/a>/);
  assert.match(html, /src="\/blog\/attachments\/附件\/diagram.svg"/);
  assert.match(html, /width="400"/);
  assert.doesNotMatch(html, /href="Other.md/);
});

test('missing and ambiguous links are explicit, invalid links never become unsafe URLs', () => {
  assert.match(render('[[Missing]]'), /is-unresolved/);
  assert.match(render('[[Other]]', 'root.md'), /is-unresolved/);
  assert.doesNotMatch(render('[[javascript:alert(1)]]'), /href="javascript:/);
});

test('heading IDs, block IDs and embedded notes resolve without recursive loops', () => {
  const renderer = createRenderer({ ...manifest, notes: manifest.notes.map(n => ({ ...n, body: n.title === 'Other' ? '## Heading\n\nEmbedded text ^block' : '![[Other]]' })) });
  const html = renderer.render('## 标题与公式 $x$\n\nparagraph ^block\n\n![[Other#Heading]]', { source: '几何/Manifold.md' });
  assert.match(html, /id="标题与公式-x"/);
  assert.match(html, /id="block-block"/);
  assert.match(html, /Embedded text/);
  assert.match(html, /markdown-embed/);
});

test('Obsidian comments spanning blank lines are completely omitted', () => {
  const html = render('before\n\n%%\nsecret one\n\nsecret two\n%%\n\nafter\n\n```text\n%% literal comment %%\n```');
  assert.doesNotMatch(html, /secret one|secret two/);
  assert.match(html, /before/);
  assert.match(html, /after/);
  assert.match(html, /%% literal comment %%/);
  const middle = render('before %%secret one\n\nsecret two%% after');
  assert.doesNotMatch(middle, /secret one|secret two/);
  assert.match(middle, /before/);
  assert.match(middle, /after/);
});

test('vault-root Markdown links and images respect repository subpaths', () => {
  const html = render('[other](/几何/Other.md#Heading) ![diagram](/附件/diagram.svg)');
  assert.match(html, /href="\/blog\/notes\/几何\/Other\/#Heading"/);
  assert.match(html, /src="\/blog\/attachments\/附件\/diagram.svg"/);
  assert.doesNotThrow(() => render('[invalid](#%E0%A4%A)'));
});

test('a document footnote appears once, never inside callout titles', () => {
  const html = render('>[!math] **Definition:** $X$\n> body\n\n>[!note] More\n> text\n\nText[^1]\n\n[^1]: reference');
  assert.equal((html.match(/class="footnotes"/g) || []).length, 1);
  assert.equal((html.match(/class="footnote-item"/g) || []).length, 1);
  assert.doesNotMatch(html, /callout-title-inner[^]*?<section[^]*?<\/div><\/div><div class="callout-content"/);
});
