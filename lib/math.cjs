'use strict';
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { CHTML } = require('mathjax-full/js/output/chtml.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

function createMath(root = '/') {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const output = new CHTML({ fontURL: root + 'vendor/mathjax/woff-v2', adaptiveCSS: false });
  const doc = mathjax.document('', { InputJax: new TeX({ packages: AllPackages.filter(p => !['require', 'autoload'].includes(p)), tags: 'none' }), OutputJax: output });
  const cache = new Map();
  return {
    render(tex, display) {
      const key = `${display}:${tex}`;
      if (!cache.has(key)) {
        const node = doc.convert(tex, { display, em: 16, ex: 8, containerWidth: 800 });
        const html = adaptor.outerHTML(node);
        if (/data-mjx-error|mjx-merror/.test(html)) throw new Error(`Invalid TeX: ${tex}`);
        cache.set(key, html);
      }
      return cache.get(key);
    },
    css() { return adaptor.textContent(output.styleSheet(doc)); }
  };
}
module.exports = { createMath };
