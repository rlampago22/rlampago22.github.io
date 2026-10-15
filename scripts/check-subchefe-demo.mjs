import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Modules whose text must never reach the public demo: the AI instructions and the
// assembly of the text sent to the AI. Their strings are read from the original app at
// check time, so no fragment of them is ever written into this public repository.
const PRIVATE_MODULES = ['src/core/ai/prompt.ts', 'src/core/ai/dossier.ts'];
// The text-for-the-AI part of compare.ts, from describeWeeks to the end of the file.
const PRIVATE_TAILS = [{ module: 'src/core/compare.ts', from: 'export function describeWeeks(' }];
const MIN_RUN = 18;

/** Runs of every string literal in a module, split at quotes, escapes and ${} placeholders. */
function fragments(source) {
  const literals = source.match(/`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/g) ?? [];
  const runs = new Set();
  for (const literal of literals) {
    const body = literal.slice(1, -1).replace(/\$\{[^}]*\}/g, '\u0000');
    for (const run of body.split(/[\u0000\n\r\t"'`\\]/)) {
      const trimmed = run.trim();
      if (trimmed.length >= MIN_RUN && /[a-z]{3,}.*\s.*[a-z]{3,}/i.test(trimmed)) runs.add(trimmed);
    }
  }
  return [...runs];
}

/** The bundler writes accents as \xNN / \uNNNN escapes; undo them so accented text is compared too. */
const decode = (text) => text
  .replace(/\\x([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(target) : [target];
  }));
  return files.flat();
}

/** Throws if any fragment of the private modules shows up in the exported demo's code or HTML. */
export async function checkDemoLeaks(original, output) {
  const markers = [];
  for (const relative of PRIVATE_MODULES) {
    const source = await fs.readFile(path.join(original, relative), 'utf8');
    for (const text of fragments(source)) markers.push({ module: relative, text });
  }
  for (const { module, from } of PRIVATE_TAILS) {
    const source = await fs.readFile(path.join(original, module), 'utf8');
    const start = source.indexOf(from);
    if (start < 0) throw new Error(`${module} changed: "${from}" not found, update the check.`);
    for (const text of fragments(source.slice(start))) markers.push({ module, text });
  }
  if (markers.length === 0) throw new Error('No fragments read from the private modules; the check would be empty.');
  const leaks = [];
  for (const file of await listFiles(output)) {
    if (!/\.(?:js|html|json|map)$/.test(file)) continue;
    const contents = decode(await fs.readFile(file, 'utf8'));
    for (const marker of markers) {
      if (contents.includes(marker.text)) leaks.push(`${path.relative(output, file)} contém texto de ${marker.module}`);
    }
  }
  if (leaks.length > 0) {
    throw new Error(`A demo expõe texto privado (${leaks.length} trecho(s)):\n  ${[...new Set(leaks)].join('\n  ')}`);
  }
  return markers.length;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const original = path.resolve(process.argv[2] || 'C:/Users/Querol/Documents/App_regulação');
  const count = await checkDemoLeaks(original, path.join(root, 'public', 'demos', 'subchefe'));
  console.log(`Demo sem texto privado (${count} trechos conferidos).`);
}
