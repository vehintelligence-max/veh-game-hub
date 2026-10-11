import React, { useState, useEffect, useRef } from 'react';
import {
  Settings, Music, Bell, Play, Pause, RotateCcw, Volume2, VolumeX,
  Maximize2, Minimize2, Trophy, Sparkles, Flag, Plus, Minus, Trash2,
  Check, X, Users, RefreshCw, FileText, ArrowRight, Zap, Edit3,
  Bookmark, Save, Flame, Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

// ============================================================================
// 16 VIBRANT FUR PALETTES & ACCESSORIES FOR UNLIMITED CAT RUNNERS
// ============================================================================
const CAT_PALETTES = [
  { fur: '#F59E0B', stripe: '#D97706', accent: '#FEF3C7', acc: 'bandana', name: 'Mèo Khăn Đỏ' },
  { fur: '#FBBF24', stripe: '#F59E0B', accent: '#FFFBEB', acc: 'classic', name: 'Mèo Vàng Vui Vẻ' },
  { fur: '#4ADE80', stripe: '#16A34A', accent: '#DCFCE7', acc: 'antennae', name: 'Mèo Râu Bướm Xanh' },
  { fur: '#FCD34D', stripe: '#F59E0B', accent: '#FEF9C3', acc: 'sunglasses', name: 'Mèo Ngầu Kính Râm' },
  { fur: '#38BDF8', stripe: '#0284C7', accent: '#E0F2FE', acc: 'headband', name: 'Mèo Thể Thao Xanh' },
  { fur: '#F472B6', stripe: '#DB2777', accent: '#FDF2F8', acc: 'bow', name: 'Mèo Nơ Hồng' },
  { fur: '#EAB308', stripe: '#CA8A04', accent: '#FEF08A', acc: 'crown', name: 'Mèo Vương Giả' },
  { fur: '#EF4444', stripe: '#B91C1C', accent: '#FEE2E2', acc: 'headband', name: 'Mèo Võ Sĩ Đỏ' },
  { fur: '#A855F7', stripe: '#7E22CE', accent: '#F3E8FF', acc: 'sunglasses', name: 'Mèo Tím Tia Chớp' },
  { fur: '#14B8A6', stripe: '#0F766E', accent: '#CCFBF1', acc: 'bandana', name: 'Mèo Xanh Ngọc' },
  { fur: '#FB923C', stripe: '#C2410C', accent: '#FFEDD5', acc: 'classic', name: 'Mèo Hổ Cam' },
  { fur: '#64748B', stripe: '#334155', accent: '#F1F5F9', acc: 'headband', name: 'Mèo Mướp Xám' },
  { fur: '#84CC16', stripe: '#4D7C0F', accent: '#ECFCCB', acc: 'antennae', name: 'Mèo Cốm Non' },
  { fur: '#EC4899', stripe: '#BE185D', accent: '#FCE7F3', acc: 'bow', name: 'Mèo Hồng Dâu' },
  { fur: '#06B6D4', stripe: '#0E7490', accent: '#CFFAFE', acc: 'sunglasses', name: 'Mèo Băng Giá' },
  { fur: '#6366F1', stripe: '#4338CA', accent: '#E0E7FF', acc: 'crown', name: 'Mèo Hoàng Tộc' },
];

export function buildRacer(number, customName = '') {
  const p = CAT_PALETTES[(number - 1) % CAT_PALETTES.length];
  const cleanedName = String(customName || '').trim();
  return {
    id: `cat_${number}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    number: number,
    name: cleanedName || `Mèo Số ${number}`,
    label: cleanedName || `${p.name} #${number}`,
    furColor: p.fur,
    accentColor: p.accent,
    stripeColor: p.stripe,
    accessory: p.acc,
    accessoryColor: p.stripe,
    badgeColor: '#FFFFFF',
    emoji: '🐱'
  };
}

// Initial 4 racers matching screenshot
const DEFAULT_RACERS = [
  buildRacer(1, 'Mèo Số 1'),
  buildRacer(2, 'Mèo Số 2'),
  buildRacer(3, 'Mèo Số 3'),
  buildRacer(4, 'Mèo Số 4'),
];

// Presets matching Duck Race and screenshot
const PRESET_TIMES = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '39s (Ảnh mẫu)', seconds: 39 },
  { label: '41s', seconds: 41 },
  { label: '1 Phút', seconds: 60 },
  { label: '2 Phút', seconds: 120 },
  { label: '3 Phút', seconds: 180 },
  { label: '5 Phút', seconds: 300 },
];

// Authentic V English House Class Rosters linked directly to classes
const VHOUSE_CLASSES = [
  {
    id: 'a01',
    name: 'Lớp A01 (Primary / Kids)',
    category: 'Tiểu học',
    badge: '🎒 Kids',
    students: [
      'Tuấn Minh', 'Gia Bảo', 'Quỳnh Chi', 'Hoàng An', 'Tiến Dũng',
      'Bảo Ngọc', 'Phương Linh', 'Minh Khang', 'Bảo An', 'Gia Huy',
      'Minh Khôi', 'Khánh Linh'
    ]
  },
  {
    id: 'b02',
    name: 'Lớp B02 (Junior / Teens)',
    category: 'Trung học',
    badge: '🏫 Teens',
    students: [
      'Quốc Bảo', 'Tuệ Minh', 'Phương Vy', 'Trọng Nhân', 'Gia Thịnh',
      'Tô Châu', 'Nguyên Danh', 'Ánh Nhã', 'Hoàng Long', 'Phương Thảo',
      'Thùy Chi', 'Minh Trí', 'Thanh Hằng', 'Tuấn Tú', 'Kim Ngân', 'Đăng Khoa'
    ]
  },
  {
    id: 'ielts',
    name: 'Lớp IELTS Target 6.5+',
    category: 'Luyện thi chứng chỉ',
    badge: '🎯 IELTS',
    students: [
      'Hoàng Phúc', 'Thu Trang', 'Anh Tuấn', 'Tường Vy', 'Khánh Linh',
      'Đức Hải', 'Thảo Nhi', 'Hải Yến', 'Trần Nam', 'Quang Vinh'
    ]
  },
  {
    id: 'leader',
    name: 'Nhà LEADER (V House Power-Up)',
    category: 'Nhà thi đua',
    badge: '👑 LEADER',
    students: [
      'Lê Kiều Quốc Bảo', 'Trần Vũ Tuệ Minh', 'Nguyễn Hoàng Phương Vy',
      'Lê Trọng Nhân', 'Nguyễn Gia Thịnh'
    ]
  },
  {
    id: 'dweller',
    name: 'Nhà DWELLER (V House Power-Up)',
    category: 'Nhà thi đua',
    badge: '🏰 DWELLER',
    students: [
      'Đỗ Nguyên Danh', 'Trương Bảo Ngọc', 'Bùi Như Ngọc Vy',
      'Nguyễn Minh Hồng Thương', 'Nguyễn Thụy Ánh Nhã'
    ]
  },
  {
    id: 'b1',
    name: 'Nhà B1 (V House Power-Up)',
    category: 'Nhà thi đua',
    badge: '⚡ B1',
    students: [
      'Mai Hoàng Nam', 'Nguyễn Hoài Nam', 'Lê Thiện Nhân',
      'Võ Đức Huy', 'Phạm Quỳnh Anh'
    ]
  }
];

// 24 Funny Troll Cat Names for slapstick comedy races
const FUNNY_CAT_NAMES = [
  'Mèo Béo Ú', 'Mèo Ngáo Ngơ', 'Mèo Lười Chảy Thây', 'Mèo Cục Súc',
  'Mèo Đại Gia', 'Mèo Siêu Quậy', 'Mèo Hổ Báo', 'Mèo Mê Ngủ',
  'Mèo Đểu Cáng', 'Mèo Giận Dữ', 'Mèo Lươn Lẹo', 'Mèo Đam Mê Ăn',
  'Mèo Bay Lắc', 'Mèo Trùm Trường', 'Mèo Hóng Hớt', 'Mèo Quậy Phá',
  'Mèo Xoạc Chân', 'Mèo Cà Khịa', 'Mèo Chiến Thần', 'Mèo Bất Tử',
  'Mèo Bánh Bao', 'Mèo Báo Thủ', 'Mèo Vô Địch', 'Mèo Tốc Độ'
];

