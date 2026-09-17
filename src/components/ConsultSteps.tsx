import { useEffect, useRef } from 'react';

export function ConsultSteps() {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.active = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <ol ref={ref} className="consult-steps" aria-label="상담 설계 단계">
    {['제품 분석', '소구점 발굴', '특허명칭·출원방향 제안'].map((text, i) =>
      <li key={text}><span>0{i + 1}</span><strong>{text}</strong></li>)}
  </ol>;
}
