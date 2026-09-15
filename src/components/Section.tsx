import type { ReactNode } from 'react';
import { figmaAsset } from '../data';

export function Glow({ asset, className = '' }: { asset: string; className?: string }) {
  return <img className={`section-glow ${className}`} src={figmaAsset(asset)} width="920" height="520" alt="" aria-hidden="true" />;
}
export function Section({ id, theme = 'light', className = '', children, nodeId, glow }: {
  id: string; theme?: 'light' | 'soft' | 'dark'; className?: string; children: ReactNode; nodeId: string; glow?: string;
}) {
  return <section id={id} className={`section section--${theme} ${className}`} data-figma-node={nodeId}>
    {glow && <Glow asset={glow} />}
    <div className="container section__inner">{children}</div>
  </section>;
}
