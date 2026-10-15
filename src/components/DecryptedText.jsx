'use client';

// Adapted from the React Bits component supplied with this project.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './DecryptedText.css';

export default function DecryptedText({
  text = '',
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  reducedMotion = false,
  pauseMotion = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}) {
  const original = String(text);
  const letters = useMemo(() => Array.from(original), [original]);
  const available = useMemo(() => {
    const source = useOriginalCharsOnly ? [...new Set(letters)].filter(char => !/\s/.test(char)) : Array.from(characters);
    return source.length ? source : ['_'];
  }, [letters, useOriginalCharsOnly, characters]);
  const order = useMemo(() => {
    const indices = letters.map((_, index) => index);
    if (revealDirection === 'end') return indices.reverse();
    if (revealDirection === 'center') {
      const center = Math.floor(letters.length / 2);
      return indices.sort((a, b) => Math.abs(a - center) - Math.abs(b - center) || b - a);
    }
    return indices;
  }, [letters, revealDirection]);
  const prefersReducedMotion = Boolean(reducedMotion || pauseMotion);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const decryptedRef = useRef(true);
  const busyRef = useRef(false);
  const [frame, setFrame] = useState({ chars: letters, revealed: new Set(), complete: true });

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    busyRef.current = false;
  }, []);

  const scramble = useCallback(revealed => letters.map((char, index) => (
    /\s/.test(char) || revealed.has(index) ? char : available[Math.floor(Math.random() * available.length)]
  )), [letters, available]);

  const showOriginal = useCallback(() => {
    stop();
    decryptedRef.current = true;
    setFrame({ chars: letters, revealed: new Set(), complete: true });
  }, [letters, stop]);

  const animate = useCallback((reverse = false) => {
    if (prefersReducedMotion || !letters.length) {
      showOriginal();
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    let iteration = 0;
    let revealed = reverse ? new Set(order) : new Set();
    const revealOrder = reverse ? [...order].reverse() : order;
    setFrame({ chars: reverse ? letters : scramble(revealed), revealed: new Set(revealed), complete: false });

    timerRef.current = setInterval(() => {
      iteration += 1;
      if (sequential) {
        const index = revealOrder[iteration - 1];
        if (reverse) revealed.delete(index);
        else revealed.add(index);
      } else if (reverse) {
        const remaining = [...revealed].sort(() => Math.random() - 0.5);
        const count = Math.max(1, Math.ceil(letters.length / Math.max(1, maxIterations)));
        remaining.slice(0, count).forEach(index => revealed.delete(index));
      }
      const done = sequential ? iteration >= letters.length : iteration >= Math.max(1, maxIterations);
      if (done) {
        stop();
        decryptedRef.current = !reverse;
        revealed = reverse ? new Set() : new Set(order);
      }
      setFrame({
        chars: done && !reverse ? letters : scramble(revealed),
        revealed: new Set(revealed),
        complete: done && !reverse,
      });
    }, Math.max(16, Number(speed) || 50));
  }, [letters, maxIterations, order, prefersReducedMotion, scramble, sequential, showOriginal, speed, stop]);

  useEffect(() => {
    stop();
    const initiallyEncrypted = animateOn === 'click' && !prefersReducedMotion;
    decryptedRef.current = !initiallyEncrypted;
    setFrame({ chars: initiallyEncrypted ? scramble(new Set()) : letters, revealed: new Set(), complete: !initiallyEncrypted });
    return stop;
  }, [animateOn, letters, prefersReducedMotion, scramble, stop]);

  useEffect(() => {
    if (!['view', 'inViewHover'].includes(animateOn) || prefersReducedMotion) return undefined;
    const element = containerRef.current;
    if (!element) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      animate();
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      animate();
      observer.disconnect();
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [animate, animateOn, prefersReducedMotion]);

  const hover = animateOn === 'hover' || animateOn === 'inViewHover';
  const clickable = animateOn === 'click';
  const Wrapper = clickable ? motion.button : motion.span;

  return (
    <Wrapper
      {...props}
      ref={containerRef}
      type={clickable ? 'button' : undefined}
      tabIndex={props.tabIndex ?? (hover ? 0 : undefined)}
      className={`decrypted-text${clickable ? ' decrypted-text--button' : ''}${parentClassName ? ` ${parentClassName}` : ''}`}
      onClick={event => {
        onClick?.(event);
        if (event.defaultPrevented || !clickable) return;
        if (clickMode === 'toggle') animate(decryptedRef.current);
        else if (!decryptedRef.current) animate();
      }}
      onMouseEnter={event => { onMouseEnter?.(event); if (hover && !event.defaultPrevented) animate(); }}
      onMouseLeave={event => { onMouseLeave?.(event); if (hover && !event.defaultPrevented) showOriginal(); }}
      onFocus={event => { onFocus?.(event); if (hover && !event.defaultPrevented) animate(); }}
      onBlur={event => { onBlur?.(event); if (hover && !event.defaultPrevented) showOriginal(); }}
    >
      <span className="decrypted-text__accessible">{original}</span>
      <span aria-hidden="true">
        {frame.chars.map((char, index) => (
          <span key={index} className={frame.complete || frame.revealed.has(index) ? className : encryptedClassName}>{char}</span>
        ))}
      </span>
    </Wrapper>
  );
}
