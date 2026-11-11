'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRenderer } = require('../lib/renderer.cjs');
const manifest = {
  root: '/blog/',
  notes: [{ source: 'Math/Space.md', title: 'Space', url: '/blog/notes/Math/Space/', body: 'A space.' }],
  assets: [{ source: 'figure.svg', url: '/blog/attachments/figure.svg' }]
};
const render = text => createRenderer(manifest).render(text, { source: 'Math/Space.md' });

test('wikilink aliases render inline math with mixed text and keep their target', () => {
  const html = render('[[Space#Definition|空间 $X_1$ 与 $\\mathbb{R}^n$]]');
  assert.match(html, /<a class="internal-link" href="\/blog\/notes\/Math\/Space\/#Definition">空间 <mjx-container/);
  assert.equal((html.match(/<mjx-container/g) || []).length, 2);
  assert.doesNotMatch(html, /\$|mjx-merror/);
});

test('math aliases work on asset and missing links while HTML and nested links remain literal', () => {
  const html = render('[[figure.svg|$f$]] [[Missing|$x$]] [[Space|<img src=x onerror=alert(1)> $y$ [link](https://example.com)]]');
  assert.equal((html.match(/<mjx-container/g) || []).length, 3);
  assert.match(html, /href="\/blog\/attachments\/figure.svg"/);
  assert.match(html, /class="internal-link is-unresolved"/);
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img|href="https:/);
  assert.equal((html.match(/<a /g) || []).length, 2);
});

test('math aliases preserve literal dollars and code while supporting TeX brackets and vertical bars', () => {
  const html = render('[[Space|$\\lVert x\\rVert + |y|$]] [[Space|$A[0]+B[1]$]] [[Space|cost \\$5]]\n\n`[[Space|$x$]]`');
  assert.equal((html.match(/<mjx-container/g) || []).length, 2);
  assert.match(html, /cost \$5/);
  assert.match(html, /<code>\[\[Space\|\$x\$\]\]<\/code>/);
  assert.doesNotMatch(html, /mjx-merror/);
});
