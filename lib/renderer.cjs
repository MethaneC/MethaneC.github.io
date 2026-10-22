'use strict';
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const { createMath } = require('./math.cjs');
const { createLinks, slug, external, decode } = require('./links.cjs');
const { stripComments } = require('./comments.cjs');

function createRenderer(manifest = { root: '/', notes: [], assets: [] }) {
  const math = createMath(manifest.root || '/');
  const links = createLinks(manifest);
  const md = new MarkdownIt({ html: true, breaks: true, linkify: true, typographer: false,
    highlight(str, language) {
      return language && hljs.getLanguage(language) ? hljs.highlight(str, { language, ignoreIllegals: true }).value : '';
    }
  }).use(require('markdown-it-footnote')).use(require('markdown-it-mark')).use(require('markdown-it-task-lists'));
  const esc = md.utils.escapeHtml;

  function diagnostic(env, target) {
    const warning = `${env.source || 'note'}: unresolved or ambiguous link "${target}"`;
    if (env.warnings && !env.warnings.includes(warning)) env.warnings.push(warning);
  }

  function embeddedNote(found, env) {
    const stack = env.embedStack || [env.source];
    if (stack.includes(found.item.source) || stack.length >= 6) {
      return `<a class="internal-link embed-cycle" href="${esc(found.url)}">${esc(found.item.title)} (嵌入循环，点击阅读)</a>`;
    }
    let body = found.item.body || '';
    if (found.fragment.startsWith('^')) {
      const id = found.fragment.slice(1);
      body = body.split(/\n\s*\n/).find(block => block.includes('^' + id)) || '';
    } else if (found.fragment) {
      const lines = body.split('\n');
      const start = lines.findIndex(line => /^#{1,6}\s/.test(line) && slug(line.replace(/^#+\s+/, '')) === slug(found.fragment));
      if (start >= 0) {
        const level = lines[start].match(/^#+/)[0].length;
        let end = start + 1;
        while (end < lines.length && !(new RegExp(`^#{1,${level}}\\s`)).test(lines[end])) end++;
        body = lines.slice(start, end).join('\n');
      } else body = '';
    }
    return `<div class="markdown-embed"><div class="markdown-embed-title"><a href="${esc(found.url)}">${esc(found.item.title)}</a></div>${md.render(stripComments(body), { ...env, footnotes: undefined, headingCounts: new Map(), source: found.item.source, embedStack: [...stack, found.item.source] })}</div>`;
  }

  function wiki(raw, embed, env) {
    const separator = raw.indexOf('|');
    const target = separator < 0 ? raw : raw.slice(0, separator);
    const alias = separator < 0 ? '' : raw.slice(separator + 1);
    const found = links.resolve(target, env.source, 'note');
    if (embed) {
      if (found) return embeddedNote(found, env);
      const asset = links.resolve(target, env.source, 'asset');
      if (asset) {
        const size = alias.match(/^(\d+)(?:x(\d+))?$/);
        const dimensions = size ? ` width="${size[1]}"${size[2] ? ` height="${size[2]}"` : ''}` : '';
        const url = esc(asset.url);
        if (/\.(?:png|jpe?g|gif|svg|webp|avif|bmp)(?:#.*)?$/i.test(target)) return `<img class="internal-embed" src="${url}" alt="${esc(size ? target : alias || target)}"${dimensions} loading="lazy">`;
        if (/\.pdf(?:#.*)?$/i.test(target)) return `<object class="pdf-embed" data="${url}" type="application/pdf"><a href="${url}">${esc(alias || target)}</a></object>`;
        if (/\.(mp3|ogg|wav|m4a)$/i.test(target)) return `<audio controls src="${url}"></audio>`;
        if (/\.(mp4|webm)$/i.test(target)) return `<video controls src="${url}"></video>`;
        return `<a class="internal-link" href="${url}">${esc(alias || target)}</a>`;
      }
    }
    if (found) return `<a class="internal-link" href="${esc(found.url)}">${esc(alias || target || found.item.title)}</a>`;
    const asset = links.resolve(target, env.source, 'asset');
    if (asset) return `<a class="internal-link" href="${esc(asset.url)}">${esc(alias || target)}</a>`;
    diagnostic(env, target);
    return `<span class="internal-link is-unresolved" title="目标不存在或文件名重复">${esc(alias || target)}</span>`;
  }

  md.inline.ruler.before('escape', 'obsidian_math', (state, silent) => {
    const start = state.pos;
    if (state.src[start] !== '$' || state.src[start + 1] === '$' || /\s/.test(state.src[start + 1] || '')) return false;
    let end = start + 1;
    while ((end = state.src.indexOf('$', end)) >= 0) {
      let slashes = 0;
      for (let i = end - 1; i >= 0 && state.src[i] === '\\'; i--) slashes++;
      if (slashes % 2 === 0 && !/\s/.test(state.src[end - 1]) && !/\d/.test(state.src[end + 1] || '')) break;
      end++;
    }
    if (end < 0) return false;
    if (!silent) { const token = state.push('math_inline', 'math', 0); token.content = state.src.slice(start + 1, end); }
    state.pos = end + 1;
    return true;
  });
  md.renderer.rules.math_inline = (tokens, i) => math.render(tokens[i].content, false);
  md.renderer.rules.math_block = (tokens, i) => `<div class="math-block">${math.render(tokens[i].content, true)}</div>\n`;
  md.block.ruler.before('fence', 'obsidian_math_block', (state, start, end, silent) => {
    const first = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]);
    if (!first.startsWith('$$')) return false;
    if (silent) return true;
    let content = first.slice(2);
    let next = start + 1;
    if (content.trimEnd().endsWith('$$')) content = content.trimEnd().slice(0, -2);
    else {
      const parts = [content];
      let closed = false;
      for (; next < end; next++) {
        const line = state.src.slice(state.bMarks[next] + state.tShift[next], state.eMarks[next]);
        if (line.trimEnd().endsWith('$$')) { parts.push(line.trimEnd().slice(0, -2)); next++; closed = true; break; }
        parts.push(line);
      }
      if (!closed) return false;
      content = parts.join('\n');
    }
    const token = state.push('math_block', 'math', 0); token.block = true; token.content = content.trim(); token.map = [start, next];
    state.line = next;
    return true;
  }, { alt: ['paragraph', 'blockquote', 'list'] });

  md.inline.ruler.before('link', 'obsidian_wiki', (state, silent) => {
    const tail = state.src.slice(state.pos);
    const match = tail.match(/^(!?)\[\[([^\]\n]+)\]\]/);
    if (!match) return false;
    if (!silent) { const token = state.push('html_inline', '', 0); token.content = wiki(match[2], Boolean(match[1]), state.env); }
    state.pos += match[0].length;
    return true;
  });
  md.block.ruler.before('paragraph', 'obsidian_embed', (state, start, end, silent) => {
    const line = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]).trim();
    const match = line.match(/^!\[\[([^\]\n]+)\]\]$/);
    if (!match || !links.resolve(match[1].split('|')[0], state.env.source, 'note')) return false;
    if (silent) return true;
    const token = state.push('html_block', '', 0); token.content = wiki(match[1], true, state.env) + '\n'; token.map = [start, start + 1];
    state.line = start + 1; return true;
  });
  // Comments are token rules rather than whole-document substitutions: fenced code and TeX are untouched.
  md.inline.ruler.before('text', 'obsidian_comment', (state, silent) => {
    if (state.src.slice(state.pos, state.pos + 2) !== '%%') return false;
    const end = state.src.indexOf('%%', state.pos + 2);
    if (end < 0) return false;
    state.pos = end + 2; return true;
  });
  md.block.ruler.before('fence', 'obsidian_comment_block', (state, start, end, silent) => {
    const offset = state.bMarks[start] + state.tShift[start];
    if (state.src.slice(offset, offset + 2) !== '%%') return false;
    const close = state.src.indexOf('%%', offset + 2);
    if (close < 0) return false;
    let next = start;
    while (next < end && state.eMarks[next] < close + 2) next++;
    if (next >= end) return false;
    if (state.src.slice(close + 2, state.eMarks[next]).trim()) return false;
    if (silent) return true;
    state.line = next + 1;
    return true;
  }, { alt: ['paragraph', 'blockquote', 'list'] });

  md.core.ruler.after('inline', 'obsidian_structure', state => {
    const tokens = state.tokens;
    const headingCounts = state.env.headingCounts || (state.env.headingCounts = new Map());
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'heading_open') {
        const base = slug(tokens[i + 1].content);
        const count = headingCounts.get(base) || 0;
        headingCounts.set(base, count + 1);
        token.attrSet('id', base + (count ? '-' + count : ''));
      }
      if (token.type === 'inline') {
        const match = token.content.match(/(?:^|\s)\^([\w-]+)\s*$/);
        if (match) {
          const last = token.children[token.children.length - 1];
          if (last?.type === 'text' && last.content.endsWith(match[0])) {
            last.content = last.content.slice(0, -match[0].length);
            const anchor = new state.Token('html_inline', '', 0);
            anchor.content = `<span id="block-${esc(match[1])}" class="block-id"></span>`;
            token.children.push(anchor);
          }
        }
      }
      if (token.type !== 'blockquote_open' || tokens[i + 1]?.type !== 'paragraph_open' || tokens[i + 2]?.type !== 'inline') continue;
      const inline = tokens[i + 2];
      const match = inline.content.match(/^\[!([\w-]+)\]([+-])?\s*([^\n]*)(?:\n([\s\S]*))?$/);
      if (!match) continue;
      let depth = 0, close;
      for (close = i; close < tokens.length; close++) { if (tokens[close].type === 'blockquote_open') depth++; else if (tokens[close].type === 'blockquote_close' && --depth === 0) break; }
      const type = match[1].toLowerCase(), folded = Boolean(match[2]), collapsed = match[2] === '-';
      const title = match[3] || (type === 'math' ? 'Math' : type.charAt(0).toUpperCase() + type.slice(1));
      const titleTokens = [];
      md.inline.parse(title, md, state.env, titleTokens);
      const titleHtml = md.renderer.renderInline(titleTokens, md.options, state.env);
      const arrow = folded ? '<span class="callout-fold" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m5 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>' : '';
      token.type = 'html_block'; token.tag = ''; token.nesting = 0;
      token.content = `<div class="callout${folded ? ' is-collapsible' : ''}${collapsed ? ' is-collapsed' : ''}" data-callout="${esc(type)}"${folded ? ` data-callout-fold="${match[2]}"` : ''}><div class="callout-title"${folded ? ` role="button" tabindex="0" aria-expanded="${!collapsed}"` : ''}>${arrow}<div class="callout-title-inner">${titleHtml}</div></div><div class="callout-content"${collapsed ? ' hidden' : ''}>\n`;
      tokens[close].type = 'html_block'; tokens[close].tag = ''; tokens[close].nesting = 0; tokens[close].content = '</div></div>\n';
      if (match[4]) {
        inline.content = match[4]; inline.children = [];
        md.inline.parse(inline.content, md, state.env, inline.children);
      } else { tokens.splice(i + 1, 3); }
    }
  });

  const defaultLink = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx], href = token.attrGet('href');
    if (href && !external(href) && !href.startsWith('#')) {
      const found = links.resolve(href, env.source, 'note') || links.resolve(href, env.source, 'asset');
      if (found) { token.attrSet('href', found.url); token.attrJoin('class', 'internal-link'); }
      else if (!href.startsWith('/')) { diagnostic(env, href); token.attrJoin('class', 'is-unresolved'); }
    } else if (href?.startsWith('#')) token.attrSet('href', '#' + (href.startsWith('#^') ? 'block-' + href.slice(2) : slug(decode(href.slice(1)))));
    return defaultLink(tokens, idx, options, env, self);
  };
  const defaultImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx], src = token.attrGet('src');
    if (src && !external(src)) {
      const found = links.resolve(src, env.source, 'asset');
      if (found) token.attrSet('src', found.url); else diagnostic(env, src);
    }
    token.attrSet('loading', 'lazy');
    return defaultImage(tokens, idx, options, env, self);
  };
  return { render(text, env = {}) { return md.render(stripComments(text), { ...env, headingCounts: new Map() }); }, mathCss: () => math.css() };
}
module.exports = { createRenderer };
