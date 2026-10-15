import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { normalizeDemoAssets } from './normalize-subchefe-assets.mjs';
import { checkDemoLeaks } from './check-subchefe-demo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = path.resolve(process.argv[2] || 'C:/Users/Querol/Documents/App_regulação');
const snapshot = path.join(root, '.demo-source', 'subchefe');
const output = path.join(root, 'public', 'demos', 'subchefe');
const baseUrl = '/demos/subchefe';

function insideWorkspace(target) {
  const relative = path.relative(root, path.resolve(target));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Refusing to modify a path outside the portfolio workspace.');
  }
}

async function write(relative, contents) {
  const target = path.join(snapshot, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents, 'utf8');
}

insideWorkspace(snapshot);
insideWorkspace(output);
// Remove our dependency junction separately before refreshing the isolated snapshot.
await fs.unlink(path.join(snapshot, 'node_modules')).catch((e) => { if (e.code !== 'ENOENT') throw e; });
await fs.rm(snapshot, { recursive: true, force: true });
await fs.mkdir(snapshot, { recursive: true });

// Copy only application source and packaged visual assets. Never copy docs, backups,
// local data, environment files, Git history, API-key implementation or test fixtures.
for (const directory of ['src', 'assets']) {
  await fs.cp(path.join(original, directory), path.join(snapshot, directory), {
    recursive: true,
    filter: (source) => !/(?:^|[\\/])(?:secrets\.ts|[^\\/]+\.test\.[^\\/]+|[^\\/]+\.fixture\.[^\\/]+|\.env[^\\/]*)$/.test(source),
  });
}
await fs.copyFile(path.join(original, 'tsconfig.json'), path.join(snapshot, 'tsconfig.json'));
const pkg = JSON.parse(await fs.readFile(path.join(original, 'package.json'), 'utf8'));
await write('package.json', JSON.stringify({ ...pkg, name: 'subchefe-portfolio-demo', scripts: { web: 'expo start --web' } }, null, 2));
await write('app.json', JSON.stringify({ expo: {
  name: 'Subchefe · demonstração', slug: 'subchefe-portfolio-demo', version: '1.0.0',
  scheme: 'subchefe-demo', orientation: 'portrait', userInterfaceStyle: 'light',
  web: { bundler: 'metro', output: 'single', favicon: './assets/favicon.png' },
  plugins: ['expo-router'], experiments: { baseUrl },
} }, null, 2));

