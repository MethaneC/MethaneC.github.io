'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { renderFolderArchive } = require('../lib/archive.cjs');

hexo.extend.generator.register('folder-archive', () => {
  // Read on every generation so live additions, moves and deletions are reflected.
  const manifest = JSON.parse(fs.readFileSync(path.join(hexo.base_dir, '.cache/manifest.json'), 'utf8'));
  return {
    path: 'archives/index.html',
    layout: 'page',
    data: {
      title: '归档',
      type: 'folder-archive',
      archive: true,
      toc: { enable: false },
      content: renderFolderArchive(manifest.notes)
    }
  };
});
