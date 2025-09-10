import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '', 
  showText = true 
}) => {
  const sizeClasses = {
    small: 'h-10',
    medium: 'h-16',
    large: 'h-20'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image */}
      <img
        src="/images/valentia-logo.png"
        alt="Valentia Cabin Crew Academy"
        className={`${sizeClasses[size]} w-auto object-contain`}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {/* Company Name - Always visible and prominent */}
      <div className="ml-4">
        <div className="text-lg sm:text-2xl font-bold text-gray-900 tracking-wide leading-tight">VALENTIA</div>
        <div className="text-xs sm:text-sm text-gray-600 font-medium tracking-wider leading-tight">CABIN CREW ACADEMY</div>
      </div>
    </div>
  );
};

export default Logo;
