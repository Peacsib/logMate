import React from 'react';

interface ElegantTextProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-[1.15em]',
};

/**
 * Elegant Text Component with Italic Styling and Decorative Underline
 * 
 * Usage:
 * <ElegantText>Your Text</ElegantText>
 * <ElegantText underlineColor="#ff8c00" glowColor="rgba(255, 140, 0, 0.4)">Custom Colors</ElegantText>
 */
export function ElegantText({ 
  children, 
  className = '', 
  underlineColor = '#ff8c00',
  glowColor = 'rgba(255, 140, 0, 0.4)',
  size = 'xl'
}: ElegantTextProps) {
  const glowStyle = {
    textShadow: `0 2px 20px ${glowColor}, 0 0 30px ${glowColor.replace('0.4', '0.2')}`
  };

  return (
    <span 
      className={`inline-block relative font-['Playfair_Display'] italic font-semibold text-[#ffa726] ${sizeClasses[size]} ${className}`}
      style={glowStyle}
    >
      {children}
      <svg 
        className="absolute -bottom-1 left-0 w-full h-2" 
        viewBox="0 0 100 8" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,7 Q25,0 50,5 T100,4" 
          stroke={underlineColor} 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.6"
        />
      </svg>
    </span>
  );
}

/**
 * Simpler version without underline, just the elegant italic glow
 */
export function ElegantTextSimple({ 
  children, 
  className = '',
  glowColor = 'rgba(255, 140, 0, 0.4)',
  size = 'xl'
}: Omit<ElegantTextProps, 'underlineColor'>) {
  const glowStyle = {
    textShadow: `0 2px 20px ${glowColor}, 0 0 30px ${glowColor.replace('0.4', '0.2')}`
  };

  return (
    <span 
      className={`inline-block font-['Playfair_Display'] italic font-semibold text-[#ffa726] ${sizeClasses[size]} ${className}`}
      style={glowStyle}
    >
      {children}
    </span>
  );
}
