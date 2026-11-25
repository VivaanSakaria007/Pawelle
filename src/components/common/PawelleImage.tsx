import React, { useState, useEffect } from 'react';

interface PawelleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

/**
 * Resilient Image Component for PAWELLE
 * 
 * Automatically intercepts network or 404 asset failures and smoothly
 * falls back to verified local vector assets without broken image icons.
 */
export const PawelleImage: React.FC<PawelleImageProps> = ({
  src,
  alt,
  fallbackSrc = '/assets/products/botanical-shampoo.jpg',
  style,
  className,
  ...props
}) => {
  const normalizedSrc = (src || '').trim() || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(normalizedSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(normalizedSrc);
    setHasError(false);
  }, [normalizedSrc]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      className={className}
      style={{
        ...style,
        transition: 'opacity 0.2s ease-in-out'
      }}
      loading="lazy"
      {...props}
    />
  );
};

export default PawelleImage;
