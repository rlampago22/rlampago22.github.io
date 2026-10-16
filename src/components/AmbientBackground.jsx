import { useEffect, useRef } from 'react';
import './AmbientBackground.css';

// Lines that fall down the page like code rain; each column reads as a real line top to bottom.
const snippets = [
  'const ideia = contexto.proximoPasso();',
  'if (problema.real) construir(solucao);',
  'neuronios.forEach(n => n.disparar());',
  'await claude.revisar(arquitetura);',
  'git commit -m "curiosidade"',
  'def habito(dia): return dia.checkin()',
  "SELECT * FROM ideias WHERE viva = true;",
  'while (aprendendo) evoluir();',
  'sinapse.conectar(psicologia, codigo);',
  '01001101 01010001',
  'npm run build && deploy()',
  'saude.digital.map(cuidar)',
  'export default function Portfolio() {',
  'λx. x + curiosidade',
  'return { decisoes, proximosPassos };'
];
const glyphs = '{}[]()<>=+*/;:01λ#$&_';

const random = (min, max) => min + Math.random() * (max - min);
const pick = list => list[Math.floor(Math.random() * list.length)];

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const read = name => style.getPropertyValue(name).trim() || '#7f3048';
  return { code: read('--ambient-code'), node: read('--ambient-node'), pulse: read('--ambient-pulse'), glow: read('--ambient-glow') };
}

