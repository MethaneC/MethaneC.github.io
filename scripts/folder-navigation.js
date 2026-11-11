'use strict';
const { createFolderNavigation } = require('../lib/navigation.cjs');
const generatePosts = hexo.extend.generator.get('post');

// Keep Hexo's normal routes and layouts, replacing only the date-based links.
hexo.extend.generator.register('post', async function(locals) {
  const routes = await generatePosts.call(this, locals);
  const notes = routes.filter(route => route.data?.obsidian_source).map(({ data }) => ({
    source: data.obsidian_source,
    title: data.title,
    path: data.path
  }));
  const navigation = createFolderNavigation(notes);
  for (const route of routes) {
    const links = navigation.get(route.data?.obsidian_source);
    if (!links) continue;
    route.data.prev = links.previous;
    route.data.next = links.next;
  }
  return routes;
});