await write('src/data/storage.ts', `import { addDays, dayKeyFor, weekdayIndex } from '@/core/dates';
import { type AppData, type CheckIn, emptyData } from '@/core/types';

/** All records are fictional. The demo never reads or writes device/browser storage. */
export function demoData(): AppData {
  const data = emptyData();
  data.settings.appearance = 'light';
  data.settings.palette = 'floresta';
  data.settings.remindersAsked = true;
  data.settings.intro = { enabled: false, name: '', speak: 'never', spokenDay: null };
  const today = dayKeyFor(new Date());
  for (let i = 21; i > 0; i--) {
    const date = addDays(today, -i);
    const good = i % 5 !== 0;
    const weekend = [0, 6].includes(weekdayIndex(date));
    const city = i > 12 ? 'uruguaiana' : 'alegrete';
    const record: CheckIn = {
      date, city, hardDay: false, wokeEarly: good, wakeTime: good ? 480 : 600, wakeLimit: 540,
      sun: i % 3 !== 0, sunKind: 'caminhada', room: i % 4 !== 0,
      studyMinutes: good ? 60 + (i % 3) * 15 : 30, meals: good ? 2 : 1,
      classes: weekend ? 'sem_aula' : 'fui', sleepHours: good ? 7.5 : 6.5,
      phoneHours: good ? 3.5 : 5, phoneAuto: false,
      social: good ? 2 : 1, trained: i % 3 === 0,
      ...(i % 3 === 0 ? { trainKinds: ['corrida' as const], trainMinutes: 30 } : {}),
      mood: good ? 4 : 3, company: ['colegas'], wentOut: good, homeMeal: i % 2 === 0,
      note: i % 7 === 0 ? 'Registro fictício: caminhada pela manhã e estudo à tarde.' : '',
      updatedAt: date + 'T18:00:00.000Z',
    };
    data.checkIns[date] = record;
  }
  return data;
}

let memory = demoData();
export async function loadData(): Promise<AppData> { return structuredClone(memory); }
export async function saveData(data: AppData): Promise<void> { memory = structuredClone(data); }
`);
await write('src/data/drafts.ts', `import type { CheckIn } from '@/core/types';
let memory: Record<string, CheckIn> = {};
export async function loadDrafts(_today: string): Promise<Record<string, CheckIn>> { return structuredClone(memory); }
export async function saveDrafts(drafts: Record<string, CheckIn>): Promise<void> { memory = structuredClone(drafts); }
`);
await write('src/data/analyses.ts', `import { useState } from 'react';
import type { SavedAnalysis } from '@/core/ai/history';
let memory: SavedAnalysis[] = [];
export const analysisHistory = {
  load: async () => memory,
  add: async (item: SavedAnalysis) => { memory = [item, ...memory]; return memory; },
  remove: async (id: string) => { memory = memory.filter((item) => item.id !== id); return memory; },
  clear: async () => { memory = []; return memory; },
};
export function useAnalyses() {
  const [items, setItems] = useState(memory);
  return { items, loaded: true, spentThisMonthUsd: 0,
    reload: async () => setItems([...memory]),
    add: async (item: SavedAnalysis) => setItems([...await analysisHistory.add(item)]),
    remove: async (id: string) => setItems([...await analysisHistory.remove(id)]),
    clear: async () => setItems([...await analysisHistory.clear()]),
  };
}
`);
await write('src/data/secrets.ts', `import type { ProviderId } from '@/core/types';
/** This snapshot has no secure-store integration or API credentials. */
export async function getApiKey(_provider: ProviderId): Promise<null> { return null; }
export async function setApiKey(_provider: ProviderId, _value: string): Promise<void> { throw new Error('IA externa desativada na demonstração.'); }
export async function removeApiKey(_provider: ProviderId): Promise<void> {}
export function useApiKeys() { return { keys: { groq: null, anthropic: null }, loaded: true, reload: async () => {} }; }
`);
await write('src/core/ai/run.ts', `import type { ProviderId } from '../types';
import type { Usage } from './cost';
import type { Dossier } from './dossier';
import type { ModelInfo } from './models';
import type { Analysis } from './parse';
export type FetchLike = (...args: unknown[]) => Promise<unknown>;
export interface RunInput { provider: ProviderId; model: ModelInfo; apiKey: string; dossier: Dossier; fetchImpl?: FetchLike; timeoutMs?: number; signal?: AbortSignal; }
export interface RunResult { provider: ProviderId; model: ModelInfo; analysis: Analysis | null; rawText: string; usage: Usage; costUsd: number; ms: number; }
export async function runAnalysis(_input: RunInput): Promise<RunResult> { throw new Error('Chamadas de IA desativadas na demonstração.'); }
export async function testApiKey(..._args: unknown[]): Promise<void> { throw new Error('Chaves de API desativadas na demonstração.'); }
`);
// The AI instructions and the assembly of the text sent to the AI stay private: the demo
// gets placeholders with the same exports, and checkDemoLeaks confirms nothing slipped through.
await write('src/core/ai/prompt.ts', `import type { Dossier } from './dossier';
export type NullableStyle = 'anyOf' | 'typeArray';
export const SYSTEM_PROMPT = '';
export const ANALYSIS_KEYS = ['momentos', 'resumo', 'foi_bem', 'pesou', 'cidades', 'hipoteses', 'proximos_passos', 'perguntas_para_sessao', 'atencao'] as const;
export function analysisSchema(_style: NullableStyle): Record<string, unknown> { return {}; }
export function buildUserMessage(_dossier: Dossier): string { return ''; }
`);
await write('src/core/ai/dossier.ts', `import { addDays } from '../dates';
import type { CheckIns } from '../scoring';
import type { CheckIn } from '../types';
export interface DossierOptions { endKey: string; length: number; includeNotes: boolean; maxTokens?: number; }
export interface Dossier { text: string; startKey: string; endKey: string; length: number; registered: number; includesNotes: boolean; notesCount: number; approxTokens: number; trimmed: string[]; }
const HIDDEN = 'No app instalado, aqui aparece exatamente o texto que seria enviado à IA, montado a partir dos registros. Nesta demonstração, esse formato não é exibido.';
export function describeDayForAi(_c: CheckIn, _includeNotes: boolean): { line: string; note: string | null; reason: string | null } {
  return { line: HIDDEN, note: null, reason: null };
}
export function buildDossier(checkIns: CheckIns, { endKey, length }: DossierOptions): Dossier {
  const startKey = addDays(endKey, -(length - 1));
  const registered = Object.keys(checkIns).filter((key) => key >= startKey && key <= endKey).length;
  const text = HIDDEN + '\\n\\nPeríodo fictício: ' + length + ' dias, ' + registered + ' com registro.';
  return { text, startKey, endKey, length, registered, includesNotes: false, notesCount: 0, approxTokens: 0, trimmed: [] };
}
`);
// compare.ts also feeds the Progresso charts; only its text-for-the-AI functions at the end are replaced.
let compare = await fs.readFile(path.join(snapshot, 'src/core/compare.ts'), 'utf8');
let describeStart = compare.indexOf('export function describeWeeks(');
if (describeStart < 0) throw new Error('compare.ts changed: describeWeeks not found, update the demo stub.');
const describeDoc = compare.lastIndexOf('/**', describeStart);
if (describeDoc >= 0 && /^\/\*\*[\s\S]*?\*\/\s*$/.test(compare.slice(describeDoc, describeStart))) describeStart = describeDoc;
compare = compare.slice(0, describeStart) + `export function describeWeeks(_w: WeekComparison): string { return ''; }
export function describeGroup(_c: GroupComparison): string { return ''; }
export function describeContrastRow(_r: ContrastRow): string { return ''; }
export function describeComparisons(_c: Comparisons, _maxResultRows = 6, _maxContextRows = 4): string[] { return []; }
`;
await write('src/core/compare.ts', compare);
await write('src/ui/useSpeech.ts', `import type { DeviceVoice, VoiceSettings } from '@/core/voice';
export async function loadDeviceVoices(): Promise<DeviceVoice[]> { return []; }
export function useSpeech() {
  return { speaking: false, problem: 'A voz do celular está desativada nesta demonstração.',
    toggle: (_text: string) => {}, speak: (_text: string, _override?: Partial<VoiceSettings>) => {}, stop: () => {} };
}
`);
await write('src/app/ia.tsx', `import { useRouter } from 'expo-router';
import { Button, Card, Screen, T } from '@/ui/components';
export default function DemoIaScreen() {
  const router = useRouter();
  return <Screen topInset={false}>
    <Card><T v="h2">IA no aplicativo Android</T>
      <T>O Subchefe permite escolher o provedor, conferir o texto e solicitar uma análise no app instalado.</T>
      <T v="muted">Nesta demonstração, as chaves e chamadas externas estão desativadas. Nenhum registro é enviado.</T>
      <Button label="Ver exemplo de análise" onPress={() => router.push('/analise')} />
    </Card>
  </Screen>;
}
`);
await write('src/app/analise.tsx', `import { useMemo, useState } from 'react';
import { buildDossier } from '@/core/ai/dossier';
import { type SavedAnalysis } from '@/core/ai/history';
import { useApp } from '@/data/AppProvider';
import { AnalysisView } from '@/ui/AnalysisView';
import { Button, Card, Screen, T } from '@/ui/components';
export default function DemoAnalysisScreen() {
  const { today, checkIns } = useApp();
  const [preview, setPreview] = useState(false);
  const dossier = useMemo(() => buildDossier(checkIns, { endKey: today, length: 30, includeNotes: true }), [today, checkIns]);
  const saved: SavedAnalysis = {
    id: 'portfolio-demo', createdAt: new Date().toISOString(), provider: 'groq',
    modelId: 'local-example', modelLabel: 'Exemplo ilustrativo · sem IA externa',
    startKey: dossier.startKey, endKey: dossier.endKey, days: 30,
    includedNotes: false, notesCount: 0, costUsd: 0, ms: 0,
    usage: { inputTokens: 0, outputTokens: 0 }, rawText: '',
    analysis: { momentos: '',
      resumo: 'Este exemplo mostra como o aplicativo organiza uma análise. Os registros de demonstração alternam estudo, caminhada e sono regular.',
      fooBem: ['Os hábitos aparecem na mesma linha do tempo.', 'O histórico permite acompanhar a rotina entre semanas.'],
      pesou: ['Alguns dias fictícios têm menos estudo e mais tempo de tela.'],
      cidades: 'Os dois lugares têm registros fictícios. O aplicativo permite compará-los sem afirmar uma causa.',
      hipoteses: ['Este texto é estático e ilustrativo; nenhuma hipótese foi gerada por um modelo.'],
      proximosPassos: ['Abra o check-in e experimente registrar um dia.', 'Visite Progresso para explorar os gráficos calculados pelo app.'],
      perguntas: [], atencao: null,
    },
  };
  return <Screen topInset={false}>
    <Card><T v="h2">Exemplo de análise</T>
      <T v="muted">Conteúdo ilustrativo fixo, escrito para o portfólio. A IA está desativada; os gráficos e a pontuação das outras telas são calculados pelo código real.</T>
      <Button kind="secondary" label={preview ? 'Ocultar resumo dos registros' : 'Ver resumo dos registros fictícios'} onPress={() => setPreview(!preview)} />
      {preview ? <T selectable>{dossier.text}</T> : null}
    </Card>
    <AnalysisView saved={saved} />
  </Screen>;
}
`);

