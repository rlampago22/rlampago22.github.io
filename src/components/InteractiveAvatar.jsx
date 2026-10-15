import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimate, useSpring } from 'motion/react';
import './InteractiveAvatar.css';

const spring = { stiffness: 125, damping: 19, mass: 0.8 };
const clamp = value => Math.max(-1, Math.min(1, value));

// The supplied portrait is a transparent image. Nested transforms give it
// depth and a responsive greeting without pretending it is a rigged model.
export default function InteractiveAvatar({ src, paused = false, onRequestMotion, alt = 'Retrato de Marcus Querol com boina bordô' }) {
  const stopped = Boolean(paused);
  const stageRef = useRef(null);
  const greetingTimer = useRef(null);
  const autoplayTimer = useRef(null);
  const imageRef = useRef(null);
  const autoGreeted = useRef(false);
  const playbackRef = useRef(null);
  const busyRef = useRef(false);
  const [greeting, setGreeting] = useState(false);
  const [reactionScope, animate] = useAnimate();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const center = useCallback((instant = false) => {
    [rotateX, rotateY, x, y].forEach(value => instant ? value.jump(0) : value.set(0));
  }, [rotateX, rotateY, x, y]);

  useEffect(() => {
    const stage = stageRef.current;
    if (stopped || !stage) {
      center(true);
      playbackRef.current?.stop();
      clearTimeout(greetingTimer.current);
      clearTimeout(autoplayTimer.current);
      autoGreeted.current = false;
      busyRef.current = false;
      setGreeting(false);
      if (reactionScope.current) {
        reactionScope.current.style.transform = 'none';
      }
      return undefined;
    }
    const surface = stage.closest('.hero') || stage;
    const follow = event => {
      if (event.pointerType === 'touch') return;
      const box = stage.getBoundingClientRect();
      const horizontal = clamp((event.clientX - box.left - box.width / 2) / (box.width / 2));
      const vertical = clamp((event.clientY - box.top - box.height / 2) / (box.height / 2));
      rotateX.set(vertical * -8);
      rotateY.set(horizontal * 13);
      x.set(horizontal * 8);
      y.set(vertical * 5);
    };
    const leave = () => center();
    surface.addEventListener('pointermove', follow, { passive: true });
    surface.addEventListener('pointerleave', leave);
    return () => {
      surface.removeEventListener('pointermove', follow);
      surface.removeEventListener('pointerleave', leave);
    };
  }, [stopped, center, rotateX, rotateY, x, y, reactionScope]);

  useEffect(() => () => {
    clearTimeout(greetingTimer.current);
    clearTimeout(autoplayTimer.current);
    playbackRef.current?.stop();
  }, []);

  const greet = useCallback(() => {
    if (stopped || busyRef.current) return;
    busyRef.current = true;
    center();
    setGreeting(true);
    playbackRef.current = animate(reactionScope.current, {
      rotate: [0, -7, 6, -4, 2, 0],
      y: [0, -14, -4, -11, -3, 0],
      scale: [1, 1.035, 1.01, 1.025, 1.01, 1],
    }, { duration: 1.45, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' });
    clearTimeout(greetingTimer.current);
    greetingTimer.current = setTimeout(() => {
      busyRef.current = false;
      setGreeting(false);
    }, 1900);
  }, [stopped, center, animate, reactionScope]);

  useEffect(() => {
    if (stopped) return undefined;
    const image = imageRef.current;
    const begin = () => {
      if (autoGreeted.current) return;
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = setTimeout(() => {
        autoGreeted.current = true;
        greet();
      }, 350);
    };
    if (image?.complete && image.naturalWidth > 0) begin();
    else image?.addEventListener('load', begin, { once: true });
    return () => {
      clearTimeout(autoplayTimer.current);
      image?.removeEventListener('load', begin);
    };
  }, [stopped, greet]);

  function interact() {
    if (stopped && onRequestMotion) onRequestMotion();
    else greet();
  }

  return <div ref={stageRef} className={`portrait-stage interactive-avatar${greeting ? ' is-greeting' : ''}`} data-paused={stopped}>
    <div className="portrait-halo" aria-hidden="true" />
    <div className="portrait-float interactive-avatar__float">
      <motion.div className="interactive-avatar__tilt" style={{ rotateX, rotateY, x, y }}>
        <button className="interactive-avatar__portrait-button" onClick={interact} disabled={stopped && !onRequestMotion} aria-label="Acenar com o avatar de Marcus" title={stopped ? 'Toque para ativar as animações' : 'Clique ou toque para acenar'}>
          <div ref={reactionScope} className="interactive-avatar__reaction">
            <img ref={imageRef} className="portrait" src={src} alt={alt} fetchPriority="high" width="1254" height="1254" draggable="false" />
          </div>
        </button>
      </motion.div>
    </div>
    <div className="portrait-shadow" aria-hidden="true" />
    <span className="interactive-avatar__greeting" aria-hidden="true">olá! <span>👋</span></span>
    <div className="interactive-avatar__controls">
      <span className="interactive-avatar__hint">{stopped ? 'pausado · toque para retomar' : 'animação automática · mova o cursor'}</span>
    </div>
  </div>;
}
