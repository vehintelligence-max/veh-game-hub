import React from 'react';

/**
 * Official Golden Cat Mascot of V English House
 * Reference: media_1791701618526_fc15c6aa.png (Golden Cat with waving giant yellow foam glove)
 * Supports expressions: 'wave' | 'cheer' | 'headphones' | 'thinking' | 'trophy'
 */
export default function CatMascot({
  expression = 'wave',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showSpeechBubble = false,
  speechText = '',
}) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="mb-2 px-3 py-1.5 bg-white text-vhouse-dark font-black text-xs rounded-2xl shadow-xl border-2 border-vhouse-gold relative animate-bounce max-w-[220px] text-center">
          <span>{speechText}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* SVG Mascot Canvas */}
      <svg
        viewBox="0 0 200 200"
        className={`${currentSize} filter drop-shadow-md transition-transform hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Golden Cat Body Gradient */}
          <linearGradient id="catGoldGrad" x1="50" y1="30" x2="150" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDB813" />
            <stop offset="0.6" stopColor="#F5A623" />
            <stop offset="1" stopColor="#E28B00" />
          </linearGradient>

          {/* Yellow Foam Glove Gradient */}
          <linearGradient id="gloveGrad" x1="130" y1="20" x2="190" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE066" />
            <stop offset="0.7" stopColor="#F5C026" />
            <stop offset="1" stopColor="#D99B00" />
          </linearGradient>

          {/* Inner Ear Pink */}
          <linearGradient id="earPink" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FFB3B3" />
            <stop offset="1" stopColor="#F48FB1" />
          </linearGradient>
        </defs>

        {/* Halo Glow behind head (like in House Power-Up banner) */}
        <circle cx="100" cy="100" r="82" fill="#FEEAA7" fillOpacity="0.45" />
        <circle cx="100" cy="100" r="68" fill="#FEEAA7" fillOpacity="0.65" />

        {/* Cat Tail Curling */}
        <path
          d="M 125 150 C 155 160, 185 145, 182 120 C 180 100, 160 105, 155 118"
          stroke="url(#catGoldGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cat Ears */}
        {/* Left Ear */}
        <polygon points="52,38 32,82 82,72" fill="url(#catGoldGrad)" />
        <polygon points="50,48 38,78 74,72" fill="url(#earPink)" />

        {/* Right Ear */}
        <polygon points="148,38 118,72 168,82" fill="url(#catGoldGrad)" />
        <polygon points="150,48 126,72 162,78" fill="url(#earPink)" />

        {/* Cat Head */}
        <ellipse cx="100" cy="98" rx="58" ry="50" fill="url(#catGoldGrad)" />

        {/* Cat Forehead Stripes */}
        <path d="M 94 56 L 94 68" stroke="#D98200" strokeWidth="3" strokeLinecap="round" />
        <path d="M 100 52 L 100 68" stroke="#D98200" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 106 56 L 106 68" stroke="#D98200" strokeWidth="3" strokeLinecap="round" />

        {/* Cat Body */}
        <path
          d="M 68 135 C 68 125, 78 118, 100 118 C 122 118, 132 125, 132 135 L 140 175 C 140 182, 135 186, 125 186 L 75 186 C 65 186, 60 182, 60 175 Z"
          fill="url(#catGoldGrad)"
        />

        {/* White Chest & Snout */}
        <ellipse cx="100" cy="148" rx="22" ry="24" fill="#FFF9E6" />
        <ellipse cx="100" cy="110" rx="28" ry="20" fill="#FFFFFF" />

        {/* Cat Eyes */}
        {expression === 'thinking' ? (
          <>
            {/* Thinking Wink / Curious eyes */}
            <path d="M 72 96 Q 80 90 88 96" stroke="#2B1E12" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="120" cy="95" r="7" fill="#2B1E12" />
            <circle cx="122" cy="93" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Big Expressive Friendly Cat Eyes */}
            {/* Left Eye */}
            <circle cx="80" cy="95" r="8" fill="#2B1E12" />
            <circle cx="82.5" cy="92.5" r="3" fill="#FFFFFF" />
            <circle cx="78" cy="97" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="120" cy="95" r="8" fill="#2B1E12" />
            <circle cx="122.5" cy="92.5" r="3" fill="#FFFFFF" />
            <circle cx="118" cy="97" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Cheeks blush */}
        <ellipse cx="68" cy="106" rx="6" ry="4" fill="#FFAAA6" fillOpacity="0.7" />
        <ellipse cx="132" cy="106" rx="6" ry="4" fill="#FFAAA6" fillOpacity="0.7" />

        {/* Nose & Mouth (Classic cat :3 mouth) */}
        <polygon points="100,103 96,99 104,99" fill="#D96B6B" />
        <path
          d="M 94 107 C 97 111, 100 110, 100 104 C 100 110, 103 111, 106 107"
          stroke="#2B1E12"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cat Whiskers */}
        {/* Left Whiskers */}
        <path d="M 45 98 L 65 101" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />
        <path d="M 44 107 L 64 107" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />
        <path d="M 46 116 L 66 113" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />

        {/* Right Whiskers */}
        <path d="M 155 98 L 135 101" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />
        <path d="M 156 107 L 136 107" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />
        <path d="M 154 116 L 134 113" stroke="#8C5311" strokeWidth="2" strokeLinecap="round" />

        {/* Cat Paws Front Sitting */}
        <ellipse cx="80" cy="178" rx="14" ry="10" fill="url(#catGoldGrad)" />
        <ellipse cx="120" cy="178" rx="14" ry="10" fill="url(#catGoldGrad)" />
        <path d="M 76 178 L 76 186 M 84 178 L 84 186" stroke="#D98200" strokeWidth="2" strokeLinecap="round" />
        <path d="M 116 178 L 116 186 M 124 178 L 124 186" stroke="#D98200" strokeWidth="2" strokeLinecap="round" />

        {/* --- ACCESSORIES ACCORDING TO EXPRESSION --- */}

        {/* Headphones for Dictation Mode */}
        {expression === 'headphones' && (
          <g>
            {/* Headphone Band */}
            <path
              d="M 50 85 C 50 35, 150 35, 150 85"
              stroke="#1C2024"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 50 85 C 50 35, 150 35, 150 85"
              stroke="#FDB813"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Ear Cup */}
            <rect x="40" y="75" width="16" height="30" rx="8" fill="#1C2024" stroke="#FDB813" strokeWidth="2" />
            {/* Right Ear Cup */}
            <rect x="144" y="75" width="16" height="30" rx="8" fill="#1C2024" stroke="#FDB813" strokeWidth="2" />
          </g>
        )}

        {/* Golden Trophy for Winner Podium */}
        {expression === 'trophy' && (
          <g transform="translate(68, 115) scale(0.65)">
            <path d="M 20 20 L 80 20 L 70 70 C 65 90, 35 90, 30 70 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="3" />
            <path d="M 50 82 L 50 105 M 30 105 L 70 105" stroke="#B8860B" strokeWidth="6" strokeLinecap="round" />
            <path d="M 20 30 C 5 30, 5 60, 25 60" stroke="#FFD700" strokeWidth="4" fill="none" />
            <path d="M 80 30 C 95 30, 95 60, 75 60" stroke="#FFD700" strokeWidth="4" fill="none" />
            <text x="50" y="55" fontSize="22" fontWeight="bold" fill="#784A00" textAnchor="middle">1</text>
          </g>
        )}

        {/* THE OFFICIAL GIANT GOLDEN FOAM GLOVE (Wave / Cheer / Default) */}
        {(expression === 'wave' || expression === 'cheer' || expression === 'default') && (
          <g className="origin-[150px_110px] animate-[wiggle_2.5s_ease-in-out_infinite]">
            {/* Glove Cuff Wrist */}
            <rect
              x="142"
              y="94"
              width="26"
              height="10"
              rx="4"
              fill="#FFFFFF"
              stroke="#8C5311"
              strokeWidth="2"
            />

            {/* Giant 3-Finger Foam Hand Body */}
            <path
              d="M 144 94 L 140 55 C 140 45, 155 45, 155 55 L 155 35 C 155 25, 170 25, 170 35 L 170 42 C 170 32, 185 32, 185 45 L 182 94 Z"
              fill="url(#gloveGrad)"
              stroke="#7A4500"
              strokeWidth="2.5"
            />

            {/* Foam Finger Stitches / Creases */}
            <path d="M 155 48 L 155 80" stroke="#C47A00" strokeWidth="2" strokeLinecap="round" />
            <path d="M 170 48 L 170 80" stroke="#C47A00" strokeWidth="2" strokeLinecap="round" />

            {/* "V" Engraving or "#1" on Glove */}
            <text
              x="163"
              y="85"
              fill="#7A4500"
              fontSize="12"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              textAnchor="middle"
            >
              V#1
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
