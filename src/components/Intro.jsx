import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import PromptBar from './PromptBar';
import './Intro.css';

const storageKey = 'portfolio-intro-seen';
const command = 'ir para o portfólio do Marcus';

// Shown once per visit (browser session); a blocked storage just means it shows again.
export function shouldShowIntro() {
  try { return sessionStorage.getItem(storageKey) !== '1'; } catch { return true; }
}

export default function Intro({ onDone }) {
  const [busy, setBusy] = useState(false);
  const finished = useRef(false);
  const leaveTimer = useRef(null);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try { sessionStorage.setItem(storageKey, '1'); } catch {}
    onDone();
  }, [onDone]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = event => { if (event.key === 'Escape' || event.key === 'Enter') finish(); };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      clearTimeout(leaveTimer.current);
    };
  }, [finish]);

  function sent() {
    setBusy(true);
    leaveTimer.current = setTimeout(finish, 700);
  }

  return <motion.div className="intro" role="dialog" aria-modal="true" aria-label="Abertura do portfólio" onClick={finish}
    initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } }}>
    <motion.div className="intro__stage" exit={{ scale: 1.12, y: -24, opacity: 0, filter: 'blur(8px)', transition: { duration: 0.6, ease: [0.77, 0, 0.175, 1] } }}>
      <motion.span className="intro__label" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="intro__brand">m.</span> marcus querol · portfólio
      </motion.span>
      <motion.div className="intro__bar" inert initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
        <PromptBar
          placeholder="Pergunte qualquer coisa"
          sources={[]}
          commands={[]}
          models={[{ key: 'marcus', name: 'Marcus Querol', tag: 'Portfólio' }]}
          efforts={['Normal', 'Máximo']}
          defaultEffort="Máximo"
          busy={busy}
          onSend={sent}
          autoType={{ text: command, delay: 700, speed: 60, pause: 380 }}
          background="#29262d"
          color="#f6f5f7"
          menuBackground="#36323a"
          sparkColor="#e39ab6"
          sparkBoost={1.2}
          width={520}
          radius={18}
        />
      </motion.div>
    </motion.div>
    <button className="intro__skip" onClick={event => { event.stopPropagation(); finish(); }}>Pular intro <ArrowRight size={14} /></button>
  </motion.div>;
}