let layout = await fs.readFile(path.join(snapshot, 'src/app/_layout.tsx'), 'utf8');
layout = layout.replace("import { Stack } from 'expo-router';", "import { Stack, useRouter } from 'expo-router';");
layout = layout.replace('function Gate() {', `function Gate() {
  const router = useRouter();`);
layout = layout.replace('  if (loadError) {', `  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    const allowed = new Set(['/', '/checkin', '/progresso', '/escadinha', '/diario', '/analise']);
    const navigate = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (event.data?.type === 'subchefe-demo:navigate' && allowed.has(event.data.route)) {
        router.push(event.data.route);
      }
    };
    window.addEventListener('message', navigate);
    window.parent.postMessage({ type: 'subchefe-demo:ready' }, window.location.origin);
    return () => window.removeEventListener('message', navigate);
  }, [ready, router]);

  if (loadError) {`);
await write('src/app/_layout.tsx', layout);
// Avoid loading a persistent speech/intro setup or an APK update runtime in the web demo.
await write('src/updates.ts', `export function currentUpdateLabel(): string { return 'Demonstração web · dados fictícios'; }\n`);

await write('README-demo.md', `# Subchefe no portfólio\n\nSnapshot isolado do aplicativo Android existente. Apenas src, assets, package.json e tsconfig são copiados; docs pessoais, .git, .env, backups e o módulo de chaves original ficam fora. Não modifica o aplicativo original.\n\n21 dias fictícios são gerados em memória. Check-in, diário, pontuação, gráficos, comparativos, níveis e paletas usam as telas e regras do app. Recarregar recomeça a demonstração. Não lê nem grava AsyncStorage ou outros dados reais.\n\nA tela de análise apresenta um texto ilustrativo local claramente identificado. As instruções da IA e a montagem do texto enviado a ela não entram na demonstração: os dois módulos são substituídos por versões vazias, e o build falha se algum trecho deles aparecer no resultado (scripts/check-subchefe-demo.mjs). API keys, chamadas de IA, voz, abertura, notificações, medição nativa de uso e atualizações Android estão desativadas/indisponíveis. Nenhuma chave é necessária.\n\nExportação Expo SDK 57: web.output single + experiments.baseUrl ${baseUrl}. Hospede os arquivos em ${baseUrl}/. O app é uma SPA; navegue internamente, ou configure fallback para index.html no host. O portfólio envia rotas via postMessage com origem e parent conferidos.\n\nRecriar a demo: node scripts/build-subchefe-demo.mjs [caminho-do-app-original]. Os node_modules originais são usados por uma junction temporária somente neste snapshot. Resultado: public/demos/subchefe; Vite copia ao dist. O HTML standalone precisa ser servido por HTTP para executar esta demo.\n`);

