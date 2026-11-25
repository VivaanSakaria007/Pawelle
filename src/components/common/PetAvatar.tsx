import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';

interface PetAvatarProps {
  photoUrl?: string;
  name: string;
  size?: number;
  bordered?: boolean;
}

/**
 * Renders a pet's uploaded photo when available, or a refined branded monogram badge
 * instead of assigning random stock pet photos.
 */
export const PetAvatar: React.FC<PetAvatarProps> = ({
  photoUrl,
  name,
  size = 60,
  bordered = false
}) => {
  const [imgError, setImgError] = useState(false);
  const trimmedUrl = photoUrl?.trim() || '';

  useEffect(() => {
    setImgError(false);
  }, [trimmedUrl]);

  if (trimmedUrl && !imgError) {
    return (
      <img
        src={trimmedUrl}
        alt={name}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: bordered ? '2px solid var(--color-sand)' : '1px solid var(--color-border)'
        }}
      />
    );
  }

  return (
    <div
      aria-label={`${name} avatar`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'var(--color-forest-soft)',
        color: 'var(--color-forest)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: bordered ? '2px solid var(--color-sand)' : '1px solid var(--color-border)'
      }}
    >
      <PawPrint size={Math.max(18, Math.round(size * 0.42))} />
    </div>
  );
};
