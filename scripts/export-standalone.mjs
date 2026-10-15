import { readFile, writeFile, mkdir, cp, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
let html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const scriptPath = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1];
const cssPath = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/)?.[1];
if (!scriptPath || !cssPath) throw new Error('Build Vite não encontrado. Execute npm run build primeiro.');
const js = await readFile(path.join(root, 'dist', scriptPath), 'utf8');
const css = await readFile(path.join(root, 'dist', cssPath), 'utf8');
const assetNames = ['marcus-3d.webp', 'openai.svg', 'claude.svg', 'gemini.svg', 'favicon.svg', 'marcus-foto.jpg', 'eyes/eye-left.webp', 'eyes/eye-right.webp', 'eyes/iris-left.webp', 'eyes/iris-right.webp', 'projects/rpc-peixes-grafico.webp', ...['jazean', 'clinica'].map(id => `landings/${id}.webp`), ...['psicologia', 'pesca', 'esportes', 'musica'].flatMap(id => [`hobbies/${id}.mp4`, `hobbies/${id}-poster.jpg`])];
const mimeTypes = { svg: 'image/svg+xml', webp: 'image/webp', jpg: 'image/jpeg', mp4: 'video/mp4' };
const assets = Object.fromEntries(await Promise.all(assetNames.map(async name => {
  const content = await readFile(path.join(root, 'public/assets', name));
  return [name, `data:${mimeTypes[path.extname(name).slice(1)]};base64,${content.toString('base64')}`];
})));
html = html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/, () => `<script>globalThis.__PORTFOLIO_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="[^"]+"[^>]*>/, () => `<style>${css}</style>`);
html = html.replace(/href="(?:\.\/|\/)assets\/favicon\.svg"/, `href="${assets['favicon.svg']}"`);
const noticeNames = ['React-Bits.txt', 'Lobe-Icons.txt'];
await mkdir(path.join(root, 'dist/licenses'), { recursive: true });
const notices = await Promise.all(noticeNames.map(async name => {
  const text = await readFile(path.join(root, 'licenses', name), 'utf8');
  await writeFile(path.join(root, 'dist/licenses', name), text);
  return `${name}\n${text}`;
}));
html = html.replace('<html', `<!-- Third-party licenses\n${notices.join('\n\n')}\n-->\n<html`);
await mkdir(path.join(root, 'exports'), { recursive: true });
try {
  await access(path.join(root, 'public/demos/subchefe/index.html'));
  await cp(path.join(root, 'public/demos'), path.join(root, 'exports/demos'), { recursive: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const destination = path.join(root, 'exports', 'portfolio-marcus.html');
await writeFile(destination, html);
console.log(`HTML único: ${destination}`);
