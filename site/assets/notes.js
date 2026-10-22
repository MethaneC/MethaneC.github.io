'use strict';
(() => {
  const root = document.documentElement;
  const applyTheme = mode => {
    root.dataset.noteTheme = mode;
    document.body.classList.toggle('theme-dark', mode === 'dark');
    document.body.classList.toggle('theme-light', mode !== 'dark');
  };
  applyTheme(root.dataset.noteTheme || 'light');
  const themeButton = document.createElement('button');
  themeButton.className = 'theme-toggle';
  themeButton.type = 'button';
  themeButton.textContent = '明 / 暗';
  themeButton.setAttribute('aria-label', '切换明暗主题');
  themeButton.addEventListener('click', () => {
    const mode = root.dataset.noteTheme === 'dark' ? 'light' : 'dark';
    applyTheme(mode); localStorage.setItem('note-color-mode', mode);
  });
  document.body.append(themeButton);
  const fold = (callout, collapsed) => {
    callout.classList.toggle('is-collapsed', collapsed);
    const title = callout.querySelector(':scope > .callout-title');
    const content = callout.querySelector(':scope > .callout-content');
    title.setAttribute('aria-expanded', String(!collapsed));
    content.hidden = collapsed;
  };
  document.querySelectorAll('.callout.is-collapsible').forEach(callout => {
    const title = callout.querySelector(':scope > .callout-title');
    const toggle = () => fold(callout, !callout.classList.contains('is-collapsed'));
    title.addEventListener('click', event => { if (!event.target.closest('a')) toggle(); });
    title.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
  });
  const article = document.querySelector('.post-body .markdown-reading-view');
  if (article && !document.querySelector('.posts-expand.index')) {
    const collapsible = article.querySelectorAll('.callout.is-collapsible');
    if (collapsible.length) {
      const controls = document.createElement('div'); controls.className = 'note-controls';
      for (const [text, collapsed] of [['全部展开', false], ['全部折叠', true]]) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
        button.addEventListener('click', () => collapsible.forEach(callout => fold(callout, collapsed)));
        controls.append(button);
      }
      article.before(controls);
    }
  }
  const revealAnchor = () => {
    if (!location.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.matches('.callout.is-collapsible.is-collapsed')) fold(parent, false);
    }
    target.scrollIntoView();
  };
  addEventListener('hashchange', revealAnchor); revealAnchor();
})();
