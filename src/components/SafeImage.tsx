import { useState, type ImgHTMLAttributes } from 'react';

// Keep the designed space, without a broken-image glyph or replacement message.
export function SafeImage({ src, alt, className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return <img {...props} src={src} alt={alt} draggable={false} decoding="async"
    className={`${className} ${failedSrc === src ? 'image-unavailable' : ''}`}
    onError={() => setFailedSrc(src)} />;
}
