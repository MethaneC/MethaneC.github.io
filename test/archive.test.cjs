'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { unescapeHTML } = require('hexo-util');
const { renderFolderArchive } = require('../lib/archive.cjs');

test('archive groups nested source folders and sorts notes by name rather than date', () => {
  const notes = [
    { source: 'Manifold/B.md', title: 'B', url: '/notes/Manifold/B/', date: '2020-01-01' },
    { source: 'Root.md', title: 'Root', url: '/notes/Root/' },
    { source: 'Manifold/A.md', title: 'A', url: '/notes/Manifold/A/', date: '2026-01-01' },
    { source: 'FunAna/Hilbert/Space.md', title: 'Space', url: '/notes/FunAna/Hilbert/Space/' },
    { source: '_posts/Legacy.md', title: 'Legacy', url: '/notes/Legacy/' }
  ];
  const html = renderFolderArchive(notes);
  assert.match(html, /FunAna/);
  assert.match(html, /Hilbert/);
  assert.match(html, /Manifold/);
  assert.match(html, /根目录/);
  assert.ok(html.indexOf('FunAna') < html.indexOf('Manifold'));
  assert.ok(html.indexOf('>A</a>') < html.indexOf('>B</a>'));
  assert.doesNotMatch(html, /2020|2026|<time|_posts/);
  for (const note of notes) assert.ok(unescapeHTML(html).includes(`href="${note.url}"`));
  assert.equal(renderFolderArchive([...notes].reverse()), html);
});

test('archive escapes names and preserves encoded links and project subpaths', () => {
  const html = renderFolderArchive([
    { source: '<folder>/数学.md', title: '<script>&"', url: '/blog/notes/%3Cfolder%3E/%E6%95%B0%E5%AD%A6/' }
  ]);
  assert.match(html, /&lt;folder&gt;/);
  assert.match(html, /&lt;script&gt;&amp;&quot;/);
  assert.match(unescapeHTML(html), /href="\/blog\/notes\/%3Cfolder%3E\/%E6%95%B0%E5%AD%A6\/"/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(renderFolderArchive([]), /暂无笔记/);
});
