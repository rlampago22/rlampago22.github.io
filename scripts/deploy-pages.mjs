import { execFileSync } from 'node:child_process';
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Publishes dist/ as the gh-pages branch. GitHub Pages serves that branch
// directly, so no Actions workflow (or workflow token scope) is needed.
const root = process.cwd();
const dist = path.join(root, 'dist');
await access(path.join(dist, 'index.html')).catch(() => { throw new Error('Build não encontrado. Execute npm run build primeiro.'); });
// Without this file Jekyll would drop folders that start with "_", such as the Subchefe demo's _expo/.
await writeFile(path.join(dist, '.nojekyll'), '');

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const remote = git('remote', 'get-url', 'origin');
const source = git('rev-parse', '--short', 'HEAD');
const temp = await mkdtemp(path.join(tmpdir(), 'portfolio-pages-'));
const pages = (...args) => git(`--git-dir=${path.join(temp, '.git')}`, `--work-tree=${dist}`, ...args);
try {
  git('init', '-q', '-b', 'gh-pages', temp);
  pages('add', '-A');
  pages('commit', '-q', '-m', `Publicação gerada a partir de ${source}`);
  pages('push', '-q', '-f', remote, 'gh-pages');
  console.log(`Publicado em gh-pages a partir de ${source}.`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
