import { useState } from 'react';
import { packages } from '../data';

export function Pricing() {
  const [selected, setSelected] = useState<number | null>(null);
  return <div className="pricing-grid" role="group" aria-label="IP 마케팅 패키지 선택">
    {packages.map(item => <button type="button" key={item.count} aria-pressed={selected === item.count}
      aria-label={`${item.count}건 ${item.price}만원${item.count > 1 ? `씩, 총 ${item.total}만원` : ''}`}
      onClick={() => setSelected(item.count)}
      className={`pricing-card ${item.count === 4 ? 'pricing-card--recommended' : ''} ${selected === item.count ? 'is-selected' : ''}`}>
      <span className="pricing-card__label">{item.label}</span>
      <span className="pricing-card__title">{item.title}</span>
      <span className="pricing-card__price">{item.price}만원{item.count > 1 && <small> × {item.count}건</small>}</span>
      <span className="pricing-card__footer">
        <span className="pricing-card__total">{item.count === 1 ? '1건 기준' : `총 ${item.total}만원`}</span>
        <span className="pricing-card__select" aria-hidden="true">{selected === item.count ? '선택됨 ✓' : '선택하기 →'}</span>
      </span>
    </button>)}
  </div>;
}
