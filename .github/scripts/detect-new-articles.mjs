#!/usr/bin/env node
// Which articles were added to search-index.js between two versions of the file?
//   node detect-new-articles.mjs <old-file> <new-file>
// Prints a JSON array of the added entries, or [] when there are none.
//
// The index is evaluated rather than pattern-matched, so template literals,
// escapes and reordered entries are all handled the way the browser handles them.

import { readFileSync, existsSync } from 'node:fs';

function load(path) {
  if (!path || !existsSync(path)) return [];
  const src = readFileSync(path, 'utf8');
  if (!src.trim()) return [];
  try {
    const read = new Function(`${src}\n;return typeof searchIndex !== 'undefined' ? searchIndex : [];`);
    const out = read();
    return Array.isArray(out) ? out : [];
  } catch (e) {
    console.error(`Could not parse ${path}: ${e.message}`);
    process.exit(1);
  }
}

// Internal links are extensionless sitewide; compare forgivingly regardless.
const key = (u) =>
  String(u || '')
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/\.html$/i, '')
    .replace(/\/+$/, '')
    .replace(/^\/*/, '/')
    .toLowerCase();

const isArticle = (u) => /^\/articles\/./.test(key(u));

const [, , oldPath, newPath] = process.argv;
if (!newPath) {
  console.error('Usage: detect-new-articles.mjs <old-file> <new-file>');
  process.exit(2);
}

const before = new Set(load(oldPath).map((a) => key(a && a.url)));
const added = load(newPath)
  .filter((a) => a && a.url && isArticle(a.url) && !before.has(key(a.url)))
  .map((a) => ({
    url: key(a.url),
    title: String(a.title || '').trim(),
    excerpt: String(a.excerpt || '').trim(),
    date: String(a.date || '').trim(),
  }));

process.stdout.write(JSON.stringify(added));