export default function AmbientBackground({ paused, theme }) {
  const canvasRef = useRef(null);
  const engine = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0, height = 0, frame = 0, last = 0, running = false, nextPulse = 0;
    let colors = readColors(), dark = false;
    let streams = [], nodes = [], pulses = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let lastScroll = window.scrollY;

    const compact = () => width < 700;
    const fontSize = () => (compact() ? 11 : 13);
    const linkDistance = () => (compact() ? 110 : 150);

    function spawnStream(stream = {}, fromTop = true) {
      const size = fontSize();
      const columns = Math.max(1, Math.floor(width / (size * 1.7)));
      Object.assign(stream, {
        x: (Math.floor(Math.random() * columns) + 0.5) * size * 1.7,
        text: pick(snippets),
        length: Math.floor(random(9, 22)),
        speed: random(45, 110),
        head: fromTop ? -random(0, height * 0.6) : random(0, height),
        scramble: 0
      });
      return stream;
    }

    function spawnNode() {
      const angle = Math.random() * Math.PI * 2;
      const speed = random(10, 22);
      return { x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: random(1.1, 2.3), energy: 0 };
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const streamCount = Math.round(width / (compact() ? 70 : 85));
      streams = Array.from({ length: streamCount }, (_, index) => streams[index] ?? spawnStream({}, false));
      const nodeCount = Math.round(Math.min(80, Math.max(22, (width * height) / 21000)));
      nodes = Array.from({ length: nodeCount }, (_, index) => nodes[index] ?? spawnNode());
      nodes.forEach(node => { node.x = Math.min(node.x, width); node.y = Math.min(node.y, height); });
      pulses = pulses.filter(pulse => pulse.from < nodes.length && pulse.to < nodes.length);
    }

    function neighbours(index, except = -1) {
      const node = nodes[index], reach = linkDistance();
      const found = [];
      nodes.forEach((other, otherIndex) => {
        if (otherIndex === index || otherIndex === except) return;
        if (Math.hypot(other.x - node.x, other.y - node.y) < reach) found.push(otherIndex);
      });
      return found;
    }

    // A signal travels along a link; on arrival the neuron lights up and may pass it on.
    function fire(from, depth = 0, except = -1) {
      const options = neighbours(from, except);
      if (!options.length) return;
      pulses.push({ from, to: pick(options), t: 0, speed: random(0.9, 1.6), depth });
    }

    function update(dt) {
      const size = fontSize();
      streams.forEach(stream => {
        stream.head += stream.speed * dt;
        stream.scramble -= dt;
        if (stream.head - stream.length * size * 1.25 > height) spawnStream(stream);
      });

      const scroll = window.scrollY;
      const drift = Math.max(-40, Math.min(40, (scroll - lastScroll) * 0.12));
      lastScroll = scroll;
      nodes.forEach(node => {
        if (pointer.active) {
          const dx = pointer.x - node.x, dy = pointer.y - node.y, distance = Math.hypot(dx, dy);
          if (distance < 180 && distance > 30) { node.vx += (dx / distance) * 6 * dt; node.vy += (dy / distance) * 6 * dt; }
        }
        const speed = Math.hypot(node.vx, node.vy);
        if (speed > 28) { node.vx *= 28 / speed; node.vy *= 28 / speed; }
        node.x += node.vx * dt;
        node.y += node.vy * dt - drift;
        node.energy = Math.max(0, node.energy - dt * 1.4);
        if (node.x < -20) node.x = width + 20; else if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20; else if (node.y > height + 20) node.y = -20;
      });

      nextPulse -= dt;
      if (nextPulse <= 0) { fire(Math.floor(Math.random() * nodes.length)); nextPulse = random(0.3, 0.8); }
      pulses = pulses.filter(pulse => {
        pulse.t += pulse.speed * dt;
        if (pulse.t < 1) return true;
        nodes[pulse.to].energy = 1;
        if (pulse.depth < 4 && Math.random() < 0.6) fire(pulse.to, pulse.depth + 1, pulse.from);
        return false;
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      const strength = dark ? 1 : 0.75;

      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
        glow.addColorStop(0, colors.glow);
        glow.addColorStop(1, 'transparent');
        context.globalAlpha = dark ? 0.16 : 0.1;
        context.fillStyle = glow;
        context.fillRect(pointer.x - 320, pointer.y - 320, 640, 640);
      }

      const size = fontSize(), lineHeight = size * 1.25;
      context.font = `${size}px "IBM Plex Mono", monospace`;
      context.textAlign = 'center';
      context.fillStyle = colors.code;
      streams.forEach(stream => {
        const headRow = Math.floor(stream.head / lineHeight);
        for (let step = 0; step < stream.length; step += 1) {
          const row = headRow - step;
          const y = row * lineHeight;
          if (y < -lineHeight || y > height + lineHeight) continue;
          let char = stream.text[((row % stream.text.length) + stream.text.length) % stream.text.length];
          if (step === 0 && Math.random() < 0.3) char = pick(glyphs);
          if (char === ' ') continue;
          context.globalAlpha = (step === 0 ? 0.5 : 0.3 * (1 - step / stream.length)) * strength;
          context.fillText(char, stream.x, y);
        }
      });

      const reach = linkDistance();
      context.lineWidth = 1;
      context.strokeStyle = colors.node;
      for (let a = 0; a < nodes.length; a += 1) {
        for (let b = a + 1; b < nodes.length; b += 1) {
          const distance = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
          if (distance >= reach) continue;
          context.globalAlpha = (1 - distance / reach) ** 1.5 * 0.38 * strength;
          context.beginPath();
          context.moveTo(nodes[a].x, nodes[a].y);
          context.lineTo(nodes[b].x, nodes[b].y);
          context.stroke();
        }
        if (pointer.active) {
          const distance = Math.hypot(nodes[a].x - pointer.x, nodes[a].y - pointer.y);
          if (distance < 180) {
            context.globalAlpha = (1 - distance / 180) * 0.45 * strength;
            context.beginPath();
            context.moveTo(nodes[a].x, nodes[a].y);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
          }
        }
      }

      context.strokeStyle = colors.pulse;
      context.fillStyle = colors.pulse;
      pulses.forEach(pulse => {
        const from = nodes[pulse.from], to = nodes[pulse.to];
        const x = from.x + (to.x - from.x) * pulse.t, y = from.y + (to.y - from.y) * pulse.t;
        context.globalAlpha = 0.55 * strength;
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(from.x + (to.x - from.x) * Math.max(0, pulse.t - 0.35), from.y + (to.y - from.y) * Math.max(0, pulse.t - 0.35));
        context.lineTo(x, y);
        context.stroke();
        context.globalAlpha = 0.18 * strength;
        context.beginPath(); context.arc(x, y, 7, 0, Math.PI * 2); context.fill();
        context.globalAlpha = 0.9 * strength;
        context.beginPath(); context.arc(x, y, 2, 0, Math.PI * 2); context.fill();
      });

      nodes.forEach(node => {
        if (node.energy > 0) {
          context.fillStyle = colors.pulse;
          context.globalAlpha = node.energy * 0.22 * strength;
          context.beginPath(); context.arc(node.x, node.y, node.r + 9 * node.energy, 0, Math.PI * 2); context.fill();
        }
        context.fillStyle = node.energy > 0.3 ? colors.pulse : colors.node;
        context.globalAlpha = (0.55 + node.energy * 0.45) * strength;
        context.beginPath(); context.arc(node.x, node.y, node.r + node.energy * 1.2, 0, Math.PI * 2); context.fill();
      });
      context.globalAlpha = 1;
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
    // A click sets off a small cascade from the neurons closest to it.
    const onPointerDown = event => {
      if (!running) return;
      nodes.map((node, index) => ({ index, distance: Math.hypot(node.x - event.clientX, node.y - event.clientY) }))
        .sort((a, b) => a.distance - b.distance).slice(0, 3)
        .forEach(({ index }) => { nodes[index].energy = 1; fire(index); fire(index); });
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => { resize(); if (!running) draw(); };

    engine.current = {
      paused: false,
      setPaused(value) { this.paused = value; value ? stop() : start(); },
      setTheme(value) { dark = value === 'dark'; colors = readColors(); if (!running) draw(); }
    };

    resize();
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
