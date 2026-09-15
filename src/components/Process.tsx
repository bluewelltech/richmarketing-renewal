import { useEffect, useRef } from 'react';
import { patentExamples } from '../data';

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    element.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.dataset.reveal = 'done'; observer.disconnect(); }
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    observer.observe(element);
    const onMotion = () => { if (motion.matches) { element.dataset.reveal = 'done'; observer.disconnect(); } };
    motion.addEventListener('change', onMotion);
    return () => { observer.disconnect(); motion.removeEventListener('change', onMotion); delete element.dataset.reveal; };
  }, []);
  const steps = [
    { title: '대표님:', body: <p className="process-examples"><span className="copy-line">“저는 주름 개선 화장품을 판매합니다.” <small>(예시)</small></span><span className="copy-line">“저는 다이어트 건강식품을 판매합니다.” <small>(예시)</small></span></p> },
    { title: 'RICH MARKETING:', body: <><p className="process-chain"><span className="copy-line"><span className="keep-together">제품 심층 분석</span> <span className="keep-together">→ 차별화·후킹 포인트 도출</span></span><span className="copy-line text-blue">→ 마케팅 최적화 특허명칭 제안</span></p><ol className="patent-examples">{patentExamples.map(text => <li key={text}>{text}</li>)}</ol></> },
    { title: '출원 진행', body: <><p className="process-key">평균 4시간 이내<br />특허출원서 즉시 확보</p><p className="process-note">※ 특허출원증명서는 평균 10일 이내 확보됩니다.</p></> },
    { title: '즉시 활용 가능', body: <><p className="process-key">광고 영상 · 상세페이지<br />메인 소재로 즉시 활용</p><p className="process-note">보도자료·영업자료에도 활용 가능</p></> },
  ];
  return <ol className="process-list" ref={ref} aria-label="특허 마케팅 진행 과정">
    {steps.map((step, i) => <li key={step.title} className="process-step" style={{ transitionDelay: `${i * 140}ms` }}>
      <span className="process-number">0{i + 1}</span>
      <div className="process-step__body"><h3>{step.title}</h3>{step.body}</div>
    </li>)}
  </ol>;
}