// ============================================================================
// SVG ATHLETIC RUNNING CAT (Galloping on the Track with Slapstick Stunts)
// ============================================================================
function RunningCat({ racer, isRunning, isWinner, isLeader, effect }) {
  const handleCatClick = () => {
    const variants = ['excited', 'kitten', 'default', 'deep'];
    sound.playMeow(variants[(racer.number - 1) % 4]);
  };

  const isTumbled = effect?.type === 'tumbled';
  const isKicking = effect?.type === 'kicking';
  const isStumbled = effect?.type === 'stumbled';
  const isTurbo = effect?.type === 'turbo';
  const isDistracted = effect?.type === 'distracted';

  return (
    <div
      onClick={handleCatClick}
      className="relative flex items-center justify-center select-none cursor-pointer group active:scale-95 transition-transform"
      title={`Nhấn vào ${racer.name} để nghe tiếng mèo kêu!`}
    >
      {/* 1. Dust Puffs kicking up behind rear paws when sprinting on track */}
      {isRunning && !isTumbled && (
        <div className="absolute -left-7 bottom-2.5 flex gap-1 pointer-events-none select-none z-10">
          <span className="text-sm inline-block animate-[dustPuff_0.32s_ease-out_infinite]">💨</span>
          <span className="text-xs inline-block animate-[dustPuff_0.4s_ease-out_infinite_0.08s]">💨</span>
          <span className="text-sm inline-block animate-[dustPuff_0.36s_ease-out_infinite_0.16s]">💨</span>
        </div>
      )}

      {/* Turbo Rocket Flames */}
      {isTurbo && (
        <div className="absolute -left-12 bottom-1 flex gap-0.5 pointer-events-none z-20 text-lg animate-pulse">
          <span>🔥</span>
          <span>🚀</span>
          <span>🔥</span>
        </div>
      )}

      {/* Banana Peel when tumbled */}
      {isTumbled && (
        <div className="absolute -bottom-3 left-4 text-2xl pointer-events-none z-30 animate-bounce">
          🍌
        </div>
      )}

      {/* Spinning Dizzy Stars when tumbled or stumbled */}
      {(isTumbled || isStumbled) && (
        <div className="absolute -top-7 z-40 text-sm font-black animate-[spinDizzyStars_0.9s_linear_infinite] pointer-events-none drop-shadow">
          💫 ⭐ 💫
        </div>
      )}

      {/* Butterfly when distracted */}
      {isDistracted && (
        <div className="absolute -top-6 right-2 text-xl z-40 animate-bounce pointer-events-none">
          🦋
        </div>
      )}

      {/* SLAPSTICK COMIC ACTION POP BUBBLE */}
      {effect && (
        <div
          className={`absolute -top-9 z-40 font-black text-[11px] px-3 py-1 rounded-full shadow-2xl border-2 whitespace-nowrap animate-[comicPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)] ${
            isKicking
              ? 'bg-rose-600 text-white border-yellow-300 animate-[catSideKick_0.5s_infinite]'
              : isTumbled
              ? 'bg-yellow-400 text-stone-900 border-black'
              : isStumbled
              ? 'bg-orange-600 text-white border-white animate-pulse'
              : isTurbo
              ? 'bg-cyan-500 text-stone-900 border-white'
              : 'bg-purple-600 text-white border-white'
          }`}
        >
          {effect.label || effect.type}
        </div>
      )}

      {/* Kung-fu Kicking Paw extending towards victim's lane */}
      {isKicking && (
        <div
          className={`absolute z-35 font-black text-2xl sm:text-3xl pointer-events-none animate-bounce ${
            effect?.direction === 'down' ? 'top-10 -right-2 rotate-45' : '-top-8 -right-2 -rotate-45'
          }`}
        >
          🦶💥
        </div>
      )}

      {/* Impact burst on stumbled victim */}
      {isStumbled && (
        <div className="absolute -top-3 -right-3 z-35 font-black text-xl sm:text-2xl pointer-events-none animate-ping">
          💥😵
        </div>
      )}

      {/* 2. Leading Star / Crown if leading the pack */}
      {isLeader && isRunning && !effect && (
        <div className="absolute -top-4 right-6 z-30 animate-bounce text-xs font-black drop-shadow">
          ⭐
        </div>
      )}

      {/* 3. The Running Cat Actor SVG with Dynamic Slapstick Body Style */}
      <svg
        viewBox="0 0 120 86"
        className={`w-24 h-16 sm:w-28 sm:h-20 drop-shadow-md transition-transform ${
          isWinner ? 'scale-115 drop-shadow-2xl' : ''
        }`}
        style={{
          transform: isTumbled
            ? 'rotate(720deg) scale(0.88)'
            : isKicking
            ? 'rotate(-14deg) scale(1.15) translateX(8px)'
            : isStumbled
            ? 'rotate(14deg) translateX(-10px)'
            : 'none',
          transition: isTumbled
            ? 'transform 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : isKicking || isStumbled
            ? 'transform 0.25s ease-out'
            : 'transform 0.2s ease-out'
        }}
      >
        <defs>
          <linearGradient id={`furGrad_${racer.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={racer.furColor} />
            <stop offset="100%" stopColor={racer.stripeColor || racer.furColor} />
          </linearGradient>
        </defs>

        {/* Athletic Track Ground Shadow underneath running cat */}
        <ellipse cx="58" cy="78" rx="36" ry="5.5" fill="rgba(0,0,0,0.3)" />

        {/* Dynamic Galloping & Running Body Group */}
        <g
          style={{
            transformOrigin: '56px 48px',
            animation: isRunning ? 'catGallop 0.28s ease-in-out infinite' : 'none'
          }}
        >
          {/* A. Tail Streaming High in the Wind as it runs */}
          <g
            style={{
              transformOrigin: '24px 42px',
              animation: isRunning ? 'catTailSwim 0.24s ease-in-out infinite' : 'catTail 1.5s ease-in-out infinite'
            }}
          >
            <path
              d="M 24 42 Q 6 18, 12 6 Q 20 18, 27 38 Z"
              fill={`url(#furGrad_${racer.id})`}
              stroke="#1F2421"
              strokeWidth="2.5"
            />
          </g>

          {/* B. BACK LEFT LEG & PAW (Kicking back off the ground) */}
          <g
            style={{
              transformOrigin: '32px 48px',
              animation: isRunning ? 'catPawKickBack2 0.28s ease-in-out infinite' : 'none'
            }}
          >
            <path d="M 32 46 Q 22 56 24 66" stroke={racer.furColor} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="23" cy="68" rx="7.5" ry="5" fill={racer.furColor} stroke="#1F2421" strokeWidth="2" />
            <circle cx="26" cy="69" r="1.3" fill="#FCA5A5" />
            <circle cx="22" cy="70" r="1.3" fill="#FCA5A5" />
          </g>

          {/* C. Athletic Cat Body */}
          <ellipse cx="56" cy="46" rx="34" ry="21" fill={`url(#furGrad_${racer.id})`} stroke="#1F2421" strokeWidth="2.8" />

          {/* D. Belly Accent */}
          <ellipse cx="58" cy="51" rx="22" ry="12" fill={racer.accentColor} />

          {/* E. Tabby Stripes */}
          <path d="M 44 30 Q 47 38, 44 44" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 54 28 Q 57 38, 54 46" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 64 30 Q 67 38, 64 44" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* F. BACK RIGHT LEG & PAW (Kicking back off track, upper layer) */}
          <g
            style={{
              transformOrigin: '42px 50px',
              animation: isRunning ? 'catPawKickBack1 0.28s ease-in-out infinite' : 'none'
            }}
          >
            <path d="M 42 48 Q 32 58 34 68" stroke={racer.furColor} strokeWidth="6.5" strokeLinecap="round" />
            <ellipse cx="33" cy="70" rx="8" ry="5.5" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.2" />
            <circle cx="36" cy="71" r="1.5" fill="#FCA5A5" />
            <circle cx="32" cy="72" r="1.5" fill="#FCA5A5" />
            <circle cx="28" cy="71" r="1.5" fill="#FCA5A5" />
          </g>

          {/* G. Cat Head Leaning Forward into the Wind */}
          <circle cx="83" cy="33" r="21" fill={`url(#furGrad_${racer.id})`} stroke="#1F2421" strokeWidth="2.8" />

          {/* H. Cat Ears Back in Racing Mode */}
          <polygon points="70,20 76,5 84,17" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="73,18 77,8 82,16" fill="#FCA5A5" />
          <polygon points="85,17 93,5 99,20" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="87,16 92,8 96,18" fill="#FCA5A5" />

          {/* I. Accessories */}
          {racer.accessory === 'bandana' && (
            <g>
              <path d="M 69,25 Q 83,22 97,26" stroke="#EF4444" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <circle cx="74" cy="24" r="1.3" fill="#FFFFFF" />
              <circle cx="83" cy="23" r="1.3" fill="#FFFFFF" />
              <circle cx="92" cy="25" r="1.3" fill="#FFFFFF" />
              <path d="M 67 25 Q 58 18 52 24 Q 60 27 67 25" fill="#EF4444" stroke="#1F2421" strokeWidth="1.5" />
              <path d="M 66 27 Q 56 31 50 37 Q 58 33 66 27" fill="#EF4444" stroke="#1F2421" strokeWidth="1.5" />
            </g>
          )}

          {racer.accessory === 'antennae' && (
            <g>
              <path d="M 78 14 Q 74 4 68 3" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="68" cy="3" r="3.5" fill="#22C55E" stroke="#1F2421" strokeWidth="1.8" />
              <path d="M 88 14 Q 92 4 98 3" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="98" cy="3" r="3.5" fill="#22C55E" stroke="#1F2421" strokeWidth="1.8" />
            </g>
          )}

          {racer.accessory === 'sunglasses' && (
            <g>
              <path d="M 76 29 Q 84 27 93 30" stroke="#111827" strokeWidth="2.5" fill="none" />
              <rect x="77" y="27" width="10" height="9" rx="3" fill="#111827" stroke="#374151" strokeWidth="1" />
              <rect x="89" y="28" width="10" height="9" rx="3" fill="#111827" stroke="#374151" strokeWidth="1" />
              <line x1="79" y1="29" x2="84" y2="34" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="91" y1="30" x2="96" y2="35" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {racer.accessory === 'bow' && (
            <g>
              <polygon points="77,13 85,19 77,25" fill="#EC4899" stroke="#1F2421" strokeWidth="1.5" />
              <polygon points="93,13 85,19 93,25" fill="#EC4899" stroke="#1F2421" strokeWidth="1.5" />
              <circle cx="85" cy="19" r="3" fill="#F43F5E" />
            </g>
          )}

          {racer.accessory === 'crown' && (
            <polygon points="79,13 82,5 86,11 90,5 93,13" fill="#FFC600" stroke="#1F2421" strokeWidth="1.8" strokeLinejoin="round" />
          )}

          {racer.accessory === 'headband' && (
            <g>
              <path d="M 69,26 Q 83,23 97,27" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M 67 26 Q 54 28 48 34" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* J. Focused Racing Eyes */}
          {racer.accessory !== 'sunglasses' && (
            <g>
              <ellipse cx="89" cy="30" rx="4" ry="5.5" fill="#1F2421" />
              <circle cx="90.5" cy="28" r="1.8" fill="#FFFFFF" />
              <circle cx="88" cy="33" r="0.9" fill="#FFFFFF" />
              <polygon points="96,35 98,37.5 100,35" fill="#F43F5E" />
              <path d="M 94 38 Q 96 41 98 38.5 Q 100 41 102 38" stroke="#1F2421" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <line x1="95" y1="37" x2="107" y2="35" stroke="#1F2421" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="95" y1="40" x2="107" y2="41" stroke="#1F2421" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}

          {/* K. FRONT LEFT LEG & PAW (Striding forward) */}
          <g
            style={{
              transformOrigin: '76px 48px',
              animation: isRunning ? 'catPawPaddleFront2 0.28s ease-in-out infinite' : 'none'
            }}
          >
            <path d="M 76 46 Q 80 56 86 64" stroke={racer.furColor} strokeWidth="5.5" strokeLinecap="round" />
            <ellipse cx="87" cy="65" rx="7.5" ry="5" fill={racer.furColor} stroke="#1F2421" strokeWidth="2" opacity="0.9" />
            <circle cx="90" cy="66" r="1.3" fill="#FCA5A5" />
            <circle cx="86" cy="67" r="1.3" fill="#FCA5A5" />
          </g>

          {/* L. FRONT RIGHT LEG & PAW (Striding forward, touching track) */}
          <g
            style={{
              transformOrigin: '88px 50px',
              animation: isRunning ? 'catPawPaddleFront1 0.28s ease-in-out infinite' : 'none'
            }}
          >
            <path d="M 86 48 Q 92 58 98 66" stroke={racer.furColor} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="99" cy="68" rx="8" ry="5.5" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.2" />
            <circle cx="103" cy="69" r="1.5" fill="#FCA5A5" />
            <circle cx="99" cy="70" r="1.5" fill="#FCA5A5" />
            <circle cx="95" cy="69" r="1.5" fill="#FCA5A5" />
          </g>

          {/* M. ICONIC NUMBER RACING BIB ON CAT'S BACK */}
          <g>
            <rect
              x="38"
              y="33"
              width="26"
              height="24"
              rx="7"
              fill="#FFFFFF"
              stroke="#1F2421"
              strokeWidth="3.2"
            />
            <text
              x="51"
              y="50"
              textAnchor="middle"
              fontSize="18"
              fontWeight="900"
              fill="#1F2421"
              fontFamily="Arial Black, Impact, Montserrat, sans-serif"
            >
              {racer.number}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: CAT RACE TRACK STOPWATCH (UNLIMITED RACERS ON ATHLETIC TRACK)
// ============================================================================
export default function CatRaceTimer() {
  const [totalSeconds, setTotalSeconds] = useState(39);
  const [remainingSeconds, setRemainingSeconds] = useState(39);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Unlimited Racers State
  const [racers, setRacers] = useState(DEFAULT_RACERS);

  // Race Physics & Positioning
  const [positions, setPositions] = useState({});
  const [leaderId, setLeaderId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [rankings, setRankings] = useState([]);

  // Crossing Order & Winner Tracking (First cat to cross the finish line ribbon wins!)
  const [firstCrossedId, setFirstCrossedId] = useState(null);
  const [crossedIds, setCrossedIds] = useState([]);
  const crossingOrderRef = useRef([]);
  const crossedTimesRef = useRef({});
  const finishTriggeredRef = useRef(false);

  // ==========================================================================
  // SLAPSTICK CHAOS & TROLL RACING MODE (Kicks, slips, turbos, distractions)
  // ==========================================================================
  const [trollModeEnabled, setTrollModeEnabled] = useState(true);
  const [catEffects, setCatEffects] = useState({});
  const catEffectsRef = useRef({});
  const [activeKickClash, setActiveKickClash] = useState(null);
  const activeKickClashRef = useRef(null);
  const lastSlapstickEventTimeRef = useRef(0);
  const [commentary, setCommentary] = useState({
    text: 'Chào mừng bạn đến với Giải Đua Mèo V English House! Chúc các chú mèo thi đấu fair-play (hoặc không...)!',
    type: 'normal',
    icon: '📢',
    time: Date.now()
  });

  // 1-Click Change Cat Color Palette
  const handleChangeCatColor = (racerId, paletteIndex) => {
    const palette = CAT_PALETTES[paletteIndex % CAT_PALETTES.length];
    sound.playClick();
    const updated = racers.map((r) => {
      if (r.id === racerId) {
        return {
          ...r,
          furColor: palette.fur,
          stripeColor: palette.stripe,
          accentColor: palette.accent,
          accessory: palette.acc,
          accessoryColor: palette.stripe,
          label: r.name || `${palette.name} #${r.number}`
        };
      }
      return r;
    });
    setRacers(updated);
  };

  // ==========================================================================
  // CUSTOM NAMING & LINKED CLASS ROSTERS
  // ==========================================================================
  const [editingRacer, setEditingRacer] = useState(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [settingsTab, setSettingsTab] = useState('general'); // 'general' | 'names' | 'classes' | 'troll'
  const [customClasses, setCustomClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassRoster, setNewClassRoster] = useState('');

  // Audio & Display Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmBellEnabled, setAlarmBellEnabled] = useState(true);
  const [voiceAnnounceEnabled, setVoiceAnnounceEnabled] = useState(true);
  const [liveCasterVoiceEnabled, setLiveCasterVoiceEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Custom Time Inputs
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('39');

  // Custom Roster Input
  const [rosterInput, setRosterInput] = useState('');

  const containerRef = useRef(null);
  const raceStartTimeRef = useRef(null);
  const elapsedOffsetRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastSecondTickedRef = useRef(null);
  const racerPersonalitiesRef = useRef({});
  const prevLeaderIdRef = useRef(null);
  const lastLeadChangeCommentTimeRef = useRef(0);
  const lastSpokenCommentaryTimeRef = useRef(0);
  const finalSprintAnnouncedRef = useRef(false);
  const raceStartAnnouncedRef = useRef(false);

  // Live Sports Caster TTS Voice Helper (High-energy, throttled to prevent overlapping)
  const speakCaster = (text, minInterval = 3400) => {
    if (!liveCasterVoiceEnabled || !soundEnabled) return;
    const now = Date.now();
    if (now - lastSpokenCommentaryTimeRef.current < minInterval) return;
    lastSpokenCommentaryTimeRef.current = now;
    speech.speakVietnamese(text, 1.05);
  };

  // Format seconds to digital stopwatch display: HH:MM:SS
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Reset Race & Positions
  const handleResetRace = (newTotal = totalSeconds, currentRacers = racers) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    sound.stopRaceMusic();
    speech.stop();
    setIsRunning(false);
    setIsFinished(false);
    setWinner(null);
    setRankings([]);
    setFirstCrossedId(null);
    setCrossedIds([]);
    crossingOrderRef.current = [];
    crossedTimesRef.current = {};
    finishTriggeredRef.current = false;
    catEffectsRef.current = {};
    setCatEffects({});
    lastSlapstickEventTimeRef.current = 0;
    activeKickClashRef.current = null;
    setActiveKickClash(null);
    prevLeaderIdRef.current = null;
    lastLeadChangeCommentTimeRef.current = 0;
    lastSpokenCommentaryTimeRef.current = 0;
    finalSprintAnnouncedRef.current = false;
    raceStartAnnouncedRef.current = false;
    setCommentary({
      text: 'Đường đua đã sẵn sàng! Nhấn Bắt Đầu để xuất phát!',
      type: 'normal',
      icon: '🏁',
      time: Date.now()
    });
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);
    elapsedOffsetRef.current = 0;
    raceStartTimeRef.current = null;
    lastSecondTickedRef.current = newTotal;

    // Generate distinct racer personalities for fluid overtakes & sprints
    const initPos = {};
    const pers = {};
    currentRacers.forEach((r, idx) => {
      initPos[r.id] = 0;
      pers[r.id] = {
        freq1: 0.85 + ((idx * 0.35) % 1.2),
        freq2: 1.7 + ((idx * 0.5) % 1.3),
        phase1: idx * 1.5 + Math.random(),
        phase2: idx * 2.1 + 0.8,
        amplitude: 4.8 + (idx % 4) * 1.3,
        sprintPower: 5 + Math.random() * 5.5,
      };
    });
    racerPersonalitiesRef.current = pers;
    setPositions(initPos);
    setLeaderId(null);
  };

  // Toggle Start / Pause
  const handleTogglePlay = () => {
    if (isFinished) {
      handleResetRace();
      return;
    }

    if (isRunning) {
      // PAUSE
      sound.playClick();
      sound.stopRaceMusic();
      speech.stop();
      setIsRunning(false);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (raceStartTimeRef.current) {
        const now = performance.now();
        elapsedOffsetRef.current = Math.min(totalSeconds, (now - raceStartTimeRef.current) / 1000);
      }
    } else {
      // START / RESUME
      if (soundEnabled) {
        sound.playWhistle();
        setTimeout(() => sound.playMeow('excited'), 280);
        sound.startRaceMusic({ urgent: remainingSeconds <= 6 });
      }
      raceStartTimeRef.current = performance.now() - (elapsedOffsetRef.current * 1000);
      setIsRunning(true);

      if (!raceStartAnnouncedRef.current) {
        raceStartAnnouncedRef.current = true;
        const startComment = {
          text: '🏁 Xuất phát rồi! Dàn tuyển thủ mèo lao đi như bão táp! Xem ai sẽ giở trò trước đây!',
          audio: 'Xuất phát rồi! Dàn tuyển thủ mèo lao đi như bão táp!'
        };
        setCommentary({
          text: startComment.text,
          type: 'start',
          icon: '🏁',
          time: Date.now()
        });
        if (liveCasterVoiceEnabled && soundEnabled) {
          setTimeout(() => {
            speakCaster(startComment.audio, 2000);
          }, 350);
        }
      }
    }
  };

  // Unmount cleanup
  useEffect(() => {
    return () => {
      sound.stopRaceMusic();
    };
  }, []);

  // Set exact racer count (Unlimited: from 2 up to 50+)
  const handleSetRacerCount = (count) => {
    const target = Math.max(2, parseInt(count, 10) || 4);
    sound.playClick();
    const newRacers = [];
    for (let i = 1; i <= target; i++) {
      if (racers[i - 1]) {
        newRacers.push(racers[i - 1]);
      } else {
        newRacers.push(buildRacer(i));
      }
    }
    setRacers(newRacers);
    handleResetRace(totalSeconds, newRacers);
  };

  // Add 1 racer
  const handleAddRacer = () => {
    sound.playClick();
    const newRacer = buildRacer(racers.length + 1);
    const updated = [...racers, newRacer];
    setRacers(updated);
    handleResetRace(totalSeconds, updated);
  };

  // Remove 1 racer
  const handleRemoveRacer = () => {
    if (racers.length <= 2) return;
    sound.playClick();
    const updated = racers.slice(0, racers.length - 1);
    setRacers(updated);
    handleResetRace(totalSeconds, updated);
  };

  // Import custom student roster
  const handleImportRoster = (namesList) => {
    const names = namesList
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length < 2) {
      alert('Vui lòng nhập danh sách ít nhất 2 tên học sinh!');
      return;
    }

    sound.playCorrect();
    const newRacers = names.map((name, idx) => buildRacer(idx + 1, name));
    setRacers(newRacers);
    handleResetRace(totalSeconds, newRacers);
    setRosterInput('');
    setIsSettingsOpen(false);
  };

  // Load saved custom classes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vhouse_custom_classes');
      if (saved) {
        setCustomClasses(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse saved classes', e);
    }
  }, []);

  // 1-Click Load Any Class Roster (V House or Custom)
  const handleLoadClassRoster = (classObj) => {
    sound.playCorrect();
    const newRacers = classObj.students.map((name, idx) => buildRacer(idx + 1, name));
    setRacers(newRacers);
    handleResetRace(totalSeconds, newRacers);
    setCommentary({
      text: `🏫 Đã nạp ${classObj.name} (${classObj.students.length} học sinh)! Chúc các chú mèo bứt phá!`,
      type: 'info',
      icon: '🏫',
      time: Date.now()
    });
    setIsSettingsOpen(false);
  };

  // Save a new custom class to localStorage
  const handleSaveCustomClass = (e) => {
    e.preventDefault();
    const cName = newClassName.trim();
    const students = newClassRoster
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!cName) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }
    if (students.length < 2) {
      alert('Vui lòng nhập danh sách ít nhất 2 học sinh!');
      return;
    }

    const newClassObj = {
      id: `custom_${Date.now()}`,
      name: cName,
      category: 'Lớp Tự Tạo',
      badge: '📝 Tự tạo',
      students
    };

    const updated = [newClassObj, ...customClasses];
    setCustomClasses(updated);
    try {
      localStorage.setItem('vhouse_custom_classes', JSON.stringify(updated));
    } catch (err) {}

    sound.playCorrect();
    handleLoadClassRoster(newClassObj);
    setNewClassName('');
    setNewClassRoster('');
  };

  // Delete a custom class from localStorage
  const handleDeleteCustomClass = (classId) => {
    const updated = customClasses.filter((c) => c.id !== classId);
    setCustomClasses(updated);
    try {
      localStorage.setItem('vhouse_custom_classes', JSON.stringify(updated));
    } catch (err) {}
  };

  // Rename a specific racer
  const handleRenameRacer = (racerId, newName) => {
    const trimmed = String(newName || '').trim();
    if (!trimmed) return;
    const updated = racers.map((r) => {
      if (r.id === racerId) {
        return { ...r, name: trimmed, label: trimmed };
      }
      return r;
    });
    setRacers(updated);
    if (editingRacer?.id === racerId) {
      setEditingRacer(null);
    }
  };

  // 1-Click Randomize All Names with Funny Personalities
  const handleRandomizeFunnyNames = () => {
    sound.playClick();
    const shuffled = [...FUNNY_CAT_NAMES].sort(() => Math.random() - 0.5);
    const updated = racers.map((r, idx) => {
      const fName = shuffled[idx % shuffled.length];
      return { ...r, name: `${fName} #${r.number}`, label: `${fName} #${r.number}` };
    });
    setRacers(updated);
    setCommentary({
      text: '🎲 Đã đổi tên hài hước cho toàn bộ dàn mèo đua! Xem ai sẽ giở trò đểu nhất!',
      type: 'troll',
      icon: '😼',
      time: Date.now()
    });
  };

  // Reset to default numeric names: Mèo Số 1, 2, 3...
  const handleResetNumericNames = () => {
    sound.playClick();
    const updated = racers.map((r) => {
      return { ...r, name: `Mèo Số ${r.number}`, label: `Mèo Số ${r.number}` };
    });
    setRacers(updated);
  };

  // Open inline rename modal for clicked cat
  const handleOpenRenameModal = (racer) => {
    setEditingRacer(racer);
    setEditNameInput(racer.name);
  };

  // Smooth 60fps Animation & Physics Loop (Silky fluid movement, no jerky jumps)
  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let isSubscribed = true;
    let lastMeowTime = 0;

    const tick = () => {
      if (!isSubscribed) return;

      const now = performance.now();
      const elapsedSec = (now - raceStartTimeRef.current) / 1000;
      elapsedOffsetRef.current = elapsedSec;

      const progress = Math.min(1, Math.max(0, elapsedSec / totalSeconds));
      const remainingSec = Math.max(0, Math.ceil(totalSeconds - elapsedSec));

      // Audio tick once per whole second
      if (remainingSec !== lastSecondTickedRef.current) {
        lastSecondTickedRef.current = remainingSec;
        setRemainingSeconds(remainingSec);
        if (soundEnabled && remainingSec > 0) {
          if (remainingSec <= 6) {
            sound.setRaceMusicUrgent(true);
            sound.playUrgentTick();
          } else {
            sound.playTick();
          }

          // Random playful cat meows during the heat of competition (every 3-5 seconds)
          if (remainingSec > 4 && now - lastMeowTime > 3200 && Math.random() < 0.45) {
            lastMeowTime = now;
            const variants = ['kitten', 'excited', 'default', 'deep'];
            sound.playQuickMew(variants[Math.floor(Math.random() * variants.length)]);
          }
        }
      }

      // Smooth continuous position updates for all racers
      const nextPos = {};
      let maxP = -1;
      let leadId = null;

      racers.forEach((r) => {
        const pers = racerPersonalitiesRef.current[r.id] || {
          freq1: 1, freq2: 2, phase1: 0, phase2: 0, amplitude: 5, sprintPower: 6
        };

        const wave1 = Math.sin(elapsedSec * pers.freq1 + pers.phase1);
        const wave2 = Math.sin(elapsedSec * pers.freq2 + pers.phase2);
        const surge = (wave1 * 0.65 + wave2 * 0.35) * pers.amplitude;

        // Final sprint amplification as countdown nears 0
        let sprint = 0;
        if (progress > 0.78) {
          const sprintRatio = (progress - 0.78) / 0.22;
          sprint = pers.sprintPower * (sprintRatio * sprintRatio * 1.8);
        }

        let p = progress * 100 + surge + sprint;

        // If racer already crossed 100%, let it cruise forward past the ribbon into the victory zone
        if (crossingOrderRef.current.includes(r.id)) {
          p = Math.max(102, p);
        }

        // Bounded between 0% (start) and 122% (victory run-off zone)
        p = Math.max(0, Math.min(122, p));
        nextPos[r.id] = p;

        // PHYSICAL CROSSING CHECK: Did this cat just cross the finish line (p >= 100)?
        if (p >= 100 && !crossingOrderRef.current.includes(r.id)) {
          crossingOrderRef.current.push(r.id);
          crossedTimesRef.current[r.id] = now;
          if (crossingOrderRef.current.length === 1) {
            // First cat across the finish line!
            setFirstCrossedId(r.id);
            sound.playQuickMew('excited');
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { x: 0.8, y: 0.5 },
            });
          }
          setCrossedIds([...crossingOrderRef.current]);
        }

        if (p > maxP) {
          maxP = p;
          leadId = r.id;
        }
      });

      // ======================================================================
      // LEAD CHANGE & OVERTAKE DYNAMIC CASTER COMMENTARY
      // ======================================================================
      if (leadId && leadId !== prevLeaderIdRef.current) {
        const oldLeaderId = prevLeaderIdRef.current;
        prevLeaderIdRef.current = leadId;

        // Trigger overtake commentary if race is actively running
        if (oldLeaderId && progress > 0.12 && progress < 0.88) {
          if (now - lastLeadChangeCommentTimeRef.current > 3200) {
            lastLeadChangeCommentTimeRef.current = now;
            const newLead = racers.find((r) => r.id === leadId);
            const oldLead = racers.find((r) => r.id === oldLeaderId);
            if (newLead && oldLead) {
              const overtakes = [
                {
                  text: `🔥 Ôi bạn ${newLead.name} đã vượt lên dẫn đầu! Nhưng không, bạn ${oldLead.name} không cho phép, đang bám đuổi quyết liệt!`,
                  audio: `Ôi bạn ${newLead.name} đã vượt lên dẫn đầu, nhưng không bạn ${oldLead.name} không cho phép, bạn ${newLead.name} đã nhanh hơn!`
                },
                {
                  text: `⚡ Bất ngờ chưa! Bạn ${newLead.name} không cho phép! Bạn ${newLead.name} đã nhanh hơn bạn ${oldLead.name} một bước!`,
                  audio: `Bất ngờ chưa, bạn ${newLead.name} không cho phép! Bạn ${newLead.name} đã nhanh hơn bạn ${oldLead.name}!`
                },
                {
                  text: `🚀 Cú bứt tốc ngoạn mục! Bạn ${newLead.name} chính thức soán ngôi dẫn đầu của bạn ${oldLead.name}!`,
                  audio: `Cú bứt tốc ngoạn mục, bạn ${newLead.name} chính thức soán ngôi của bạn ${oldLead.name}!`
                },
                {
                  text: `👀 Trận chiến nghẹt thở! Bạn ${newLead.name} vừa vượt mặt bạn ${oldLead.name} trong gang tấc!`,
                  audio: `Trận chiến nghẹt thở, bạn ${newLead.name} vừa vượt mặt bạn ${oldLead.name} trong gang tấc!`
                }
              ];
              const chosen = overtakes[Math.floor(Math.random() * overtakes.length)];
              setCommentary({
                text: chosen.text,
                type: 'overtake',
                icon: '⚡',
                time: now
              });
              if (liveCasterVoiceEnabled && soundEnabled) {
                speakCaster(chosen.audio, 3600);
              }
            }
          }
        }
      }

      // ======================================================================
      // FINAL SPRINT ANNOUNCEMENT (Những mét cuối cùng trước vạch đích)
      // ======================================================================
      if (!finalSprintAnnouncedRef.current && (progress >= 0.86 || (remainingSec !== null && remainingSec <= 5))) {
        finalSprintAnnouncedRef.current = true;
        const currentLead = racers.find((r) => r.id === leadId) || racers[0];
        const sprintText = `🔥 Vạch đích ngay trước mắt! Bạn ${currentLead.name} đang băng băng lao về đích! Ai sẽ cản được đây?!`;
        setCommentary({
          text: sprintText,
          type: 'sprint',
          icon: '🏁',
          time: now
        });
        if (liveCasterVoiceEnabled && soundEnabled) {
          speakCaster(`Vạch đích ngay trước mắt! Bạn ${currentLead.name} đang lao về đích!`, 3400);
        }
      }

      // ======================================================================
      // SLAPSTICK CHAOS & TROLL RACING ENGINE (Kicks, slips, turbos, bướm)
      // ======================================================================
      // 1. Clean up expired comic effects
      let effectsChanged = false;
      const curEffects = { ...catEffectsRef.current };
      Object.keys(curEffects).forEach((id) => {
        if (curEffects[id].expiresAt <= now) {
          delete curEffects[id];
          effectsChanged = true;
        }
      });
      if (effectsChanged) {
        catEffectsRef.current = curEffects;
        setCatEffects(curEffects);
      }
      if (activeKickClashRef.current && activeKickClashRef.current.expiresAt <= now) {
        activeKickClashRef.current = null;
        setActiveKickClash(null);
      }

      // 2. Trigger random slapstick event if Troll Mode is active
      if (trollModeEnabled && progress >= 0.12 && progress <= 0.94) {
        if (now - lastSlapstickEventTimeRef.current > 3200) {
          lastSlapstickEventTimeRef.current = now;
          const roll = Math.random();

          if (roll < 0.44 && racers.length >= 2) {
            // EVENT A: CÚ ĐÁ TÌNH BẠN (SIDE KICK TO ADJACENT LANE)
            const eligiblePairs = [];
            for (let i = 0; i < racers.length - 1; i++) {
              const rA = racers[i];
              const rB = racers[i + 1];
              const pA = nextPos[rA.id] || 0;
              const pB = nextPos[rB.id] || 0;
              if (Math.abs(pA - pB) <= 12 && pA < 96 && pB < 96) {
                eligiblePairs.push({ rA, rB });
              }
            }

            if (eligiblePairs.length > 0) {
              const pair = eligiblePairs[Math.floor(Math.random() * eligiblePairs.length)];
              const pA = nextPos[pair.rA.id] || 0;
              const pB = nextPos[pair.rB.id] || 0;
              const kicker = pA <= pB ? pair.rA : pair.rB;
              const victim = kicker.id === pair.rA.id ? pair.rB : pair.rA;
              const kickerIndex = racers.findIndex((r) => r.id === kicker.id);
              const victimIndex = racers.findIndex((r) => r.id === victim.id);
              const direction = victimIndex > kickerIndex ? 'down' : 'up';

              const updatedEffects = { ...catEffectsRef.current };
              updatedEffects[kicker.id] = {
                type: 'kicking',
                expiresAt: now + 1200,
                label: `😾🦶 ${kicker.name} ĐÁ ${victim.name}!`,
                kickerName: kicker.name,
                victimName: victim.name,
                victimNumber: victim.number,
                direction
              };
              updatedEffects[victim.id] = {
                type: 'stumbled',
                expiresAt: now + 1500,
                label: `😵💥 ${victim.name} BỊ ĐÁ! (-5m)`,
                kickerName: kicker.name,
                victimName: victim.name,
                kickerNumber: kicker.number,
                direction: direction === 'down' ? 'up' : 'down'
              };
              catEffectsRef.current = updatedEffects;
              setCatEffects(updatedEffects);

              const clashObj = {
                kickerId: kicker.id,
                kickerName: kicker.name,
                kickerNumber: kicker.number,
                victimId: victim.id,
                victimName: victim.name,
                victimNumber: victim.number,
                kickerIndex,
                victimIndex,
                direction,
                xPercent: (nextPos[kicker.id] || 0),
                expiresAt: now + 1300
              };
              activeKickClashRef.current = clashObj;
              setActiveKickClash(clashObj);

              nextPos[kicker.id] = Math.min(106, (nextPos[kicker.id] || 0) + 5.5);
              nextPos[victim.id] = Math.max(5, (nextPos[victim.id] || 0) - 5);

              if (soundEnabled) {
                sound.playKickSound();
                setTimeout(() => sound.playStartledMeow(), 160);
              }

              const kickLines = [
                {
                  text: `💥 Trời đất ơi! Bạn ${kicker.name} vừa tung cước đá bay bạn ${victim.name}! Quá tàn nhẫn!`,
                  audio: `Trời đất ơi bạn ${kicker.name} đá bạn ${victim.name}!`
                },
                {
                  text: `😾 Một pha chơi xấu kinh điển! Bạn ${kicker.name} đạp văng bạn ${victim.name} sang làn bên cạnh!`,
                  audio: `Một pha chơi xấu, bạn ${kicker.name} đạp văng bạn ${victim.name}!`
                },
                {
                  text: `😱 Trời ơi là trời! Bạn ${kicker.name} đá bạn ${victim.name}! Trọng tài ở đâu rồi?!`,
                  audio: `Trời ơi là trời bạn ${kicker.name} đá bạn ${victim.name}!`
                },
                {
                  text: `🥋 Pha song phi tình bạn! Bạn ${kicker.name} tiễn bạn ${victim.name} hít khói một đoạn dài!`,
                  audio: `Pha song phi tình bạn, bạn ${kicker.name} đá bạn ${victim.name}!`
                }
              ];
              const chosenKick = kickLines[Math.floor(Math.random() * kickLines.length)];
              setCommentary({
                text: chosenKick.text,
                type: 'kick',
                icon: '💥',
                time: now
              });
              if (liveCasterVoiceEnabled && soundEnabled) {
                speakCaster(chosenKick.audio, 3200);
              }
            }
          } else if (roll < 0.70) {
            // EVENT B: TÉ LĂN QUAY TRƯỢT VỎ CHUỐI (BANANA SLIP TUMBLE)
            const activeRacers = racers.filter((r) => (nextPos[r.id] || 0) > 15 && (nextPos[r.id] || 0) < 95);
            if (activeRacers.length > 0) {
              const victim = activeRacers[Math.floor(Math.random() * activeRacers.length)];
              const updatedEffects = { ...catEffectsRef.current };
              updatedEffects[victim.id] = { type: 'tumbled', expiresAt: now + 1400, label: 'Té Lăn Quay! 🍌' };
              catEffectsRef.current = updatedEffects;
              setCatEffects(updatedEffects);

              nextPos[victim.id] = Math.max(5, (nextPos[victim.id] || 0) - 4.5);

              if (soundEnabled) {
                sound.playSlipSound();
                setTimeout(() => sound.playBoingSound(), 260);
              }

              const slipLines = [
                {
                  text: `🍌 Bạn ${victim.name} đã bị đạp trúng vỏ chuối té lăn quay 720 độ!`,
                  audio: `Bạn ${victim.name} đã bị té lăn quay các kiểu!`
                },
                {
                  text: `😵 Pha tiếp đất bằng mông đỉnh cao! Bạn ${victim.name} té dập mặt rồi!`,
                  audio: `Pha tiếp đất bằng mông, bạn ${victim.name} té dập mặt rồi!`
                },
                {
                  text: `🍌 Bất ngờ chưa! Bạn ${victim.name} đang chạy bon bon thì trượt chân xoay như chong chóng!`,
                  audio: `Bất ngờ chưa, bạn ${victim.name} té lăn đùng ra đường đua!`
                },
                {
                  text: `🌀 Ôi bạn ${victim.name} ơi là bạn ${victim.name}! Đang ngon trớn tự nhiên té lăn đùng ra đó!`,
                  audio: `Bạn ${victim.name} đã bị té lăn quay!`
                }
              ];
              const chosenSlip = slipLines[Math.floor(Math.random() * slipLines.length)];
              setCommentary({
                text: chosenSlip.text,
                type: 'slip',
                icon: '🍌',
                time: now
              });
              if (liveCasterVoiceEnabled && soundEnabled) {
                speakCaster(chosenSlip.audio, 3200);
              }
            }
          } else if (roll < 0.88) {
            // EVENT C: LON PATE CÁ HỒI SIÊU TỐC (TUNA CAN TURBO BOOST)
            const sorted = [...racers].sort((a, b) => (nextPos[a.id] || 0) - (nextPos[b.id] || 0));
            const trailingRacer = sorted[Math.floor(Math.random() * Math.min(3, sorted.length))] || racers[0];

            const updatedEffects = { ...catEffectsRef.current };
            updatedEffects[trailingRacer.id] = { type: 'turbo', expiresAt: now + 1600, label: 'Pate Siêu Tốc! 🐟🚀' };
            catEffectsRef.current = updatedEffects;
            setCatEffects(updatedEffects);

            nextPos[trailingRacer.id] = Math.min(108, (nextPos[trailingRacer.id] || 0) + 9);

            if (soundEnabled) {
              sound.playTurboSound();
              setTimeout(() => sound.playQuickMew('excited'), 200);
            }

            const turboLines = [
              {
                text: `🐟 Ôi mẹ ơi! Bạn ${trailingRacer.name} vừa húp trọn lon Pate cá hồi, hóa tên lửa bứt phá!`,
                audio: `Không thể tin được, bạn ${trailingRacer.name} bật tên lửa bứt tốc kinh hoàng!`
              },
              {
                text: `🚀 Kinh hoàng! Bạn ${trailingRacer.name} bật phản lực pate siêu tốc, lao đi như một cơn gió!`,
                audio: `Bạn ${trailingRacer.name} húp lon pate cá hồi bật phản lực bứt phá!`
              }
            ];
            const chosenTurbo = turboLines[Math.floor(Math.random() * turboLines.length)];
            setCommentary({
              text: chosenTurbo.text,
              type: 'turbo',
              icon: '🚀',
              time: now
            });
            if (liveCasterVoiceEnabled && soundEnabled) {
              speakCaster(chosenTurbo.audio, 3200);
            }
          } else {
            // EVENT D: BƯỚM ĐẬU MŨI ĐỨNG HÌNH (BUTTERFLY DISTRACTION)
            const rTarget = racers[Math.floor(Math.random() * racers.length)];
            const updatedEffects = { ...catEffectsRef.current };
            updatedEffects[rTarget.id] = { type: 'distracted', expiresAt: now + 1200, label: 'Bắt Bướm! 🦋' };
            catEffectsRef.current = updatedEffects;
            setCatEffects(updatedEffects);

            if (soundEnabled) {
              sound.playBoingSound();
            }

            const bfLines = [
              {
                text: `🦋 Trời đất ơi! Con bướm ở đâu bay tới đậu ngay sống mũi bạn ${rTarget.name}, đứng hình luôn!`,
                audio: `Trời đất ơi con bướm đậu mũi bạn ${rTarget.name}, đứng hình luôn!`
              },
              {
                text: `🌸 Đang đua căng thẳng mà bạn ${rTarget.name} lại dừng lại ngắm bướm bắt hoa, cạn lời thực sự!`,
                audio: `Đang đua mà bạn ${rTarget.name} lại đứng ngắm bướm, cạn lời luôn!`
              }
            ];
            const chosenBf = bfLines[Math.floor(Math.random() * bfLines.length)];
            setCommentary({
              text: chosenBf.text,
              type: 'distracted',
              icon: '🦋',
              time: now
            });
            if (liveCasterVoiceEnabled && soundEnabled) {
              speakCaster(chosenBf.audio, 3200);
            }
          }
        }
      }

      setPositions(nextPos);
      setLeaderId(leadId);

      // Finish check:
      // 1. Countdown timer hits 0 (progress >= 1.0)
      // 2. OR leader has sprinted cleanly across the finish ribbon into the victory zone (maxP >= 115) and countdown is nearly finished (progress >= 0.94)
      if (!finishTriggeredRef.current) {
        if (progress >= 1.0 || (crossingOrderRef.current.length > 0 && maxP >= 115 && progress >= 0.94)) {
          finishTriggeredRef.current = true;
          handleFinishRace(nextPos);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, totalSeconds, racers, soundEnabled, liveCasterVoiceEnabled]);

  // Race Finish Ceremony
  const handleFinishRace = (finalSnapshotPositions = positions) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sound.stopRaceMusic();
    speech.stop();
    setIsRunning(false);
    setIsFinished(true);
    setRemainingSeconds(0);

    // DETERMINATION OF WINNER:
    // "mèo phải chạy qua hết vạch nhanh nhất thì mới được tính là mèo thắng"
    // 1. Racers who crossed the finish line ribbon in the exact order they crossed (crossingOrderRef.current)
    // 2. Racers who haven't crossed yet, sorted by their remaining distance (finalSnapshotPositions)
    const crossedList = crossingOrderRef.current
      .map((id) => racers.find((r) => r.id === id))
      .filter(Boolean);

    const uncrossedList = racers
      .filter((r) => !crossingOrderRef.current.includes(r.id))
      .sort((a, b) => (finalSnapshotPositions[b.id] || 0) - (finalSnapshotPositions[a.id] || 0));

    const finalRankings = [...crossedList, ...uncrossedList];
    const winningCat = finalRankings[0] || racers[0];

    // Ensure winner is in crossedList
    if (!crossingOrderRef.current.includes(winningCat.id)) {
      crossingOrderRef.current.push(winningCat.id);
      setFirstCrossedId(winningCat.id);
      setCrossedIds([...crossingOrderRef.current]);
    }

    setWinner(winningCat);
    setRankings(finalRankings);
    setFirstCrossedId(winningCat.id);

    setCommentary({
      text: `🏆 VÔ ĐỊCH: Mèo số ${winningCat.number} (${winningCat.name}) đã xuất sắc cán đích đầu tiên và giành chiến thắng!`,
      type: 'winner',
      icon: '🏆',
      time: Date.now()
    });

    // Arrange final positions:
    // Racers that crossed line are placed in victory zone (> 100%):
    // 1st: 118% (far past the ribbon at 80% track width)
    // 2nd (if crossed): 112%
    // 3rd (if crossed): 107%
    // 4th (if crossed): 103%
    // Racers that didn't cross line remain before line (< 100%): 96%, 92%, 88%...
    const finalPos = {};
    const crossedNow = crossingOrderRef.current
      .map((id) => racers.find((r) => r.id === id))
      .filter(Boolean);
    const uncrossedNow = racers.filter((r) => !crossingOrderRef.current.includes(r.id));

    crossedNow.forEach((r, idx) => {
      finalPos[r.id] = Math.max(103, 118 - idx * 4.5);
    });
    uncrossedNow.forEach((r, idx) => {
      finalPos[r.id] = Math.min(97, 96 - idx * 4);
    });
    setPositions(finalPos);

    if (alarmBellEnabled) {
      sound.playAlarmBell();
    }
    sound.playVictoryMeow();
    sound.playFanfare();

    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.55 },
    });

    if (voiceAnnounceEnabled) {
      setTimeout(() => {
        speech.speakVietnamese(
          `Chúc mừng Mèo số ${winningCat.number}, bạn ${winningCat.name} đã chạy qua vạch đích nhanh nhất và giành chiến thắng!`
        );
      }, 700);
    }
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Preset Selection
  const handleSelectPreset = (secs) => {
    sound.playClick();
    handleResetRace(secs);
    setIsSettingsOpen(false);
  };

  // Custom Time Apply
  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    const m = parseInt(customMin || '0', 10);
    const s = parseInt(customSec || '0', 10);
    const total = m * 60 + s;
    if (total > 0) {
      sound.playClick();
      handleResetRace(total);
      setIsSettingsOpen(false);
    }
  };

  // Calculate live Top 3 Leaders
  const liveLeaders = [...racers]
    .sort((a, b) => (positions[b.id] || 0) - (positions[a.id] || 0))
    .slice(0, 3);

  // Dynamic lane height based on racer count
  const laneHeightClass =
    racers.length <= 6
      ? 'h-24 sm:h-28'
      : racers.length <= 10
      ? 'h-20 sm:h-22'
      : 'h-16 sm:h-18';

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#222B38] select-none flex flex-col font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : 'min-h-[600px]'
      }`}
    >
      {/* ==================================================================== */}
      {/* 1. TOP STADIUM GRASS BORDER WITH CONTROLS & DIGITAL COUNTDOWN CLOCK   */}
      {/* ==================================================================== */}
      <div className="sticky top-0 bg-[#3EA824] px-3 sm:px-6 py-2 sm:py-2.5 z-30 flex items-center justify-between shadow-md border-b-4 border-[#267316]">
        {/* Stadium turf border trim (neatly contained at base of grass roof) */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex overflow-hidden pointer-events-none opacity-40">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-4 bg-[#267316] rounded-t-full flex-shrink-0"
              style={{ marginLeft: '-6px' }}
            />
          ))}
        </div>

        {/* LEFT CONTROLS: Square Black Buttons (⚙️, 🎵, 🔔, ➕, ➖) & Start/Clear */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 z-10 flex-wrap">
          {/* Black Square Buttons with White Icons matching screenshot */}
          <div className="flex items-center gap-1 bg-[#1A202C] p-1 rounded-xl border-2 border-black/30 shadow-md">
            {/* 1. Settings Gear */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-[#4A5568] text-white rounded-lg transition"
              title="Cài đặt thời gian, thêm mèo & nạp danh sách học sinh"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 2. Sound & Race Music Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSoundEnabled((prev) => {
                  const next = !prev;
                  if (!next) {
                    sound.stopRaceMusic();
                  } else if (isRunning) {
                    sound.startRaceMusic({ urgent: remainingSeconds <= 6 });
                  }
                  return next;
                });
              }}
              className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-[#4A5568] text-white rounded-lg transition"
              title={soundEnabled ? 'Tắt nhạc thi đấu & tiếng mèo' : 'Bật nhạc thi đấu & tiếng mèo'}
            >
              {soundEnabled ? (
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
              ) : (
                <Music className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 line-through" />
              )}
            </button>

            {/* 3. Alarm Bell Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setAlarmBellEnabled(!alarmBellEnabled);
              }}
              className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-[#4A5568] text-white rounded-lg transition"
              title={alarmBellEnabled ? 'Tắt chuông báo hết giờ' : 'Bật chuông báo hết giờ'}
            >
              {alarmBellEnabled ? (
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
              ) : (
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />
              )}
            </button>

            {/* 4. Quick Add Racer (+) Button */}
            <button
              type="button"
              onClick={handleAddRacer}
              className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-emerald-600 text-white rounded-lg transition flex items-center gap-0.5"
              title="Thêm 1 Mèo (Không giới hạn số lượng!)"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
              <span className="text-[10px] font-black hidden sm:inline">Thêm</span>
            </button>

            {/* 5. Quick Remove Racer (-) Button */}
            {racers.length > 2 && (
              <button
                type="button"
                onClick={handleRemoveRacer}
                className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-rose-600 text-white rounded-lg transition"
                title="Bớt 1 Mèo"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-300" />
              </button>
            )}
          </div>

          {/* PAUSE / START & CLEAR BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-3 sm:px-4 py-1.5 bg-[#1A202C] hover:bg-[#2D3748] text-white font-black text-xs sm:text-sm rounded-xl border-2 border-black/30 shadow-md transition tracking-wide active:translate-y-0.5 flex items-center gap-1.5"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-yellow-300" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>START</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                handleResetRace();
              }}
              className="text-white hover:text-yellow-200 font-black text-xs sm:text-sm tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] active:translate-y-0.5 transition uppercase"
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* CENTER: THE ICONIC DIGITAL COUNTDOWN CLOCK BOX (00:00:21) */}
        <div className="z-10 bg-[#F4F4FD] border-[3.5px] border-[#1A202C] rounded-2xl px-3 sm:px-7 py-1 shadow-xl flex items-center justify-center">
          <span className="font-mono text-2xl sm:text-4xl font-black text-[#1A202C] tracking-widest drop-shadow-sm select-all">
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* RIGHT: RACER COUNT PILL & FULLSCREEN */}
        <div className="flex items-center gap-2 z-10">
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="cursor-pointer flex items-center gap-1.5 text-[11px] font-black text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full border border-white/20 transition shadow"
            title="Nhấn để đổi số lượng mèo hoặc nạp danh sách học sinh"
          >
            <span className="text-yellow-300">🐱</span>
            <span>{racers.length} Mèo Đua</span>
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 bg-[#1A202C] hover:bg-[#2D3748] text-white rounded-xl border-2 border-black/30 transition shadow-md"
            title="Toàn màn hình máy chiếu"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TV SPORTS BROADCAST & LIVE COMMENTARY CONSOLE (KHUNG BÌNH LUẬN)      */}
      {/* ==================================================================== */}
      <div className="bg-[#12161A] border-b-2 border-[#FFC600]/40 z-20 shadow-md">
        {/* ROW 1: THE DEDICATED LIVE COMMENTARY BOX (KHUNG BÌNH LUẬN TRỰC TIẾP) */}
        <div className="px-3 sm:px-5 py-2.5 bg-gradient-to-r from-[#2A0B0B] via-[#161B20] to-[#261A08] flex items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
            {/* Live Pulsing Microphone Badge */}
            <div className="flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex-shrink-0 animate-pulse tracking-wide">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{commentary.icon || '🎙️'} BÌNH LUẬN TRỰC TIẾP</span>
            </div>

            {/* Commentary text - large, vibrant, readable across the room */}
            <div
              key={commentary.time}
              className="text-yellow-300 font-black text-xs sm:text-sm md:text-base truncate animate-fade-in flex items-center gap-2 drop-shadow-sm"
            >
              <span>{commentary.text}</span>
            </div>
          </div>

          {/* Slapstick Troll Mode Status Badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {trollModeEnabled ? (
              <span className="text-[11px] text-amber-300 font-black flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40 shadow">
                <span>⚡</span>
                <span className="hidden sm:inline">CHẾ ĐỘ</span>
                <span>ĐUA ĐỂU: BẬT</span>
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 font-bold hidden sm:inline bg-white/10 px-2.5 py-1 rounded-full">
                Đua Chuẩn
              </span>
            )}
          </div>
        </div>

        {/* ROW 2: LIVE SPEED LEADERBOARD TICKER */}
        <div className="px-3 sm:px-5 py-1.5 bg-[#0C1014] text-white text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-amber-400 font-black uppercase text-[11px] tracking-wider flex items-center gap-1 flex-shrink-0">
              🏆 TOP DẪN ĐẦU:
            </span>
            {liveLeaders.map((r, i) => (
              <span
                key={r.id}
                className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold transition ${
                  i === 0
                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-black'
                    : i === 1
                    ? 'bg-stone-300/15 text-stone-200 border border-stone-400/30'
                    : 'bg-amber-700/20 text-amber-300 border border-amber-700/30'
                }`}
              >
                <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <span>Mèo {r.number} ({r.name})</span>
              </span>
            ))}
          </div>

          <span className="text-stone-400 text-[11px] hidden md:inline font-mono opacity-80 whitespace-nowrap">
            🏟️ ĐƯỜNG ĐUA V ENGLISH HOUSE
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. THE ATHLETIC RUNNING TRACK (Terracotta Sports Surface & Lanes)      */}
      {/* ==================================================================== */}
      <div className="relative flex-1 bg-[#B83A26] overflow-y-auto max-h-[640px] flex flex-col py-2 sm:py-3 select-none">
        {/* Moving track lines & athletic road texture */}
        <div
          className={`absolute inset-0 flex pointer-events-none select-none ${
            isRunning ? 'animate-[trackRunFlowFast_1.4s_linear_infinite]' : 'animate-[trackRunFlowSlow_7s_linear_infinite]'
          }`}
          style={{ width: '200%' }}
        >
          {/* Segment A */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <svg className="w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 1200 400">
              <line x1="0" y1="35" x2="1200" y2="35" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="95" x2="1200" y2="95" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="155" x2="1200" y2="155" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="215" x2="1200" y2="215" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="275" x2="1200" y2="275" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="335" x2="1200" y2="335" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
            </svg>
          </div>
          {/* Segment B (duplicate for infinite seamless translation) */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <svg className="w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 1200 400">
              <line x1="0" y1="35" x2="1200" y2="35" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="95" x2="1200" y2="95" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="155" x2="1200" y2="155" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="215" x2="1200" y2="215" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="275" x2="1200" y2="275" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
              <line x1="0" y1="335" x2="1200" y2="335" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="30 25" />
            </svg>
          </div>
        </div>

        {/* STARTING LINE (Left Side): Checkered Start Line & Starting Block Base */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-20 pointer-events-none flex">
          <div className="w-5 sm:w-6 h-full flex flex-col border-r-2 border-white/80 overflow-hidden shadow-lg">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full flex ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
              >
                <div className={`w-1/2 h-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* FINISH LINE RIBBON (Checkered Ribbon placed at exact left: 80%) */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
          style={{ left: '80%', transform: 'translateX(-50%)' }}
        >
          {/* Overhead Banner */}
          <div className="absolute top-1 z-30 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 whitespace-nowrap animate-pulse">
            🏁 VẠCH ĐÍCH • FINISH
          </div>

          {/* Checkered Ribbon Poles */}
          <div className="w-5 sm:w-6 h-full flex flex-col border-x-2 border-white/90 shadow-2xl overflow-hidden bg-black/20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full flex ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
              >
                <div className={`w-1/2 h-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
              </div>
            ))}
          </div>

          {/* Ribbon Cut Banner if first cat crossed */}
          {firstCrossedId && (
            <div className="absolute top-1/2 -translate-y-1/2 bg-yellow-400 text-black font-black text-[10px] px-2.5 py-1 rounded-full shadow-lg border-2 border-black whitespace-nowrap animate-bounce z-30">
              💥 ĐÃ CẮT BĂNG VỀ ĐÍCH!
            </div>
          )}

          {/* Bottom Coordinate Indicator */}
          <div className="absolute bottom-1 z-30 bg-black/85 text-yellow-300 font-black text-[9px] px-2 py-0.5 rounded shadow border border-white/20 whitespace-nowrap">
            VẠCH ĐÍCH (100%)
          </div>
        </div>

        {/* POST-FINISH VICTORY RUN-OFF ZONE (From left: 80% to 100%) */}
        <div
          className="absolute top-0 bottom-0 right-0 z-0 pointer-events-none overflow-hidden"
          style={{ left: '80%' }}
        >
          <div className="w-full h-full bg-gradient-to-r from-amber-600/35 via-yellow-500/25 to-amber-700/35 flex flex-col justify-center items-center border-l-2 border-yellow-400/50">
            <span className="text-white/25 font-black text-xl sm:text-2xl tracking-widest uppercase select-none text-center">
              🏆 VÙNG VỀ ĐÍCH
            </span>
            <span className="text-yellow-200/40 font-bold text-[10px] tracking-wider uppercase select-none text-center">
              Sau vạch đích • Quán quân
            </span>
          </div>
        </div>

        {/* ALL RACING LANES (Unlimited: Each lane has its bold painted number + running cat actor) */}
        {racers.map((racer) => {
          const posPercent = positions[racer.id] || 0;
          // pos 0% -> left 7% (starting blocks)
          // pos 100% -> left 80% (checkered finish line ribbon)
          // pos 120% -> left 7 + (1.20 * 73) = 94.6% (sprinting past finish line in victory zone)
          const leftStyle = 7 + (posPercent / 100) * 73;
          const isWin = winner?.id === racer.id;
          const isLead = leaderId === racer.id;
          const isFirstAcross = firstCrossedId === racer.id || (isWin && isFinished);
          const hasCrossed = posPercent >= 100 || crossedIds.includes(racer.id);
          const crossIndex = crossedIds.indexOf(racer.id);

          return (
            <div
              key={racer.id}
              className={`relative ${laneHeightClass} flex items-center px-2 z-10 border-b-2 border-white/35 border-dashed`}
            >
              {/* BOLD WHITE NUMBER PAINTED ON TRACK */}
              <div className="absolute left-8 sm:left-10 z-10 pointer-events-none select-none">
                <span
                  className="font-black text-2xl sm:text-4xl text-white opacity-85"
                  style={{
                    fontFamily: 'Impact, Arial Black, Montserrat, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                  }}
                >
                  {racer.number}
                </span>
              </div>

              {/* Running Track Lane Divider Center Line */}
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 border-b border-white/20 pointer-events-none" />

              {/* THE RUNNING CAT ACTOR */}
              <div
                className={`absolute z-20 flex flex-col items-center ${
                  isRunning ? 'transition-none' : 'transition-all duration-300 ease-out'
                }`}
                style={{
                  left: `${leftStyle}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {/* Winner / Crossed Ribbon Status Badge above Cat */}
                {isFirstAcross ? (
                  <div className="animate-bounce bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 whitespace-nowrap mb-0.5 z-30">
                    <span>👑</span>
                    <span>QUÁN QUÂN • VỀ ĐÍCH #1</span>
                  </div>
                ) : hasCrossed ? (
                  <div className="bg-emerald-600 text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow border border-white/60 flex items-center gap-1 whitespace-nowrap mb-0.5 z-30">
                    <span>✓</span>
                    <span>ĐÃ QUA VẠCH (#{crossIndex >= 0 ? crossIndex + 1 : 2})</span>
                  </div>
                ) : isLead && isRunning ? (
                  <div className="animate-pulse bg-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow border border-white/40 flex items-center gap-1 whitespace-nowrap mb-0.5 z-30">
                    <span>⭐ DẪN ĐẦU</span>
                  </div>
                ) : null}

                <RunningCat
                  racer={racer}
                  isRunning={isRunning}
                  isWinner={isWin || isFirstAcross}
                  isLeader={isLead}
                  effect={catEffects[racer.id]}
                />

                {/* Name / Jersey Tag below Cat with 1-Click Inline Rename & Color Picker */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenRenameModal(racer);
                  }}
                  className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-black/65 hover:bg-amber-600 px-2.5 py-0.5 rounded-full whitespace-nowrap -mt-1 border border-white/20 shadow flex items-center gap-1.5 group/rename transition cursor-pointer"
                  title={`Nhấp để đổi tên & chọn màu cho ${racer.name}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/80 inline-block flex-shrink-0"
                    style={{ backgroundColor: racer.furColor }}
                  />
                  <span>{racer.name}</span>
                  <span className="text-[9px] opacity-75 group-hover/rename:opacity-100">🎨 ✏️</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* SLAPSTICK KICK IMPACT BANNER OVERLAY (Connects Kicker & Victim clearly) */}
        {activeKickClash && (
          <div
            className="absolute z-40 pointer-events-none flex flex-col items-center animate-[comicPop_0.25s_cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-2xl select-none"
            style={{
              left: `${7 + (activeKickClash.xPercent / 100) * 73}%`,
              top: `${((activeKickClash.kickerIndex + activeKickClash.victimIndex + 1) / (2 * racers.length)) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-4 bg-yellow-400/40 rounded-full blur-md animate-ping" />
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-2xl flex items-center gap-2 whitespace-nowrap transform scale-110">
                <span className="text-xl">💥</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-yellow-200">
                  {activeKickClash.kickerName}
                </span>
                <span className="text-yellow-300 text-xs sm:text-sm font-extrabold">
                  {activeKickClash.direction === 'down' ? 'TUNG CƯỚC ĐÁ XUỐNG ⬇️' : 'TUNG CƯỚC ĐÁ LÊN ⬆️'}
                </span>
                <span className="bg-black/40 px-2 py-0.5 rounded-lg text-white underline">
                  {activeKickClash.victimName}
                </span>
                <span className="text-xl">🦶</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 3. SETTINGS & UNLIMITED ROSTER MODAL (When teacher clicks ⚙️ Gear)     */}
      {/* ==================================================================== */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full text-[#1F2421] shadow-2xl border-4 border-[#FFC600] space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#A67C1E]" />
                <h3 className="font-black text-base sm:text-lg">Cài Đặt Đua Mèo • Unlimited Cat Race</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setSettingsTab('general')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  settingsTab === 'general'
                    ? 'bg-white text-[#1F2421] shadow-sm border border-stone-200/80'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Thời Gian & Số Mèo</span>
                <span className="sm:hidden">Cơ Bản</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsTab('names')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  settingsTab === 'names'
                    ? 'bg-white text-[#1F2421] shadow-sm border border-stone-200/80'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <span>🎨</span>
                <span>Tên & Màu ({racers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsTab('classes')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  settingsTab === 'classes'
                    ? 'bg-white text-[#1F2421] shadow-sm border border-stone-200/80'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <span>🏫</span>
                <span>Danh Sách Lớp</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsTab('troll')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  settingsTab === 'troll'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <span>💥</span>
                <span className="hidden sm:inline">Đua Đểu (Troll)</span>
                <span className="sm:hidden">Đua Đểu</span>
              </button>
            </div>

            {/* ================================================================ */}
            {/* TAB 1: GENERAL SETTINGS (Time, Lanes, Sounds)                      */}
            {/* ================================================================ */}
            {settingsTab === 'general' && (
              <div className="space-y-4">
                {/* 1. Quick Presets for Countdown */}
                <div>
                  <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                    ⏱️ Chọn Nhanh Thời Gian Đếm Ngược:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_TIMES.map((preset) => (
                      <button
                        key={preset.seconds}
                        type="button"
                        onClick={() => handleSelectPreset(preset.seconds)}
                        className={`p-2.5 rounded-xl font-black text-xs transition border text-center ${
                          totalSeconds === preset.seconds
                            ? 'bg-[#FFC600] text-[#1F2421] border-[#FFC600] shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Time Form */}
                <form onSubmit={handleApplyCustomTime} className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-stone-500 block">
                    ✍️ Hoặc Nhập Thời Gian Tự Chọn:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      placeholder="0 Phút"
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value)}
                      className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-center outline-none focus:border-[#FFC600]"
                    />
                    <span className="font-black text-base">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="39 Giây"
                      value={customSec}
                      onChange={(e) => setCustomSec(e.target.value)}
                      className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-center outline-none focus:border-[#FFC600]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 transition flex-shrink-0"
                    >
                      Áp Dụng
                    </button>
                  </div>
                </form>

                {/* 3. Unlimited Lane Selection */}
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase text-stone-700">
                      🐱 Số Lượng Mèo Đua: <span className="text-emerald-700 font-extrabold">{racers.length} Mèo</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAddRacer}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg transition flex items-center gap-1 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Mèo
                      </button>
                      {racers.length > 2 && (
                        <button
                          type="button"
                          onClick={handleRemoveRacer}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-lg transition flex items-center gap-1 shadow"
                        >
                          <Minus className="w-3.5 h-3.5" /> Bớt Mèo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick count chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[4, 8, 12, 16, 20, 24, 30].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetRacerCount(num)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs border transition ${
                          racers.length === num
                            ? 'bg-[#1F2421] text-white border-black shadow'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {num} Mèo
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Audio Settings */}
                <div className="pt-2 border-t border-stone-200 space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
                    <span className="font-bold text-stone-700">Nhạc nền thi đấu sôi động & tiếng mèo kêu:</span>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
                    <span className="font-bold text-stone-700">Chuông báo hết giờ (Alarm Bell):</span>
                    <input
                      type="checkbox"
                      checked={alarmBellEnabled}
                      onChange={(e) => setAlarmBellEnabled(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </label>

                  <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 border border-stone-200/60">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-700 text-xs sm:text-sm">🎙️ Giọng Bình Luận Viên Trực Tiếp (Chị Google BLV):</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                          🔥 Hài hước & Kịch tính
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        BLV trực tiếp xướng tên khi mèo đá nhau, té vỏ chuối, bứt tốc soán ngôi đầu!
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speech.speakVietnamese("Trời đất ơi bạn Ánh đá bạn Vi! Nhưng không bạn Bình không cho phép, bạn Bình đã nhanh hơn! Bạn Ánh đã bị té lăn quay các kiểu!")}
                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition"
                        title="Nghe thử giọng BLV Chị Google"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Nghe thử BLV
                      </button>
                      <input
                        type="checkbox"
                        checked={liveCasterVoiceEnabled}
                        onChange={(e) => setLiveCasterVoiceEnabled(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 border border-stone-200/60">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-700 text-xs sm:text-sm">Xướng tên mèo vô địch bằng tiếng Việt:</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          ⭐ Chị Google Chuẩn 100%
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Tự nhiên, ấm áp, phát âm tiếng Việt chuẩn xác không méo tiếng.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speech.speakVietnamese("Chúc mừng Mèo số một, Miu Miu Quàng Khăn đã giành chiến thắng!")}
                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition"
                        title="Nghe thử giọng tiếng Việt Chị Google"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Nghe thử
                      </button>
                      <input
                        type="checkbox"
                        checked={voiceAnnounceEnabled}
                        onChange={(e) => setVoiceAnnounceEnabled(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 2: CAT RACER NAMES & COLORS (Tùy Chọn Đặt Tên & Chọn Màu)     */}
            {/* ================================================================ */}
            {settingsTab === 'names' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-black uppercase text-stone-700 block">
                      🎨 Đặt Tên & Chọn Màu Sắc Cho {racers.length} Tuyển Thủ Mèo:
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Nhập tên học sinh và bấm vào vòng tròn màu sắc để đổi màu lông cho từng chú mèo:
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleRandomizeFunnyNames}
                      className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1"
                      title="Gán ngẫu nhiên các tên siêu hài hước cho cả đội mèo"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Tên Hài Hước 🎲</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetNumericNames}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition"
                      title="Đặt lại Mèo Số 1, 2, 3..."
                    >
                      <span>Số 1-2-3</span>
                    </button>
                  </div>
                </div>

                {/* Grid of Racers Name & Color Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {racers.map((racer) => (
                    <div
                      key={racer.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition flex flex-col gap-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        {/* Avatar preview */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm flex-shrink-0 border-2 border-white/80"
                          style={{ backgroundColor: racer.furColor }}
                        >
                          #{racer.number}
                        </div>

                        {/* Name input */}
                        <input
                          type="text"
                          value={racer.name}
                          onChange={(e) => handleRenameRacer(racer.id, e.target.value)}
                          placeholder={`Tên Mèo số ${racer.number}...`}
                          className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#1F2421] outline-none focus:border-[#FFC600]"
                        />

                        {/* Quick dice for single cat */}
                        <button
                          type="button"
                          onClick={() => {
                            const randName = FUNNY_CAT_NAMES[Math.floor(Math.random() * FUNNY_CAT_NAMES.length)];
                            handleRenameRacer(racer.id, `${randName} #${racer.number}`);
                          }}
                          className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-500 hover:text-stone-700 transition"
                          title="Đổi tên hài hước cho mèo này"
                        >
                          🎲
                        </button>
                      </div>

                      {/* 1-Click Color Swatches for this Cat */}
                      <div className="flex items-center gap-1.5 pl-1 overflow-x-auto scrollbar-none py-0.5">
                        <span className="text-[10px] font-black text-stone-400 uppercase flex-shrink-0 mr-0.5">
                          🎨 Màu lông:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {CAT_PALETTES.map((pal, pIdx) => {
                            const isSelected = racer.furColor === pal.fur;
                            return (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => handleChangeCatColor(racer.id, pIdx)}
                                className={`w-5 h-5 rounded-full border transition transform hover:scale-125 flex-shrink-0 relative ${
                                  isSelected
                                    ? 'ring-2 ring-black scale-110 border-white shadow-md'
                                    : 'border-stone-300/80 hover:border-black'
                                }`}
                                style={{ backgroundColor: pal.fur }}
                                title={`Chọn màu: ${pal.name}`}
                              >
                                {isSelected && (
                                  <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-black drop-shadow">
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-5 py-2.5 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 transition"
                  >
                    Xong & Bắt Đầu Đua!
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 3: CLASS ROSTERS (V English House & Custom Saved Rosters)     */}
            {/* ================================================================ */}
            {settingsTab === 'classes' && (
              <div className="space-y-4">
                {/* 1. Official V English House Classes */}
                <div>
                  <label className="text-xs font-black uppercase text-stone-700 block mb-2">
                    🏫 Chọn Nhanh Danh Sách Lớp V English House:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VHOUSE_CLASSES.map((cls) => (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => handleLoadClassRoster(cls)}
                        className="p-2.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100 border border-amber-300 text-left transition flex items-center justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-amber-950">{cls.name}</span>
                            <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
                              {cls.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-800 font-medium block mt-0.5 line-clamp-1">
                            {cls.students.slice(0, 4).join(', ')}... ({cls.students.length} học sinh)
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Saved Classes (If any) */}
                {customClasses.length > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <label className="text-xs font-black uppercase text-stone-700 block mb-2">
                      💾 Lớp Học Tự Tạo Của Bạn ({customClasses.length} lớp):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {customClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-2.5 rounded-2xl bg-sky-50 border border-sky-300 flex items-center justify-between shadow-sm"
                        >
                          <div
                            onClick={() => handleLoadClassRoster(cls)}
                            className="cursor-pointer flex-1"
                          >
                            <span className="font-black text-xs text-sky-950 block">{cls.name}</span>
                            <span className="text-[10px] text-sky-700 font-medium block">
                              {cls.students.length} học sinh • Nhấn để nạp
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomClass(cls.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition"
                            title="Xóa lớp này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Form to Create & Save New Custom Class */}
                <form onSubmit={handleSaveCustomClass} className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-stone-700">
                      ✍️ Tạo & Lưu Danh Sách Lớp Mới:
                    </label>
                    <span className="text-[10px] text-stone-400 font-medium">Tự động lưu vào trình duyệt</span>
                  </div>

                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Nhập tên lớp (Ví dụ: Lớp 6A - Chiều Thứ 7, Lớp Cô Vi...)"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold outline-none focus:border-[#FFC600]"
                  />

                  <textarea
                    rows={3}
                    value={newClassRoster}
                    onChange={(e) => setNewClassRoster(e.target.value)}
                    placeholder="Dán danh sách tên học sinh vào đây (mỗi dòng 1 tên)...&#10;Bảo An&#10;Gia Huy&#10;Minh Khôi"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono outline-none focus:border-[#FFC600] resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Vào Danh Sách Lớp & Áp Dụng Ngay</span>
                  </button>
                </form>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 4: TROLL & SLAPSTICK CHAOS MODE                              */}
            {/* ================================================================ */}
            {settingsTab === 'troll' && (
              <div className="space-y-4">
                {/* Mode Master Toggle */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-orange-500/15 border-2 border-amber-400/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center text-xl shadow-md">
                      💥
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#1F2421]">Chế Độ "Đua Đểu" Hài Hước</h4>
                      <p className="text-xs text-stone-600 font-medium">
                        Bật các pha va chạm, đá xoạc chân, té lăn quay và lật kèo ngoạn mục!
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trollModeEnabled}
                      onChange={(e) => setTrollModeEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>

                {/* Stunt Explanations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-rose-700">
                      <span>😾💥</span>
                      <span>Cú Đá Tình Bạn (Side-Kick)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium">
                      Hai chú mèo ở 2 lane kề nhau đang chạy ngang ngửa sẽ bất ngờ tung cước đá bay đối thủ lại phía sau để bứt tốc!
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-yellow-700">
                      <span>🍌💫</span>
                      <span>Té Lăn Quay (Banana Slip)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium">
                      Đang dẫn đầu thì trúng vỏ chuối, xoay mòng mòng 3 vòng chóng mặt 720°, sau đó cay cú bứt phá lại!
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-cyan-700">
                      <span>🐟🚀</span>
                      <span>Pate Siêu Tốc (Tuna Boost)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium">
                      Mèo xếp chót bất ngờ húp trọn hộp Pate cá hồi, đuôi phụt lửa tên lửa lao vun vút lên top dẫn đầu!
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-purple-700">
                      <span>🦋🐾</span>
                      <span>Bướm Đậu Mũi (Distraction)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium">
                      Đang chạy bỗng thấy con bướm bay ngang, đứng hình mất 1 giây ngơ ngác giơ chân bắt bướm!
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <span className="text-base">📢</span>
                  <span>
                    Bình luận viên trực tiếp trên bảng tin sẽ xướng tên và cập nhật từng pha va chạm hài hước theo thời gian thực!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. QUICK INLINE RENAME MODAL (When teacher clicks ✏️ on cat name tag) */}
      {/* ==================================================================== */}
      {editingRacer && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full text-[#1F2421] shadow-2xl border-4 border-[#FFC600] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#A67C1E]" />
                <h3 className="font-black text-sm">✏️ Đổi Tên & 🎨 Chọn Màu Mèo Số {editingRacer.number}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRacer(null)}
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-stone-500 block mb-1">
                Nhập tên hiển thị:
              </label>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                placeholder="Nhập tên học sinh hoặc biệt danh..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-[#1F2421] outline-none focus:border-[#FFC600]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameRacer(editingRacer.id, editNameInput);
                  }
                }}
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] font-bold text-stone-400 block mb-1">Gợi ý tên vui nhộn:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Mèo Béo Ú', 'Mèo Ngáo', 'Mèo Cục Súc', 'Chiến Thần Mèo', 'Mèo Đại Gia', 'Mèo Lười'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setEditNameInput(sug)}
                    className="px-2 py-1 bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-700 rounded-md border border-stone-200 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Click Color Selector */}
            <div>
              <span className="text-[10px] font-bold text-stone-400 block mb-1">
                🎨 Chọn màu sắc lông ({CAT_PALETTES.length} màu):
              </span>
              <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-stone-50 rounded-xl border border-stone-200">
                {CAT_PALETTES.map((pal, pIdx) => {
                  const isCurColor = editingRacer.furColor === pal.fur;
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        handleChangeCatColor(editingRacer.id, pIdx);
                        setEditingRacer((prev) => ({
                          ...prev,
                          furColor: pal.fur,
                          stripeColor: pal.stripe,
                          accentColor: pal.accent,
                          accessory: pal.acc
                        }));
                      }}
                      className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-left transition ${
                        isCurColor
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 font-black shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: pal.fur }}
                      />
                      <span className="text-[9px] text-stone-700 truncate font-bold">
                        {pal.name.replace('Mèo ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingRacer(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleRenameRacer(editingRacer.id, editNameInput)}
                className="flex-1 py-2.5 bg-[#FFC600] hover:bg-[#E6B200] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow transition"
              >
                Lưu & Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. WINNER CELEBRATION MODAL (At 00:00:00 Finish!)                     */}
      {/* ==================================================================== */}
      {isFinished && winner && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-bounce-short">
          <div className="bg-white border-4 border-[#FFC600] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative text-[#1F2421]">
            <div className="w-20 h-20 bg-[#FFC600] text-[#1F2421] rounded-full flex items-center justify-center mx-auto mb-3 text-4xl shadow-duo-yellow animate-bounce">
              🏆
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-[#A67C1E]">
              CUỘC ĐUA KẾT THÚC · HẾT GIỜ!
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-[#1F2421] mt-1 font-brand">
              🎉 {winner.name} CHIẾN THẮNG!
            </h3>

            <p className="text-xs text-stone-600 mt-1 font-medium">
              Đã bứt tốc và chạy băng qua vạch đích nhanh nhất!
            </p>

            {/* Podium Top 3 Rankings */}
            <div className="my-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-left">
              <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                BẢNG XẾP HẠNG VỀ ĐÍCH:
              </span>
              {rankings.slice(0, 3).map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold ${
                    i === 0
                      ? 'bg-[#FFFDF6] border border-[#FFC600] text-[#A67C1E]'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </span>
                    <span>{r.name}</span>
                  </div>
                  <span className="text-[11px] opacity-80">{r.label}</span>
                </div>
              ))}
            </div>

            {/* Replay Vietnamese Voice Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  speech.speakVietnamese(`Chúc mừng Mèo số ${winner.number}, ${winner.name} đã chạy qua vạch đích nhanh nhất và giành chiến thắng!`)
                }
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#A67C1E]" />
                <span>Nghe Lại</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetRace()}
                className="flex-1 py-3 bg-[#FFC600] hover:bg-[#E6B200] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đua Lại</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
