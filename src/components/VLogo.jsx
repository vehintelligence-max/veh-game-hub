import React from 'react';

export default function VLogo({ size = 'md', isDark = false, className = '' }) {
  const textColor = isDark ? 'text-white' : 'text-[#1F2421]';
  const subColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const rightFoldFill = isDark ? '#FFFFFF' : '#1F2421';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Folded Origami V Logo from V English House Hub */}
      <svg viewBox="0 0 40 32" className="w-8 h-7 sm:w-9 sm:h-8 flex-shrink-0" fill="none">
        {/* Left gold fold */}
        <path d="M3 4 L15 27 L20 17 L11 4 Z" fill="#FFC600" />
        {/* Right dark fold */}
        <path d="M20 17 L25 27 L37 4 L29 4 L21 17 Z" fill={rightFoldFill} />
        {/* Bottom facet */}
        <path d="M15 27 L20 17 L25 27 L20 31 Z" fill="#E5B200" />
      </svg>

      {/* Brand Wordmark matching VEH Teaching Hub */}
      <div className="leading-tight flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <strong className={`font-black text-sm sm:text-base tracking-tight ${textColor} font-brand`}>
            V ENGLISH HOUSE
          </strong>
        </div>
        <small className={`text-[8.5px] sm:text-[9px] ${subColor} font-bold uppercase tracking-wider`}>
          V EDUCATION & TRAINING COMPANY
        </small>
      </div>
    </div>
  );
}
