import React from 'react';
import { useTheme } from './ThemeContext';

export interface PawelleLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
  alt?: string;
}

/**
 * Theme-Aware PAWELLE Brand Logo Component
 * 
 * Automatically switches between authentic light and dark SVG assets
 * based on current theme context or explicit variant specification.
 * Eliminates CSS filter inversions and ensures high-contrast readability.
 */
export const PawelleLogo: React.FC<PawelleLogoProps> = ({
  variant = 'auto',
  height = '44px',
  style,
  className,
  alt = 'PAWELLE Luxury Pet Grooming & Spa'
}) => {
  const { theme } = useTheme();

  const isDark = variant === 'dark' || (variant === 'auto' && theme === 'dark');
  const logoSrc = isDark ? '/assets/logos/pawelle-logo-dark.svg' : '/assets/logos/pawelle-logo.svg';

  return (
    <img
      src={logoSrc}
      alt={alt}
      style={{
        height,
        width: 'auto',
        display: 'block',
        ...style
      }}
      className={className}
    />
  );
};

export default PawelleLogo;
