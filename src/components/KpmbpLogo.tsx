import React from 'react';
import { KPMBP_ASSETS } from '../constants/assets';

interface KpmbpLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
  rounded?: boolean;
}

export const KpmbpLogo: React.FC<KpmbpLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  alt = "Logo Kontinjen KPMBP",
  rounded = true
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src={KPMBP_ASSETS.logo192}
      alt={alt}
      className={`shrink-0 select-none object-contain ${rounded ? 'rounded-xl overflow-hidden' : ''} ${className}`}
      style={style}
    />
  );
};


