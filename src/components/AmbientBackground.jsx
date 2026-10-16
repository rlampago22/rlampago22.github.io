import { useEffect, useRef } from 'react';
import './AmbientBackground.css';

// Short pieces of real-looking code that get typed out and then drift down the page.
const snippets = [
  ["const neuronio = new Neuronio({ limiar: 0.7 });", "neuronio.on('disparo', sinal => {", "  sinapse.liberar(sinal);", "});"],
  ['def aprender(cerebro, estimulo):', '    sinal = cerebro.perceber(estimulo)', '    return cerebro.conectar(sinal)'],
  ['async function pensar(ideia) {', '  const contexto = await memoria.lembrar(ideia);', '  return contexto.proximoPasso();', '}'],
  ['for (const n of rede.neuronios) {', '  if (n.potencial > limiar) n.disparar();', '}'],
  ['// plasticidade: o que se usa, se fortalece', 'sinapse.peso += taxa * pre * pos;'],
  ['SELECT habito, sequencia FROM checkins', "WHERE usuario = 'marcus'", 'ORDER BY dia DESC;'],
  ['export default function Portfolio() {', '  return <Ideias fora="da pasta" />;', '}'],
  ['while (curioso) {', '  aprender();', '  construir();', '}'],
  ['class Sinapse {', '  transmitir(sinal) {', '    return sinal * this.peso;', '  }', '}'],
  ["const saude = pacientes.map(cuidar);", "await relatorio.gerar(saude);"],
  ['# memória de trabalho', 'contexto = sessao.exportar()', 'proxima_ia.continuar(contexto)'],
  ['git add . && git commit -m "nova conexão"', 'git push origin main']
];

