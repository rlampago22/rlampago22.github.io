// Derives the dark theme from the light stylesheet: every rule that paints a light surface or dark text
// gets a twin scoped to html[data-theme="dark"] with the lightness flipped (hue and chroma kept, in OKLab).
// The twin uses :where() so it has the same specificity as the original and sits right after it,
// which keeps the cascade exactly as in the light theme. Hand-tuned overrides live in src/theme.css.

const scope = ':where(:root[data-theme="dark"])';
const colorPattern = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/g;

const toLinear = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = c => c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function parse(token) {
  if (token === 'white') return [255, 255, 255, 1];
  if (token === 'black') return [0, 0, 0, 1];
  if (token[0] === '#') {
    let hex = token.slice(1);
    if (hex.length <= 4) hex = [...hex].map(ch => ch + ch).join('');
    const value = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
    return [...value, hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1];
  }
  const parts = token.slice(token.indexOf('(') + 1, -1).split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.some(part => part.includes('var'))) return null;
  const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
  return [...parts.slice(0, 3).map(Number), alpha];
}

function toOklab([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(v => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
    .map(v => Math.round(Math.min(1, Math.max(0, toGamma(Math.max(0, v)))) * 255));
}

function format([r, g, b], alpha) {
  return alpha >= 1 ? `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}` : `rgba(${r},${g},${b},${+alpha.toFixed(3)})`;
}

function relight(rgba, lightness, chroma = 1) {
  const [, a, b] = toOklab(rgba);
  return format(fromOklab([lightness, a * chroma, b * chroma]), rgba[3]);
}

// Dark ink becomes light ink: #29262d → ~#dcdadf, the muted grey → ~#b0acb5, wine text → a light rose.
const text = (rgba, L) => L < 0.62 ? relight(rgba, 1.06 - L * 0.62) : null;

// Light surfaces become dark ones. The page paper lands on ~0.185; anything that stood out from it
// (whiter cards or tinted chips) stands out from it again by being a bit lighter.
function surface(rgba, L) {
  if (L < 0.8 || rgba[3] < 0.3) return null;
  return relight(rgba, L >= 0.97 ? 0.185 + (L - 0.97) * 1.5 : 0.185 + (0.97 - L) * 1.1, 1.2);
}

function line(rgba, L) {
  if (L < 0.45) return text(rgba, L);
  if (L < 0.7 || rgba[3] < 0.3) return null;
  return relight(rgba, 0.2 + (1 - L) * 1.2);
}

// Soft dark shadows vanish on a dark page, so they get deeper; white inner highlights become faint.
function shadow(rgba, L) {
  if (L > 0.8) return `rgba(255,255,255,${+(rgba[3] * 0.06).toFixed(3)})`;
  if (L < 0.5) return `rgba(0,0,0,${+Math.min(0.6, rgba[3] * 2.5).toFixed(3)})`;
  return null;
}

function mapperFor(prop) {
  if (prop.startsWith('--')) return null;
  if (/^(color|caret-color|fill|stroke|-webkit-text-fill-color|text-decoration-color)$/.test(prop)) return text;
  if (/^background(-color|-image)?$/.test(prop)) return surface;
  if (/^(border|outline|column-rule)/.test(prop)) return line;
  if (/^(box-shadow|text-shadow)$/.test(prop)) return shadow;
  return null;
}

function convert(value, mapper) {
  if (value.includes('url(')) return value;
  return value.replace(colorPattern, token => {
    const rgba = parse(token);
    if (!rgba) return token;
    return mapper(rgba, toOklab(rgba)[0]) ?? token;
  });
}

function scoped(selector) {
  if (selector.startsWith(':root')) return selector.replace(':root', ':root:where([data-theme="dark"])');
  if (/^html\b/.test(selector)) return selector.replace('html', 'html:where([data-theme="dark"])');
  return `${scope} ${selector}`;
}

export default function darkTheme() {
  return {
    postcssPlugin: 'portfolio-dark-theme',
    OnceExit(root) {
      root.walkRules(rule => {
        if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
        if (rule.selector.includes('data-theme')) return;
        const declarations = [];
        rule.each(node => {
          if (node.type !== 'decl') return;
          const mapper = mapperFor(node.prop);
          if (!mapper) return;
          const value = convert(node.value, mapper);
          if (value !== node.value) declarations.push(node.clone({ value }));
        });
        if (!declarations.length) return;
        const twin = rule.clone({ selectors: rule.selectors.map(scoped) });
        twin.removeAll();
        twin.append(declarations);
        rule.after(twin);
      });
    }
  };
}
darkTheme.postcss = true;
