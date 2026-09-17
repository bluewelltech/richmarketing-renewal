import { useEffect, useRef, useState } from 'react';
import { media, patentImages } from '../data';
import { SafeImage } from './SafeImage';

const slides = [{ src: media.certificate, alt: '특허출원증명서 결과물 예시' }, ...patentImages];

export function BookShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [{ index, previous }, setSlide] = useState({ index: 0, previous: 0 });
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(ref.current!);
    const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mediaQuery.matches);
    update(); mediaQuery.addEventListener('change', update);
    return () => { observer.disconnect(); mediaQuery.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    if (!visible || focused || reduced) return;
    const timer = setInterval(() => {
      if (!document.hidden) setSlide(s => ({ index: s.index + 1, previous: s.index }));
    }, 4200);
    return () => clearInterval(timer);
  }, [visible, focused, reduced]);
  const active = ((index % slides.length) + slides.length) % slides.length;
  const previousIndex = ((previous % slides.length) + slides.length) % slides.length;
  return <div ref={ref} className="book-showcase" role="region" aria-roledescription="캐러셀"
    aria-label={`결과물 예시, 현재 ${active + 1}/${slides.length}. 좌우 방향키로 이동`} tabIndex={0}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onKeyDown={e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); setSlide(s => ({ index: s.index + (e.key === 'ArrowRight' ? 1 : -1), previous: s.index }));
      }
    }}>
    <div className="book-showcase__pages" key={index}>
      <figure className="book-showcase__page book-showcase__current">
        <SafeImage src={slides[active].src} alt={slides[active].alt} loading="lazy" />
      </figure>
      {index !== 0 && !reduced && <figure className="book-showcase__page book-showcase__turning" aria-hidden="true">
        <SafeImage src={slides[previousIndex].src} alt="" loading="lazy" />
      </figure>}
    </div>
    <div className="book-showcase__dots" aria-hidden="true">{slides.map((slide, i) => <span key={slide.src} className={i === active ? 'is-active' : ''} />)}</div>
  </div>;
}