const keywords = new Set(['const', 'let', 'var', 'new', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'of', 'in', 'while', 'class', 'export', 'default', 'import', 'from', 'def', 'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'DESC', 'this', 'true', 'false']);
const tokenPattern = /(\/\/.*|#.*)|('[^']*'|"[^"]*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_À-ú][\wÀ-ú]*)|(\s+)|(.)/g;

// Splits each line into coloured tokens once, keeping the column where each token starts.
const tokenized = snippets.map(lines => lines.map(line => {
  const tokens = [];
  for (const match of line.matchAll(tokenPattern)) {
    const [text, comment, string, number, word] = match;
    let kind = 'text';
    if (comment) kind = 'comment';
    else if (string) kind = 'string';
    else if (number) kind = 'fn';
    else if (word && keywords.has(word)) kind = 'keyword';
    else if (word && (line[match.index + text.length] === '(' || /^[A-Z]/.test(word))) kind = 'fn';
    if (text.trim()) tokens.push({ text, kind, column: match.index });
  }
  return { tokens, length: line.length };
}));

const random = (min, max) => min + Math.random() * (max - min);
const pick = list => list[Math.floor(Math.random() * list.length)];
const layers = [
  { size: 10, speed: 9, alpha: 0.28 },
  { size: 12, speed: 15, alpha: 0.42 },
  { size: 14, speed: 22, alpha: 0.6 }
];

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const read = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  return {
    node: read('--ambient-node', '#7f3048'), pulse: read('--ambient-pulse', '#b1667f'), glow: read('--ambient-glow', '#c99bb5'),
    text: read('--ambient-text', '#5d5864'), keyword: read('--ambient-keyword', '#7f3048'), string: read('--ambient-string', '#4f7d63'),
    fn: read('--ambient-fn', '#a0632e'), comment: read('--ambient-comment', '#9a94a0')
  };
}

// The neuron's dendrites: a few curved branches, some of them forking once.
function growDendrites() {
  return Array.from({ length: Math.floor(random(3, 6)) }, () => {
    const angle = Math.random() * Math.PI * 2;
    return { angle, length: random(9, 24), bend: random(-0.5, 0.5), fork: Math.random() < 0.6 ? { at: random(0.5, 0.75), angle: random(0.4, 0.9) * (Math.random() < 0.5 ? -1 : 1), length: random(5, 12) } : null, phase: Math.random() * 6 };
  });
}

export default function AmbientBackground({ paused, theme }) {
  const canvasRef = useRef(null);
  const engine = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0, height = 0, frame = 0, last = 0, clock = 0, running = false, nextPulse = 0;
    let colors = readColors(), dark = false;
    let fragments = [], neurons = [], pulses = [], sparks = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let lastScroll = window.scrollY;

    const compact = () => width < 700;
    // globalAlpha silently ignores values above 1, so they are clamped.
    const setAlpha = value => { context.globalAlpha = Math.min(1, value); };
    const reach = () => (compact() ? 120 : 170);

    function measure(fragment) {
      const layer = layers[fragment.layer];
      const size = compact() ? layer.size - 1 : layer.size;
      context.font = `${size}px "IBM Plex Mono", monospace`;
      fragment.size = size;
      fragment.charWidth = context.measureText('M').width;
      fragment.lineHeight = size * 1.55;
      fragment.width = Math.max(...fragment.lines.map(line => line.length)) * fragment.charWidth;
      fragment.height = fragment.lines.length * fragment.lineHeight;
    }

    // New fragments appear where they overlap the others the least, then type themselves out.
    function spawnFragment(fragment = {}, initial = false) {
      const index = Math.floor(Math.random() * tokenized.length);
      Object.assign(fragment, { lines: tokenized[index], layer: Math.floor(random(0, 3)), age: 0, typed: initial ? 9999 : 0, typeSpeed: random(28, 48) });
      fragment.total = fragment.lines.reduce((sum, line) => sum + line.length + 1, 0);
      measure(fragment);
      let best = null, bestScore = -1;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const x = random(-fragment.width * 0.15, Math.max(10, width - fragment.width * 0.85));
        const y = initial ? random(0, height) : random(-fragment.height * 0.5, height * 0.45);
        const score = Math.min(9999, ...fragments.filter(other => other !== fragment && other.lines).map(other => Math.hypot(other.x + other.width / 2 - x - fragment.width / 2, other.y + other.height / 2 - y - fragment.height / 2)));
        if (score > bestScore) { bestScore = score; best = { x, y }; }
      }
      fragment.x = best.x; fragment.y = best.y;
      return fragment;
    }

    function spawnNeuron() {
      const angle = Math.random() * Math.PI * 2, speed = random(8, 18);
      return { x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: random(2, 3.6), energy: 0, dendrites: growDendrites(), seed: Math.random() * 100 };
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const fragmentCount = Math.round(Math.min(14, Math.max(5, (width * height) / 95000)));
      fragments = fragments.slice(0, fragmentCount);
      fragments.forEach(measure);
      while (fragments.length < fragmentCount) fragments.push(spawnFragment({}, true));
      const neuronCount = Math.round(Math.min(60, Math.max(18, (width * height) / 26000)));
      neurons = Array.from({ length: neuronCount }, (_, index) => neurons[index] ?? spawnNeuron());
      pulses = pulses.filter(pulse => pulse.from < neurons.length && pulse.to < neurons.length);
    }

    // Each link bows to one side by an amount fixed per pair, and sways a little over time.
    function control(a, b) {
      const from = neurons[Math.min(a, b)], to = neurons[Math.max(a, b)];
      const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
      const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1;
      const side = ((from.seed * 7 + to.seed * 13) % 1) - 0.5;
      const bow = side * length * 0.45 + Math.sin(clock * 0.8 + from.seed + to.seed) * 6;
      return { x: mx - (dy / length) * bow, y: my + (dx / length) * bow };
    }
    const along = (from, via, to, t) => ({ x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * via.x + t * t * to.x, y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * via.y + t * t * to.y });

    function linked(index, except = -1) {
      const neuron = neurons[index], limit = reach();
      return neurons.reduce((found, other, otherIndex) => {
        if (otherIndex !== index && otherIndex !== except && Math.hypot(other.x - neuron.x, other.y - neuron.y) < limit) found.push(otherIndex);
        return found;
      }, []);
    }

    // An impulse runs down a connection; when it lands the neuron lights up and may fire onwards.
    function fire(from, depth = 0, except = -1) {
      const options = linked(from, except);
      if (options.length) pulses.push({ from, to: pick(options), t: 0, speed: random(0.7, 1.3), depth });
    }

    function update(dt) {
      clock += dt;
      const scroll = window.scrollY;
      const drift = Math.max(-60, Math.min(60, scroll - lastScroll));
      lastScroll = scroll;

      fragments.forEach(fragment => {
        const layer = layers[fragment.layer];
        fragment.age += dt;
        fragment.typed += fragment.typeSpeed * dt;
        fragment.y += layer.speed * dt - drift * (0.06 + fragment.layer * 0.06);
        if (fragment.y > height + 20 || fragment.y + fragment.height < -height * 0.6) spawnFragment(fragment);
      });

      neurons.forEach(neuron => {
        if (pointer.active) {
          const dx = pointer.x - neuron.x, dy = pointer.y - neuron.y, distance = Math.hypot(dx, dy);
          if (distance < 200 && distance > 40) { neuron.vx += (dx / distance) * 10 * dt; neuron.vy += (dy / distance) * 10 * dt; }
        }
        const speed = Math.hypot(neuron.vx, neuron.vy);
        if (speed > 26) { neuron.vx *= 26 / speed; neuron.vy *= 26 / speed; }
        neuron.x += neuron.vx * dt;
        neuron.y += neuron.vy * dt - drift * 0.1;
        neuron.energy = Math.max(0, neuron.energy - dt * 1.2);
        if (neuron.x < -40) neuron.x = width + 40; else if (neuron.x > width + 40) neuron.x = -40;
        if (neuron.y < -40) neuron.y = height + 40; else if (neuron.y > height + 40) neuron.y = -40;
      });

      nextPulse -= dt;
      if (nextPulse <= 0) { fire(Math.floor(Math.random() * neurons.length)); nextPulse = random(0.2, 0.6); }
      pulses = pulses.filter(pulse => {
        pulse.t += pulse.speed * dt;
        if (pulse.t < 1) return true;
        const target = neurons[pulse.to];
        target.energy = 1;
        // Neurotransmitter burst at the synapse.
        for (let i = 0; i < 6; i += 1) {
          const angle = Math.random() * Math.PI * 2, speed = random(15, 45);
          sparks.push({ x: target.x, y: target.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
        }
        if (pulse.depth < 5 && Math.random() < 0.7) fire(pulse.to, pulse.depth + 1, pulse.from);
        if (pulse.depth < 2 && Math.random() < 0.25) fire(pulse.to, pulse.depth + 1, pulse.from);
        return false;
      });
      sparks = sparks.filter(spark => {
        spark.life -= dt * 1.6;
        spark.x += spark.vx * dt; spark.y += spark.vy * dt;
        spark.vx *= 0.94; spark.vy *= 0.94;
        return spark.life > 0;
      });
    }

    function drawCode(strength) {
      context.textAlign = 'left';
      context.textBaseline = 'top';
      fragments.forEach(fragment => {
        const layer = layers[fragment.layer];
        const fadeIn = Math.min(1, fragment.age / 0.8);
        const fadeOut = Math.min(1, Math.max(0, (height - fragment.y) / (height * 0.3)));
        const alpha = layer.alpha * fadeIn * fadeOut * strength;
        if (alpha <= 0.005) return;
        context.font = `${fragment.size}px "IBM Plex Mono", monospace`;
        let remaining = Math.floor(fragment.typed);
        let cursor = null;
        fragment.lines.forEach((line, row) => {
          if (remaining < 0) return;
          const shown = Math.min(line.length, remaining);
          const y = fragment.y + row * fragment.lineHeight;
          line.tokens.forEach(token => {
            if (token.column >= shown) return;
            context.fillStyle = colors[token.kind];
            setAlpha(alpha * (token.kind === 'comment' ? 0.8 : 1));
            context.fillText(token.text.slice(0, shown - token.column), fragment.x + token.column * fragment.charWidth, y);
          });
          if (remaining <= line.length) cursor = { x: fragment.x + shown * fragment.charWidth, y };
          remaining -= line.length + 1;
        });
        if (!cursor && fragment.typed < fragment.total + fragment.typeSpeed * 1.5) {
          const lastLine = fragment.lines[fragment.lines.length - 1];
          cursor = { x: fragment.x + lastLine.length * fragment.charWidth, y: fragment.y + (fragment.lines.length - 1) * fragment.lineHeight };
        }
        if (cursor && Math.floor(clock * 2.2) % 2 === 0) {
          context.fillStyle = colors.keyword;
          setAlpha(alpha);
          context.fillRect(cursor.x + 1, cursor.y, fragment.charWidth * 0.55, fragment.size * 1.1);
        }
      });
    }

    function drawNeurons(strength) {
      const limit = reach();
      context.lineCap = 'round';
      context.strokeStyle = colors.node;
      context.lineWidth = 0.9;
      for (let a = 0; a < neurons.length; a += 1) {
        for (let b = a + 1; b < neurons.length; b += 1) {
          const distance = Math.hypot(neurons[a].x - neurons[b].x, neurons[a].y - neurons[b].y);
          if (distance >= limit) continue;
          const via = control(a, b);
          setAlpha((1 - distance / limit) ** 1.3 * 0.4 * strength);
          context.beginPath();
          context.moveTo(neurons[a].x, neurons[a].y);
          context.quadraticCurveTo(via.x, via.y, neurons[b].x, neurons[b].y);
          context.stroke();
        }
      }

      if (pointer.active) {
        neurons.forEach(neuron => {
          const distance = Math.hypot(neuron.x - pointer.x, neuron.y - pointer.y);
          if (distance >= 200) return;
          const mx = (neuron.x + pointer.x) / 2, my = (neuron.y + pointer.y) / 2;
          setAlpha((1 - distance / 200) * 0.55 * strength);
          context.beginPath();
          context.moveTo(neuron.x, neuron.y);
          context.quadraticCurveTo(mx + Math.sin(clock * 2 + neuron.seed) * 14, my + Math.cos(clock * 2 + neuron.seed) * 14, pointer.x, pointer.y);
          context.stroke();
        });
      }

      // Dendrites wave slowly around each cell body.
      context.lineWidth = 0.8;
      neurons.forEach(neuron => {
        context.strokeStyle = neuron.energy > 0.3 ? colors.pulse : colors.node;
        setAlpha((0.4 + neuron.energy * 0.5) * strength);
        neuron.dendrites.forEach(branch => {
          const sway = Math.sin(clock * 1.3 + branch.phase) * 0.18;
          const angle = branch.angle + sway, bend = branch.bend + sway;
          const ex = neuron.x + Math.cos(angle) * branch.length, ey = neuron.y + Math.sin(angle) * branch.length;
          const cx = neuron.x + Math.cos(angle + bend) * branch.length * 0.6, cy = neuron.y + Math.sin(angle + bend) * branch.length * 0.6;
          context.beginPath();
          context.moveTo(neuron.x, neuron.y);
          context.quadraticCurveTo(cx, cy, ex, ey);
          if (branch.fork) {
            const start = along(neuron, { x: cx, y: cy }, { x: ex, y: ey }, branch.fork.at);
            const forkAngle = angle + branch.fork.angle;
            context.moveTo(start.x, start.y);
            context.lineTo(start.x + Math.cos(forkAngle) * branch.fork.length, start.y + Math.sin(forkAngle) * branch.fork.length);
          }
          context.stroke();
        });
      });

      context.lineWidth = 2;
      pulses.forEach(pulse => {
        const from = neurons[pulse.from], to = neurons[pulse.to], via = control(pulse.from, pulse.to);
        context.strokeStyle = colors.pulse;
        context.beginPath();
        for (let step = 0; step <= 10; step += 1) {
          const point = along(from, via, to, Math.max(0, pulse.t - 0.3 + (step / 10) * 0.3));
          if (step === 0) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
        }
        setAlpha(0.6 * strength);
        context.stroke();
        const head = along(from, via, to, pulse.t);
        context.fillStyle = colors.pulse;
        setAlpha(0.22 * strength);
        context.beginPath(); context.arc(head.x, head.y, 8, 0, Math.PI * 2); context.fill();
        setAlpha(0.95 * strength);
        context.beginPath(); context.arc(head.x, head.y, 2.2, 0, Math.PI * 2); context.fill();
      });

      context.fillStyle = colors.pulse;
      sparks.forEach(spark => {
        setAlpha(spark.life * 0.7 * strength);
        context.beginPath(); context.arc(spark.x, spark.y, 1.3, 0, Math.PI * 2); context.fill();
      });

      neurons.forEach(neuron => {
        context.fillStyle = colors.pulse;
        setAlpha((0.08 + neuron.energy * 0.28) * strength);
        context.beginPath(); context.arc(neuron.x, neuron.y, neuron.r * 2.6 + neuron.energy * 10, 0, Math.PI * 2); context.fill();
        context.fillStyle = neuron.energy > 0.3 ? colors.pulse : colors.node;
        setAlpha((0.7 + neuron.energy * 0.3) * strength);
        context.beginPath(); context.arc(neuron.x, neuron.y, neuron.r + neuron.energy * 1.4, 0, Math.PI * 2); context.fill();
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      // On the light page dark ink needs a bit more opacity to read as strongly as light ink on the dark page.
      const strength = dark ? 1 : 1.25;
      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
        glow.addColorStop(0, colors.glow);
        glow.addColorStop(1, 'transparent');
        setAlpha(dark ? 0.16 : 0.1);
        context.fillStyle = glow;
        context.fillRect(pointer.x - 320, pointer.y - 320, 640, 640);
      }
      drawCode(strength);
      drawNeurons(strength);
      setAlpha(1);
    }

    function loop(time) {
      const dt = Math.min(0.05, (time - (last || time)) / 1000);
      last = time;
      update(dt);
      draw();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || engine.current.paused || document.hidden) return;
      running = true; last = 0; lastScroll = window.scrollY;
      frame = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(frame); draw(); }

    const onPointerMove = event => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };
    // A click sets off a cascade from the neurons closest to it.
    const onPointerDown = event => {
      if (!running) return;
      neurons.map((neuron, index) => ({ index, distance: Math.hypot(neuron.x - event.clientX, neuron.y - event.clientY) }))
        .sort((a, b) => a.distance - b.distance).slice(0, 3)
        .forEach(({ index }) => { neurons[index].energy = 1; fire(index); fire(index); });
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => { resize(); if (!running) draw(); };

    engine.current = {
      paused: false,
      setPaused(value) { this.paused = value; value ? stop() : start(); },
      setTheme(value) { dark = value === 'dark'; colors = readColors(); if (!running) draw(); }
    };

    resize();
    // The mono font may arrive after the first measure; re-measure so columns line up.
    document.fonts?.ready.then(() => { if (engine.current) { fragments.forEach(measure); if (!running) draw(); } });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      engine.current = null;
    };
  }, []);

  useEffect(() => { engine.current?.setTheme(theme); }, [theme]);
  useEffect(() => { engine.current?.setPaused(paused); }, [paused]);

  return <canvas className="ambient-background" ref={canvasRef} aria-hidden="true" />;
}
