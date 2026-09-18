import { useEffect, useState } from 'react';
import { media, patentImages } from '../data';
import { SafeImage } from './SafeImage';

const slides = [{ src: media.certificate, alt: '특허출원증명서 결과물 예시' }, ...patentImages];

export function BookShowcase() {
  const [{ index, previous }, setSlide] = useState({ index: 0, previous: 0 });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mediaQuery.matches);
    update(); mediaQuery.addEventListener('change', update);
    return () => { mediaQuery.removeEventListener('change', update); };
  }, []);
  const active = ((index % slides.length) + slides.length) % slides.length;
  const previousIndex = ((previous % slides.length) + slides.length) % slides.length;
  function move(direction: number) {
    setSlide(s => ({ previous: s.index, index: Math.max(0, Math.min(slides.length - 1, s.index + direction)) }));
  }
  return <div className="book-showcase" role="region" aria-roledescription="캐러셀"
    aria-label={`결과물 예시, 현재 ${active + 1}/${slides.length}. 좌우 방향키로 이동`} tabIndex={0}
    onKeyDown={e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <div className="book-showcase__pages" key={index}>
      <figure className="book-showcase__page book-showcase__current">
        <SafeImage src={slides[active].src} alt={slides[active].alt} loading="lazy" />
      </figure>
      {index !== previous && !reduced && <figure className="book-showcase__page book-showcase__turning" aria-hidden="true">
        <SafeImage src={slides[previousIndex].src} alt="" loading="lazy" />
      </figure>}
    </div>
    <div className="book-showcase__controls">
      {active > 0 && <button type="button" onClick={() => move(-1)}>← 뒤로가기</button>}
      <button type="button" onClick={() => move(1)} disabled={active === slides.length - 1}>
        {active === 0 ? '상세페이지 활용방안 예시보기' : '다음 예시보기'} <span aria-hidden="true">→</span>
      </button>
    </div>
    <p className="sr-only" aria-live="polite">{active === 0 ? '특허출원증명서' : `활용 사례 ${active}`} ({active + 1}/{slides.length})</p>
    <div className="book-showcase__dots" aria-hidden="true">{slides.map((slide, i) => <span key={slide.src} className={i === active ? 'is-active' : ''} />)}</div>
  </div>;
}
