'use strict';

// Remove Obsidian comments before paragraph splitting, while leaving code and TeX literal.
function stripComments(source) {
  let out = '', i = 0;
  const escaped = position => {
    let count = 0;
    for (let n = position - 1; n >= 0 && source[n] === '\\'; n--) count++;
    return count % 2 === 1;
  };
  while (i < source.length) {
    if (i === 0 || source[i - 1] === '\n') {
      const fence = source.slice(i).match(/^[ \t>]*(?:[-*+] )?(`{3,}|~{3,})[^\n]*(?:\n|$)/);
      if (fence) {
        const close = new RegExp('^[ \\t>]*' + (fence[1][0] === '`' ? '`' : '~') + '{' + fence[1].length + ',}[ \\t]*(?:\\n|$)', 'gm');
        close.lastIndex = i + fence[0].length;
        const match = close.exec(source);
        const end = match ? match.index + match[0].length : source.length;
        out += source.slice(i, end); i = end; continue;
      }
    }
    if (source[i] === '\\' && i + 1 < source.length) { out += source.slice(i, i + 2); i += 2; continue; }
    if (source[i] === '`') {
      const ticks = source.slice(i).match(/^`+/)[0];
      const close = source.indexOf(ticks, i + ticks.length);
      if (close >= 0) { const end = close + ticks.length; out += source.slice(i, end); i = end; continue; }
    }
    if (source[i] === '$' && !/\s/.test(source[i + 1] || '')) {
      const delimiter = source[i + 1] === '$' ? '$$' : '$';
      let close = i + delimiter.length;
      while ((close = source.indexOf(delimiter, close)) >= 0) {
        if (!escaped(close) && (delimiter === '$$' || (!/\s/.test(source[close - 1]) && !/\d/.test(source[close + 1] || '')))) break;
        close += delimiter.length;
      }
      if (close >= 0) { const end = close + delimiter.length; out += source.slice(i, end); i = end; continue; }
    }
    if (source.slice(i, i + 2) === '%%') {
      const close = source.indexOf('%%', i + 2);
      if (close >= 0) { out += source.slice(i, close + 2).replace(/[^\n]/g, ''); i = close + 2; continue; }
    }
    out += source[i++];
  }
  return out;
}
module.exports = { stripComments };
