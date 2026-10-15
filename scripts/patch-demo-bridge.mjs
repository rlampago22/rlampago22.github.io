import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'public/demos/subchefe/index.html');
const bridge = await readFile(path.join(root, 'scripts/subchefe-bridge.js'), 'utf8');
let html = await readFile(htmlPath, 'utf8');
html = html.replace(/<script>if\(location\.pathname\.endsWith\('\/index\.html'\)\)[\s\S]*?<\/script>/, () => `<script>${bridge}</script>`);
html = html.replace('<html lang="en">', '<html lang="pt-BR">');
await writeFile(htmlPath, html);
