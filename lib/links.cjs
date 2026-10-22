'use strict';
const path = require('node:path').posix;
const slug = text => text.replace(/\$([^$]*)\$/g, '$1').replace(/<[^>]*>/g, '').replace(/[*`~\[\]]/g, '').trim().replace(/\s+/g, '-');
const external = value => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
const decode = value => { try { return decodeURIComponent(value); } catch { return value; } };

function createLinks(manifest) {
  const notes = [...(manifest.notes || []), ...(manifest.pages || [])];
  const assets = manifest.assets || [];
  function resolve(raw, source, kind) {
    let target = decode(raw).replace(/\\/g, '/');
    const hashAt = target.indexOf('#');
    const fragment = hashAt < 0 ? '' : target.slice(hashAt + 1);
    target = hashAt < 0 ? target : target.slice(0, hashAt);
    const list = kind === 'asset' ? assets : notes;
    const normalize = s => kind === 'asset' ? s : s.replace(/\.md$/i, '');
    let item;
    if (!target && kind !== 'asset') item = notes.find(n => n.source === source);
    const local = path.normalize(path.join(path.dirname(source || ''), target));
    if (!item) item = list.find(n => normalize(n.source) === normalize(local));
    if (!item) item = list.find(n => normalize(n.source) === normalize(target.replace(/^\//, '')));
    if (!item) {
      const candidates = list.filter(n => normalize(path.basename(n.source)) === normalize(target)
        || (kind !== 'asset' && (Array.isArray(n.aliases) ? n.aliases : [n.aliases]).includes(target)));
      if (candidates.length === 1) item = candidates[0];
    }
    const anchor = fragment ? '#' + (fragment.startsWith('^') ? 'block-' + fragment.slice(1) : slug(fragment)) : '';
    return item ? { item, url: item.url + anchor, fragment } : null;
  }
  return { resolve };
}
module.exports = { createLinks, slug, external, decode };
