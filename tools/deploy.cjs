'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const base = path.resolve(__dirname, '..');
const checkout = path.join(base, '.cache', 'pages-deploy');
const output = path.join(base, 'public');
const args = process.argv.slice(2);
if (args.some(arg => !['--prepare-only', '--skip-build'].includes(arg))) {
  console.error('Usage: npm run deploy -- [--prepare-only] [--skip-build]');
  process.exit(1);
}
function run(command, argv, cwd = base) {
  const result = spawnSync(command, argv, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
}
function git(argv, cwd = base) { return run('git', argv, cwd); }
function readGit(argv, cwd = base) {
  const result = spawnSync('git', argv, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'Git command failed');
  return result.stdout.trim();
}
try {
  if (readGit(['branch', '--show-current']) !== 'main') throw new Error('Deploy must run on main; switch to main first.');
  run(process.execPath, ['--test', 'test']);
  if (!args.includes('--skip-build')) run(process.execPath, ['tools/run.cjs', 'build']);
  if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Build has no index.html');
  const remote = readGit(['remote', 'get-url', 'origin']);
  // Use a separate checkout and preserve the existing gh-pages history.
  fs.mkdirSync(path.dirname(checkout), { recursive: true });
  if (!fs.existsSync(checkout)) git(['clone', '--single-branch', '--branch', 'gh-pages', remote, checkout]);
  if (readGit(['remote', 'get-url', 'origin'], checkout) !== remote) throw new Error('Deployment remote differs from source origin');
  if (readGit(['branch', '--show-current'], checkout) !== 'gh-pages') throw new Error('Deployment checkout must use gh-pages');
  git(['fetch', 'origin', 'gh-pages'], checkout);
  git(['merge', '--ff-only', 'origin/gh-pages'], checkout);
  // Only replace generated contents inside this known deployment directory.
  if (path.resolve(checkout) !== path.resolve(base, '.cache', 'pages-deploy')) throw new Error('Invalid deployment directory');
  for (const name of fs.readdirSync(checkout)) {
    if (name === '.git') continue;
    const target = path.resolve(checkout, name);
    if (!target.startsWith(checkout + path.sep)) throw new Error('Invalid cleanup target');
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.cpSync(output, checkout, { recursive: true });
  fs.writeFileSync(path.join(checkout, '.nojekyll'), '');
  for (const key of ['user.name', 'user.email']) {
    const value = readGit(['config', key]);
    if (!value) throw new Error(`Missing Git ${key}`);
    git(['config', '--local', key, value], checkout);
  }
  git(['add', '--all'], checkout);
  if (args.includes('--prepare-only')) {
    console.log('Static site staged in .cache/pages-deploy; nothing committed or pushed.');
  } else {
    // Back up source first. A rejected source push must stop website publication.
    git(['add', '--all']);
    if (readGit(['diff', '--cached', '--name-only'])) {
      git(['commit', '-m', 'Update notes and site source']);
    }
    git(['push', 'origin', 'HEAD:main']);
    const changed = readGit(['diff', '--cached', '--name-only'], checkout);
    if (changed) git(['commit', '-m', `Publish notes from ${readGit(['rev-parse', '--short', 'HEAD'])}`], checkout);
    // Never force-push. Concurrent remote changes must be reconciled explicitly.
    git(['push', 'origin', 'HEAD:gh-pages'], checkout);
    console.log('Source pushed to main and static site pushed to gh-pages. Pages must publish gh-pages / (root).');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
