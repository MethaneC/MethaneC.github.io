'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createRenderer } = require('../lib/renderer.cjs');
const { url_for } = require('hexo-util');
let renderer;
const warnings = [];
hexo.extend.filter.register('before_generate', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(hexo.base_dir, '.cache/manifest.json'), 'utf8'));
  renderer = createRenderer(manifest);
  warnings.length = 0;
}, 1);
const renderNote = function(data, options) {
  if (!renderer) {
    const manifest = JSON.parse(fs.readFileSync(path.join(hexo.base_dir, '.cache/manifest.json'), 'utf8'));
    renderer = createRenderer(manifest);
  }
  const original = options?.obsidian_source || data.path?.replace(/\\/g, '/').split(/(?:^|\/)\_posts\//).pop() || '';
  const html = renderer.render(data.text, { source: original, warnings });
  return `<div class="markdown-reading-view"><div class="markdown-preview-view markdown-rendered">${html}</div></div>`;
};
renderNote.disableNunjucks = true;
hexo.extend.renderer.register('md', 'html', renderNote, true);
hexo.extend.filter.register('before_post_render', data => {
  // Hexo passes the complete post as renderer options; retain its source identity for links.
  if (data.obsidian_source) data.markdown = { ...(data.markdown || {}), obsidian_source: data.obsidian_source };
  return data;
});
hexo.extend.filter.register('after_post_render', data => {
  // A nonempty HTML comment selects NexT's excerpt branch without falling back to the full article.
  data.excerpt = '<!-- Home page lists article titles only. -->';
  return data;
});
hexo.extend.generator.register('obsidian-math-css', () => ({ path: 'assets/mathjax.css', data: renderer.mathCss() }));
hexo.extend.filter.register('after_generate', () => {
  for (const warning of new Set(warnings)) hexo.log.warn(warning);
});
hexo.extend.injector.register('head_end', function() {
  const url = file => url_for.call(hexo, file);
  return `<link rel="stylesheet" href="${url('/assets/obsidian-base.css')}">\n<link rel="stylesheet" href="${url('/assets/obsidian-theme.css')}">\n<link rel="stylesheet" href="${url('/assets/mathjax.css')}">\n<link rel="stylesheet" href="${url('/assets/bridge.css')}">`;
});
hexo.extend.injector.register('body_end', function() {
  return `<script defer src="${url_for.call(hexo, '/assets/notes.js')}"></script>`;
});
