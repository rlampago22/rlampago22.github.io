import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function filesBelow(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesBelow(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}

export async function normalizeDemoAssets(output) {
  const expectedOutput = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/demos/subchefe');
  if (path.resolve(output) !== expectedOutput) throw new Error('Unexpected demo output path.');
  // Expo can emit public assets under a node_modules path when dependencies are
  // shared through a junction. Flatten those generated files for static hosts.
  const assetRoot = path.join(output, 'assets');
  if (!await fs.stat(assetRoot).catch(() => null)) return;
  const files = await filesBelow(assetRoot);
  const media = path.join(output, 'media');
  await fs.mkdir(media, { recursive: true });
  const names = new Set();
  for (const source of files) {
    const name = path.basename(source);
    if (names.has(name)) throw new Error(`Duplicate exported asset: ${name}`);
    names.add(name);
    await fs.copyFile(source, path.join(media, name));
  }
  for (const bundle of await filesBelow(path.join(output, '_expo'))) {
    if (!bundle.endsWith('.js')) continue;
    const code = await fs.readFile(bundle, 'utf8');
    const normalized = code.replace(/(["'])\/demos\/subchefe\/assets\/[^"']+?\/([^"'\/]+)\1/g,
      (original, quote, name) => names.has(name) ? `${quote}/demos/subchefe/media/${name}${quote}` : original);
    if (normalized.includes('/demos/subchefe/assets/')) throw new Error('Unresolved demo asset path.');
    await fs.writeFile(bundle, normalized, 'utf8');
  }
  // This exact generated directory was checked against the workspace above.
  await fs.rm(assetRoot, { recursive: true, force: true });
  console.log(`Normalized ${files.length} demo assets to /demos/subchefe/media/`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/demos/subchefe');
  await normalizeDemoAssets(output);
}
