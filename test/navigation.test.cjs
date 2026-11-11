'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createFolderNavigation } = require('../lib/navigation.cjs');

test('navigation wraps within the exact folder using the archive name order', () => {
  const notes = [
    { source: 'Math/10.md', title: 'Chapter 10', path: 'notes/Math/10/', date: '2026-01-01' },
    { source: 'Math/2.md', title: 'Chapter 2', path: 'notes/Math/2/', date: '2020-01-01' },
    { source: 'Math/1.md', title: 'Chapter 1', path: 'notes/Math/1/' },
    { source: 'Math/Sub/1.md', title: 'Chapter 1', path: 'notes/Math/Sub/1/' }
  ];
  const nav = createFolderNavigation(notes);
  assert.equal(nav.get('Math/1.md').previous.path, 'notes/Math/10/');
  assert.equal(nav.get('Math/1.md').next.path, 'notes/Math/2/');
  assert.equal(nav.get('Math/2.md').previous.path, 'notes/Math/1/');
  assert.equal(nav.get('Math/2.md').next.path, 'notes/Math/10/');
  assert.equal(nav.get('Math/10.md').next.path, 'notes/Math/1/');
  assert.deepEqual(nav.get('Math/Sub/1.md'), { previous: null, next: null });
  assert.deepEqual(createFolderNavigation([]), new Map());
});

test('root notes share a cycle, duplicate titles are stable, and two notes point to each other', () => {
  const notes = [
    { source: '_posts/B.md', title: 'Same', path: 'notes/B/' },
    { source: 'A.md', title: 'Same', path: 'notes/A/' }
  ];
  for (const ordered of [notes, [...notes].reverse()]) {
    const nav = createFolderNavigation(ordered);
    assert.deepEqual(nav.get('A.md'), {
      previous: { title: 'Same', path: 'notes/B/' },
      next: { title: 'Same', path: 'notes/B/' }
    });
    assert.equal(nav.get('_posts/B.md').previous.path, 'notes/A/');
    assert.equal(nav.get('_posts/B.md').next.path, 'notes/A/');
  }
});
