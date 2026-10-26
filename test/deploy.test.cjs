'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('deploy saves source to main, publishes pages, and skips empty commits', () => {
  const cache = path.join(__dirname, '../.cache');
  fs.mkdirSync(cache, { recursive: true });
  const root = fs.mkdtempSync(path.join(cache, 'deploy-test-'));
  const repo = path.join(root, 'source');
  const remote = path.join(root, 'remote.git');
  function git(args, cwd = repo) {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  }
  function deploy(...args) {
    const result = spawnSync(process.execPath, ['tools/deploy.cjs', '--skip-build', ...args], { cwd: repo, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  try {
    fs.mkdirSync(repo);
    git(['init', '--bare', remote], root);
    git(['init', '-b', 'main']);
    git(['config', 'user.name', 'Deploy Test']);
    git(['config', 'user.email', 'test@example.invalid']);
    git(['remote', 'add', 'origin', remote]);
    fs.mkdirSync(path.join(repo, 'tools'));
    fs.copyFileSync(path.join(__dirname, '../tools/deploy.cjs'), path.join(repo, 'tools/deploy.cjs'));
    fs.mkdirSync(path.join(repo, 'test'));
    fs.writeFileSync(path.join(repo, 'test/smoke.test.cjs'), "require('node:test').test('fixture', () => {});\n");
    fs.writeFileSync(path.join(repo, '.gitignore'), 'public/\n.cache/\n');
    fs.writeFileSync(path.join(repo, 'note.md'), 'original');
    git(['add', '.']);
    git(['commit', '-m', 'Initial source']);
    git(['push', 'origin', 'main']);
    git(['push', 'origin', 'HEAD:gh-pages']);
    fs.mkdirSync(path.join(repo, 'public'));
    fs.writeFileSync(path.join(repo, 'public/index.html'), 'new website');
    fs.writeFileSync(path.join(repo, 'note.md'), 'updated');
    deploy('--prepare-only');
    assert.notEqual(git(['status', '--porcelain']), '');
    assert.equal(git(['show', 'main:note.md'], remote), 'original');
    deploy();
    assert.equal(git(['show', 'main:note.md'], remote), 'updated');
    assert.equal(git(['show', 'gh-pages:index.html'], remote), 'new website');
    assert.equal(git(['status', '--porcelain']), '');
    const head = git(['rev-parse', 'HEAD']);
    deploy();
    assert.equal(git(['rev-parse', 'HEAD']), head);
    git(['checkout', '-b', 'other']);
    const rejected = spawnSync(process.execPath, ['tools/deploy.cjs', '--skip-build'], { cwd: repo, encoding: 'utf8' });
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /main/);
    git(['checkout', 'main']);
    const pagesHead = git(['rev-parse', 'gh-pages'], remote);
    git(['update-ref', 'refs/heads/main', pagesHead], remote);
    fs.writeFileSync(path.join(repo, 'public/index.html'), 'must not publish');
    fs.writeFileSync(path.join(repo, 'note.md'), 'concurrent update');
    const failedPush = spawnSync(process.execPath, ['tools/deploy.cjs', '--skip-build'], { cwd: repo, encoding: 'utf8' });
    assert.notEqual(failedPush.status, 0);
    assert.equal(git(['rev-parse', 'gh-pages'], remote), pagesHead);
  } finally {
    // Git processes and Windows file scanners may briefly retain directory handles.
    // Retry transient EBUSY/EPERM errors instead of failing on the first attempt.
    const target = path.resolve(root);
    assert.equal(path.dirname(target), path.resolve(cache));
    assert.ok(path.basename(target).startsWith('deploy-test-'));
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
});
