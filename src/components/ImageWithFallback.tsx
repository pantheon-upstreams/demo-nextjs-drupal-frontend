'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  // Accepted for backwards compatibility; no longer used now that the fallback
  // is a single Pantheon brand placeholder rather than a seeded random image.
  fallbackSeed?: number;
  fallbackKey?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

// Pantheon brand placeholder used when an image is missing or fails to load.
const FALLBACK_SRC = '/brand/placeholder.png';

export function ImageWithFallback({
  src,
  alt,
  className = '',
  width = 1200,
  height = 600,
  fill = false,
  priority,
}: ImageWithFallbackProps) {
  // Ensure alt text is never undefined
  const altText = alt || 'Image';
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== FALLBACK_SRC) {
      setHasError(true);
      setImgSrc(FALLBACK_SRC);
    }
  };

  // If no src provided, use fallback immediately
  const finalSrc = imgSrc || FALLBACK_SRC;

  // Auto-determine priority if not explicitly set
  const shouldPrioritize = priority !== undefined ? priority : (width > 1000 || fill);

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={altText}
        fill
        className={className}
        onError={handleError}
        priority={shouldPrioritize}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={altText}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={shouldPrioritize}
    />
  );
}
