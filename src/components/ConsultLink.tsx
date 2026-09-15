import { CONSULT_URL } from '../data';

export function ConsultLink({ tone = 'blue', compact = false }: { tone?: 'blue' | 'light'; compact?: boolean }) {
  return <a href={CONSULT_URL} target="_blank" rel="noopener noreferrer"
    className={`consult-link consult-link--${tone} ${compact ? 'consult-link--compact' : ''}`}>
    <span>특허 마케팅 신청하기</span>
    {!compact && <small>[ 내 제품 특허받기 ]</small>}
    <span className="sr-only"> (새 창)</span>
  </a>;
}