const dependencies = path.join(original, 'node_modules');
await fs.symlink(dependencies, path.join(snapshot, 'node_modules'), 'junction');
const cli = path.join(dependencies, 'expo', 'bin', 'cli');
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [cli, 'export', '--platform', 'web', '--output-dir', output], {
    cwd: snapshot, stdio: 'inherit',
    env: { ...process.env, CI: '1', EXPO_OFFLINE: '1', EXPO_NO_TELEMETRY: '1' },
  });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error('Expo export failed with exit code ' + code)));
});
const htmlPath = path.join(output, 'index.html');
await normalizeDemoAssets(output);
let html = await fs.readFile(htmlPath, 'utf8');
const bridge = await fs.readFile(path.join(root, 'scripts/subchefe-bridge.js'), 'utf8');
html = html.replace('<head>', `<head>\n<script>${bridge}</script>`).replace('<html lang="en">', '<html lang="pt-BR">');
await fs.writeFile(htmlPath, html, 'utf8');
await fs.copyFile(path.join(snapshot, 'README-demo.md'), path.join(output, 'README-demo.md'));
await fs.unlink(path.join(snapshot, 'node_modules'));
const checked = await checkDemoLeaks(original, output);
console.log('Demo exported to ' + output + ' (' + checked + ' private fragments checked, none found)');
