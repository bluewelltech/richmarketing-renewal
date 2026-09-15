import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { SafeImage } from './SafeImage';

type Slide = { src: string; alt: string; label?: string };
type Props = { slides: Slide[]; variant: 'hero' | 'patent'; label: string; interval: number; initial: number };
const mod = (value: number, length: number) => ((value % length) + length) % length;

// Cards keep stable keys as they cross the viewport; extra copies make wraparound continuous.
export function Carousel({ slides, variant, label, interval, initial }: Props) {
  const [position, setPosition] = useState(initial);
  const [drag, setDrag] = useState(0);
  const [width, setWidth] = useState(1120);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; dx: number } | null>(null);
  const blockedUntil = useRef(0);
  const id = useId();
  const scale = Math.min(1, Math.max(width / 1120, variant === 'hero' ? 0.76 : 0.85));
  const pitch = (variant === 'hero' ? 387.5 : 229) * scale;
  const advance = useCallback((direction: number) => {
    blockedUntil.current = Date.now() + 3000;
    setPosition(p => p + direction);
    setTimerVersion(v => v + 1);
  }, []);

  useEffect(() => {
    const el = viewport.current!;
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    onMotion(); media.addEventListener('change', onMotion);
    resize.observe(el); intersection.observe(el);
    return () => { resize.disconnect(); intersection.disconnect(); media.removeEventListener('change', onMotion); };
  }, []);

  useEffect(() => {
    if (paused || focused || reducedMotion || !visible) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (delay: number) => { timer = setTimeout(tick, delay); };
    const tick = () => {
      const remaining = blockedUntil.current - Date.now();
      if (remaining > 0 || pointer.current || document.hidden) { schedule(Math.max(remaining, 150)); return; }
      setPosition(p => p + 1);
      schedule(interval);
    };
    schedule(Math.max(0, blockedUntil.current - Date.now()) || interval);
    return () => clearTimeout(timer);
  }, [interval, paused, focused, reducedMotion, visible, timerVersion]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    pointer.current = { id: event.pointerId, x: event.clientX, dx: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    pointer.current.dx = event.clientX - pointer.current.x;
    setDrag(Math.max(-pitch, Math.min(pitch, pointer.current.dx)));
  }
  function finishPointer(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    if (!cancelled && Math.abs(current.dx) > 35) advance(current.dx < 0 ? 1 : -1);
    blockedUntil.current = Date.now() + 3000;
    pointer.current = null; setDrag(0);
    setTimerVersion(v => v + 1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const active = mod(position, slides.length);
  const slots = Array.from({ length: slides.length * 2 + 3 }, (_, i) => position - slides.length - 1 + i);

  function cardStyle(slot: number): CSSProperties {
    const distance = slot - position + drag / pitch;
    const abs = Math.abs(distance);
    const blend = (a: number, b: number, t: number) => a + (b - a) * t;
    let x: number, w: number, h: number, opacity: number;
    if (variant === 'hero') {
      x = abs <= 1 ? abs * 387.5 : 387.5 + (abs - 1) * 365;
      w = blend(390, 345, Math.min(abs, 1));
      h = blend(276, 250, Math.min(abs, 1));
      opacity = blend(1, 0.78, Math.min(abs, 1));
    } else {
      x = abs <= 1 ? abs * 229 : abs <= 2 ? 229 + (abs - 1) * 187 : 416 + (abs - 2) * 176;
      w = abs <= 1 ? blend(248, 186, abs) : blend(186, 164, Math.min(abs - 1, 1));
      h = abs <= 1 ? blend(320, 258, abs) : blend(258, 228, Math.min(abs - 1, 1));
      opacity = abs <= 1 ? blend(1, 0.86, abs) : blend(0.86, 0.68, Math.min(abs - 1, 1));
    }
    return { width: w * scale, height: h * scale, opacity, zIndex: 10 - Math.round(abs),
      transform: `translate(calc(-50% + ${Math.sign(distance) * x * scale}px), -50%)`,
      transitionDuration: drag ? '0ms' : undefined };
  }

  return <div className={`carousel carousel--${variant}`} role="region" aria-roledescription="캐러셀" aria-label={label}
    onPointerDownCapture={() => setFocused(false)}
    onFocusCapture={e => { if (e.target.matches(':focus-visible')) setFocused(true); }}
    onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div ref={viewport} id={id} className="carousel__viewport" tabIndex={0}
      aria-label={`${label}, 현재 ${active + 1}/${slides.length}. 좌우 방향키로 이동`}
      onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); advance(e.key === 'ArrowLeft' ? -1 : 1); } }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={e => finishPointer(e)}
      onPointerCancel={e => finishPointer(e, true)} onLostPointerCapture={e => finishPointer(e, true)}>
      {slots.map(slot => {
        const item = slides[mod(slot, slides.length)];
        const isCopy = Math.abs(slot - position) > Math.floor(slides.length / 2);
        return <figure className={`carousel__card ${slot === position ? 'is-center' : ''}`} style={cardStyle(slot)} key={slot}
          aria-hidden={isCopy || undefined} role="group" aria-roledescription="슬라이드" aria-label={`${mod(slot, slides.length) + 1}/${slides.length}`}>
          <div className="carousel__image"><SafeImage src={item.src} alt={isCopy ? '' : item.alt} loading={variant === 'hero' ? 'eager' : 'lazy'} /></div>
          {item.label && <figcaption>{item.label}</figcaption>}
        </figure>;
      })}
    </div>
    <div className="carousel__controls">
      <button type="button" onClick={() => advance(-1)} aria-label={`${label} 이전`} aria-controls={id}>←</button>
      <button type="button" onClick={() => setPaused(p => !p)} aria-label={`${label} ${paused ? '자동재생 시작' : '자동재생 일시정지'}`} aria-pressed={paused} disabled={reducedMotion}>{paused ? '재생' : '일시정지'}</button>
      <button type="button" onClick={() => advance(1)} aria-label={`${label} 다음`} aria-controls={id}>→</button>
    </div>
  </div>;
}
