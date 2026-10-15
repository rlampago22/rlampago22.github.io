import { useEffect, useRef, useState } from 'react';
import './KineticTitle.css';

// All effect layers share the same glyphs, so their paint stays inside the
// letters. Assistive technology receives the name once, without scrambling.
export default function KineticTitle({ text = 'Marcus Querol', paused = false }) {
  const stopped = Boolean(paused);
  const triggerRef = useRef(null);
  const burstTimer = useRef(null);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (stopped) {
      clearTimeout(burstTimer.current);
      setBurst(false);
    }
    return () => clearTimeout(burstTimer.current);
  }, [stopped]);

  function highlight(event) {
    if (stopped || event.pointerType === 'touch') return;
    const box = event.currentTarget.getBoundingClientRect();
    triggerRef.current.style.setProperty('--letter-pointer-x', `${((event.clientX - box.left) / box.width) * 100}%`);
    triggerRef.current.style.setProperty('--letter-pointer-y', `${((event.clientY - box.top) / box.height) * 100}%`);
  }

  function replay() {
    if (stopped) return;
    clearTimeout(burstTimer.current);
    setBurst(true);
    burstTimer.current = setTimeout(() => setBurst(false), 1500);
  }

  return <span className={`kinetic-title${burst ? ' is-burst' : ''}`} data-paused={stopped}>
    <button ref={triggerRef} className="kinetic-title__trigger" type="button" onClick={replay} onPointerMove={highlight} onPointerLeave={() => {
      triggerRef.current.style.setProperty('--letter-pointer-x', '50%');
      triggerRef.current.style.setProperty('--letter-pointer-y', '50%');
    }} disabled={stopped} title="Passe o cursor, toque ou pressione Enter para iluminar as letras">
      <span className="kinetic-title__accessible">{text}.</span>
      <span className="kinetic-title__visual" aria-hidden="true">
        <span className="kinetic-title__word">
          <span className="kinetic-title__base">{text}</span>
          <span className="kinetic-title__ink">{text}</span>
          <span className="kinetic-title__code">{text}</span>
        </span><span className="kinetic-title__dot">.</span>
      </span>
    </button>
  </span>;
}
