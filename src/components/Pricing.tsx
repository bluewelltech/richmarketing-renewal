import { packages } from '../data';

export function Pricing() {
  return <div className="pricing-grid" role="group" aria-label="IP 마케팅 패키지 가격">
    {packages.map(item => <article key={item.count}
      aria-label={`${item.count}건 ${item.price}만원${item.count > 1 ? `씩, 총 ${item.total}만원` : ''}`}
      className={`pricing-card ${item.count === 4 ? 'pricing-card--recommended' : ''}`}>
      <span className="pricing-card__label">{item.label}</span>
      <span className="pricing-card__title">{item.title}</span>
      <span className="pricing-card__price">{item.price}만원{item.count > 1 && <small> × {item.count}건</small>}</span>
      <span className="pricing-card__footer">
        <span className="pricing-card__total">{item.count === 1 ? '1건 기준' : `총 ${item.total}만원`}</span>
      </span>
    </article>)}
  </div>;
}
