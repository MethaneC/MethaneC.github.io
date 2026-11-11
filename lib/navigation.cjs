'use strict';
const path = require('node:path');
const { compareNotes } = require('./archive.cjs');

function createFolderNavigation(notes) {
  const folders = new Map();
  for (const note of notes) {
    const folder = path.posix.dirname(note.source.replace(/^_posts\//, ''));
    if (!folders.has(folder)) folders.set(folder, []);
    folders.get(folder).push(note);
  }
  const navigation = new Map();
  const reference = note => ({ title: note.title, path: note.path });
  for (const entries of folders.values()) {
    entries.sort(compareNotes);
    entries.forEach((note, index) => {
      navigation.set(note.source, {
        previous: entries.length > 1 ? reference(entries[(index + entries.length - 1) % entries.length]) : null,
        next: entries.length > 1 ? reference(entries[(index + 1) % entries.length]) : null
      });
    });
  }
  return navigation;
}

module.exports = { createFolderNavigation };
