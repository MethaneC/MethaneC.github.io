'use strict';
const { escapeHTML } = require('hexo-util');
const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'variant' });
const compare = (a, b) => collator.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0);
const compareNotes = (a, b) => compare(a.title, b.title) || compare(a.source, b.source);

function renderFolderArchive(notes) {
  const tree = { folders: new Map(), notes: [] };
  for (const note of notes) {
    // _posts is a Hexo input convention, not a subject folder.
    const parts = note.source.replace(/^_posts\//, '').split('/');
    parts.pop();
    let folder = tree;
    for (const name of parts) {
      if (!folder.folders.has(name)) folder.folders.set(name, { folders: new Map(), notes: [] });
      folder = folder.folders.get(name);
    }
    folder.notes.push(note);
  }
  const links = entries => [...entries].sort(compareNotes)
    .map(note => `<li><a href="${escapeHTML(note.url)}">${escapeHTML(note.title)}</a></li>`).join('\n');
  const folders = node => [...node.folders].sort(([a], [b]) => compare(a, b)).map(([name, child]) =>
    `<li class="archive-folder"><span class="archive-folder-name"><i class="fa fa-folder-open" aria-hidden="true"></i> ${escapeHTML(name)}</span>\n<ul>${folders(child)}${links(child.notes)}</ul></li>`
  ).join('\n');
  if (!notes.length) return '<p>暂无笔记。</p>';
  const rootNotes = tree.notes.length ? `<li class="archive-folder"><span class="archive-folder-name">根目录</span><ul>${links(tree.notes)}</ul></li>` : '';
  return `<ul class="folder-archive">${folders(tree)}${rootNotes}</ul>`;
}

module.exports = { renderFolderArchive, compareNotes };
