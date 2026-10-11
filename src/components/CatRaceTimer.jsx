import React, { useState, useEffect, useRef } from 'react';
import {
  Settings, Music, Bell, Play, Pause, RotateCcw, Volume2, VolumeX,
  Maximize2, Minimize2, Trophy, Sparkles, Flag, Plus, Trash2, Edit2,
  Check, X, Users, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

// ============================================================================
// 8 ICONIC CAT RACERS (Matching Duck Race style: Bandana, Antennae, Classic, Cool...)
// ============================================================================
const INITIAL_CAT_RACERS = [
  {
    id: 'cat_1',
    number: 1,
    name: 'Mèo Số 1',
    label: 'Mèo Khăn Đỏ (Bandana)',
    furColor: '#F59E0B',      // Warm Tabby Orange
    accentColor: '#FEF3C7',   // Cream belly
    stripeColor: '#D97706',
    accessory: 'bandana',     // Red-and-white bandana matching Duck 1 in screenshot!
    accessoryColor: '#EF4444',
    badgeColor: '#FFFFFF',
    emoji: '🐱'
  },
  {
    id: 'cat_2',
    number: 2,
    name: 'Mèo Số 2',
    label: 'Mèo Vàng Vui Vẻ (Classic)',
    furColor: '#FBBF24',      // Bright Yellow / Golden
    accentColor: '#FFFBEB',
    stripeColor: '#F59E0B',
    accessory: 'classic',     // Classic Yellow Rubber-Duck style Cat
    accessoryColor: '#F59E0B',
    badgeColor: '#FFFFFF',
    emoji: '😸'
  },
  {
    id: 'cat_3',
    number: 3,
    name: 'Mèo Số 3',
    label: 'Mèo Xanh Râu Bướm (Antennae)',
    furColor: '#4ADE80',      // Light Green matching Duck 3 in screenshot!
    accentColor: '#DCFCE7',
    stripeColor: '#22C55E',
    accessory: 'antennae',    // Antennae stalks matching Duck 3 in screenshot!
    accessoryColor: '#16A34A',
    badgeColor: '#FFFFFF',
    emoji: '🐛'
  },
  {
    id: 'cat_4',
    number: 4,
    name: 'Mèo Số 4',
    label: 'Mèo Ngầu Kính Râm (Cool Cat)',
    furColor: '#FCD34D',      // Golden Yellow
    accentColor: '#FEF9C3',
    stripeColor: '#F59E0B',
    accessory: 'sunglasses',  // Cool Sunglasses matching Duck 4
    accessoryColor: '#1F2937',
    badgeColor: '#FFFFFF',
    emoji: '😎'
  },
  {
    id: 'cat_5',
    number: 5,
    name: 'Mèo Số 5',
    label: 'Mèo Thợ Lặn (Snorkel Blue)',
    furColor: '#38BDF8',      // Ocean Sky Blue
    accentColor: '#E0F2FE',
    stripeColor: '#0284C7',
    accessory: 'snorkel',
    accessoryColor: '#F97316',
    badgeColor: '#FFFFFF',
    emoji: '🤿'
  },
  {
    id: 'cat_6',
    number: 6,
    name: 'Mèo Số 6',
    label: 'Mèo Nơ Hồng (Pink Ribbon)',
    furColor: '#F472B6',      // Cute Pink
    accentColor: '#FDF2F8',
    stripeColor: '#DB2777',
    accessory: 'bow',
    accessoryColor: '#EC4899',
    badgeColor: '#FFFFFF',
    emoji: '🎀'
  },
  {
    id: 'cat_7',
    number: 7,
    name: 'Mèo Số 7',
    label: 'Mèo LEADER (V-House Gold)',
    furColor: '#EAB308',      // Leader Gold
    accentColor: '#FEF08A',
    stripeColor: '#CA8A04',
    accessory: 'crown',
    accessoryColor: '#FFC600',
    badgeColor: '#FFFFFF',
    emoji: '👑'
  },
  {
    id: 'cat_8',
    number: 8,
    name: 'Mèo Số 8',
    label: 'Mèo FIGHTER (V-House Red)',
    furColor: '#EF4444',      // Fighter Red
    accentColor: '#FEE2E2',
    stripeColor: '#B91C1C',
    accessory: 'headband',
    accessoryColor: '#991B1B',
    badgeColor: '#FFFFFF',
    emoji: '🥊'
  }
];

// Presets matching Duck Race and screenshot
const PRESET_TIMES = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '39s (Ảnh mẫu)', seconds: 39 }, // Exact time in user's screenshot!
  { label: '41s (Ref URL)', seconds: 41 },
  { label: '1 Phút', seconds: 60 },
  { label: '2 Phút', seconds: 120 },
  { label: '3 Phút', seconds: 180 },
  { label: '5 Phút (00:05:01)', seconds: 301 },
];

// ============================================================================
// SVG SWIMMING CAT (DUCK RACE STYLE)
// ============================================================================
function SwimmingCat({ racer, isRunning, isWinner, isLeader }) {
  return (
    <div className="relative flex items-center justify-center select-none cursor-pointer group">
      {/* Dynamic Water Ripples Under Belly */}
      <svg
        viewBox="0 0 110 30"
        className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-7 pointer-events-none ${
          isRunning ? 'animate-pulse' : 'opacity-70'
        }`}
      >
        <ellipse cx="55" cy="15" rx="46" ry="7" fill="none" stroke="#BAE6FD" strokeWidth="2.5" opacity="0.8" />
        <ellipse cx="55" cy="15" rx="36" ry="5" fill="none" stroke="#7DD3FC" strokeWidth="1.8" opacity="0.6" />
      </svg>

      {/* Splashing Droplets behind paddler when running */}
      {isRunning && (
        <div className="absolute -left-4 bottom-2 flex gap-1 pointer-events-none animate-bounce">
          <span className="text-xs">💦</span>
        </div>
      )}

      {/* Crown / Sparkle if leading */}
      {isLeader && isRunning && (
        <div className="absolute -top-3.5 right-6 z-20 animate-bounce text-xs font-black drop-shadow">
          ⭐
        </div>
      )}

      {/* The Swimming Cat SVG */}
      <svg
        viewBox="0 0 115 80"
        className={`w-24 h-16 sm:w-28 sm:h-20 drop-shadow-lg transition-transform ${
          isRunning ? 'animate-bounce' : ''
        } ${isWinner ? 'scale-110 drop-shadow-2xl' : ''}`}
        style={{
          animationDuration: isRunning ? '0.45s' : '0s'
        }}
      >
        <defs>
          <linearGradient id={`furGrad_${racer.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={racer.furColor} />
            <stop offset="100%" stopColor={racer.stripeColor || racer.furColor} />
          </linearGradient>
        </defs>

        {/* 1. Tail (Wagging in water behind) */}
        <path
          d="M 22 45 Q 8 36, 12 24 Q 18 36, 26 42 Z"
          fill={`url(#furGrad_${racer.id})`}
          stroke="#1F2421"
          strokeWidth="2"
        />

        {/* 2. Chubby Swimming Cat Body floating in water */}
        <ellipse cx="56" cy="48" rx="34" ry="22" fill={`url(#furGrad_${racer.id})`} stroke="#1F2421" strokeWidth="2.8" />

        {/* 3. Cat Belly accent */}
        <ellipse cx="58" cy="53" rx="22" ry="13" fill={racer.accentColor} />

        {/* 4. Tabby Stripes */}
        <path d="M 44 32 Q 47 40, 44 46" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 54 30 Q 57 40, 54 48" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 64 32 Q 67 40, 64 46" stroke={racer.stripeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />

        {/* 5. Cat Head */}
        <circle cx="82" cy="34" r="21" fill={`url(#furGrad_${racer.id})`} stroke="#1F2421" strokeWidth="2.8" />

        {/* 6. Cat Ears */}
        {/* Left Ear */}
        <polygon points="69,21 75,6 83,18" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="72,19 76,9 81,17" fill="#FCA5A5" />
        {/* Right Ear */}
        <polygon points="84,18 92,6 98,21" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="86,17 91,9 95,19" fill="#FCA5A5" />

        {/* 7. Accessories matching Duck Race screenshot */}
        {/* ACCESSORY 1: BANDANA (Matching Duck 1 in screenshot!) */}
        {racer.accessory === 'bandana' && (
          <g>
            {/* Bandana ribbon strap across forehead */}
            <path
              d="M 68,26 Q 82,23 96,27"
              stroke="#EF4444"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* White polka dots on bandana */}
            <circle cx="73" cy="25" r="1.3" fill="#FFFFFF" />
            <circle cx="82" cy="24" r="1.3" fill="#FFFFFF" />
            <circle cx="91" cy="26" r="1.3" fill="#FFFFFF" />
            {/* Bandana knot fluttering behind ear */}
            <path d="M 67 26 Q 60 20 54 26 Q 61 28 67 26" fill="#EF4444" stroke="#1F2421" strokeWidth="1.5" />
            <path d="M 66 28 Q 58 32 52 38 Q 60 34 66 28" fill="#EF4444" stroke="#1F2421" strokeWidth="1.5" />
          </g>
        )}

        {/* ACCESSORY 3: GREEN ANTENNAE (Matching Duck 3 in screenshot!) */}
        {racer.accessory === 'antennae' && (
          <g>
            <path d="M 77 15 Q 73 5 67 4" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="67" cy="4" r="3.5" fill="#22C55E" stroke="#1F2421" strokeWidth="1.8" />
            <path d="M 87 15 Q 91 5 97 4" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="97" cy="4" r="3.5" fill="#22C55E" stroke="#1F2421" strokeWidth="1.8" />
          </g>
        )}

        {/* ACCESSORY 4: SUNGLASSES (Matching Duck 4) */}
        {racer.accessory === 'sunglasses' && (
          <g>
            <path d="M 75 30 Q 83 28 92 31" stroke="#111827" strokeWidth="2.5" fill="none" />
            <rect x="76" y="28" width="10" height="9" rx="3" fill="#111827" stroke="#374151" strokeWidth="1" />
            <rect x="88" y="29" width="10" height="9" rx="3" fill="#111827" stroke="#374151" strokeWidth="1" />
            {/* Lens shine */}
            <line x1="78" y1="30" x2="83" y2="35" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="90" y1="31" x2="95" y2="36" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}

        {/* ACCESSORY 5: SNORKEL GOGGLES */}
        {racer.accessory === 'snorkel' && (
          <g>
            <rect x="76" y="27" width="22" height="11" rx="4" fill="#0284C7" stroke="#1F2421" strokeWidth="1.8" />
            <rect x="78" y="29" width="18" height="7" rx="2" fill="#BAE6FD" opacity="0.8" />
            <path d="M 98 33 Q 105 33 105 18 L 105 12" stroke="#F97316" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="105" cy="11" r="2.5" fill="#EF4444" />
          </g>
        )}

        {/* ACCESSORY 6: PINK BOW */}
        {racer.accessory === 'bow' && (
          <g>
            <polygon points="76,14 84,20 76,26" fill="#EC4899" stroke="#1F2421" strokeWidth="1.5" />
            <polygon points="92,14 84,20 92,26" fill="#EC4899" stroke="#1F2421" strokeWidth="1.5" />
            <circle cx="84" cy="20" r="3" fill="#F43F5E" />
          </g>
        )}

        {/* ACCESSORY 7: GOLDEN CROWN */}
        {racer.accessory === 'crown' && (
          <polygon points="78,14 81,6 85,12 89,6 92,14" fill="#FFC600" stroke="#1F2421" strokeWidth="1.8" strokeLinejoin="round" />
        )}

        {/* ACCESSORY 8: FIGHTER HEADBAND */}
        {racer.accessory === 'headband' && (
          <path d="M 68,27 Q 82,24 96,28" stroke="#991B1B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        )}

        {/* 8. Cat Face: Big Cartoon Anime Eyes */}
        {racer.accessory !== 'sunglasses' && racer.accessory !== 'snorkel' && (
          <g>
            {/* Big Expressive Eye */}
            <ellipse cx="88" cy="31" rx="4" ry="5.5" fill="#1F2421" />
            <circle cx="89.5" cy="29" r="1.8" fill="#FFFFFF" />
            <circle cx="87" cy="34" r="0.9" fill="#FFFFFF" />

            {/* Nose & Cute Cat Mouth :3 */}
            <polygon points="95,36 97,38.5 99,36" fill="#F43F5E" />
            <path d="M 93 39 Q 95 42 97 39.5 Q 99 42 101 39" stroke="#1F2421" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Whiskers */}
            <line x1="94" y1="38" x2="106" y2="36" stroke="#1F2421" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="94" y1="41" x2="106" y2="42" stroke="#1F2421" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* 9. Paddling Front Paw dipping into water */}
        <g style={{ transformOrigin: '78px 58px', animation: isRunning ? 'pawPaddle 0.4s ease-in-out infinite alternate' : 'none' }}>
          <ellipse cx="78" cy="58" rx="8" ry="5" fill={racer.furColor} stroke="#1F2421" strokeWidth="2.2" />
          <circle cx="82" cy="59" r="1.5" fill="#FCA5A5" />
          <circle cx="78" cy="60" r="1.5" fill="#FCA5A5" />
        </g>

        {/* 10. ICONIC DUCK-RACE STYLE WHITE NUMBER BADGE ON BODY */}
        <g>
          {/* White Shield Badge with Dark Outline */}
          <rect
            x="38"
            y="35"
            width="26"
            height="24"
            rx="8"
            fill="#FFFFFF"
            stroke="#1F2421"
            strokeWidth="3.2"
          />
          {/* Black Bold Number matching Screenshot */}
          <text
            x="51"
            y="52"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill="#1F2421"
            fontFamily="Arial Black, Impact, Montserrat, sans-serif"
          >
            {racer.number}
          </text>
        </g>

        {/* 11. Water line covering bottom */}
        <path
          d="M 16 62 Q 35 57 55 62 Q 75 67 95 62 Q 105 60 112 62"
          stroke="#38BDF8"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: CAT RACE STOPWATCH (EXACT CLONE OF DUCK RACE)
// ============================================================================
export default function CatRaceTimer() {
  const [totalSeconds, setTotalSeconds] = useState(39); // 39 seconds matching screenshot!
  const [remainingSeconds, setRemainingSeconds] = useState(39);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Racers (Default 4 lanes matching screenshot: 1, 2, 3, 4)
  const [activeLaneCount, setActiveLaneCount] = useState(4);
  const [racers, setRacers] = useState(() => INITIAL_CAT_RACERS.slice(0, 4));

  // Race Physics & Positioning
  const [positions, setPositions] = useState({}); // { [id]: percent (0 to 100) }
  const [leaderId, setLeaderId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [rankings, setRankings] = useState([]);

  // Audio & Display Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmBellEnabled, setAlarmBellEnabled] = useState(true);
  const [voiceAnnounceEnabled, setVoiceAnnounceEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Custom Time Inputs
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('39');

  const containerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const physicsIntervalRef = useRef(null);
  const driftSpeedRef = useRef({});

  // Sync racers when lane count changes
  useEffect(() => {
    const updated = INITIAL_CAT_RACERS.slice(0, activeLaneCount);
    setRacers(updated);
    handleResetRace(totalSeconds, updated);
  }, [activeLaneCount]);

  // Format seconds to digital stopwatch display: HH:MM:SS or MM:SS (e.g. 00:00:39 matching screenshot)
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
    clearInterval(timerIntervalRef.current);
    clearInterval(physicsIntervalRef.current);
    setIsRunning(false);
    setIsFinished(false);
    setWinner(null);
    setRankings([]);
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);

    // Initial positions at starting docks (0%)
    const initPos = {};
    const initDrift = {};
    currentRacers.forEach((r) => {
      initPos[r.id] = 0;
      initDrift[r.id] = 0;
    });
    setPositions(initPos);
    driftSpeedRef.current = initDrift;
    setLeaderId(null);
  };

  // Toggle Start / Pause
  const handleTogglePlay = () => {
    if (isFinished) {
      handleResetRace();
      return;
    }

    if (isRunning) {
      // Pause
      sound.playClick();
      setIsRunning(false);
      clearInterval(timerIntervalRef.current);
      clearInterval(physicsIntervalRef.current);
    } else {
      // Start / Resume
      if (soundEnabled) {
        sound.playWhistle();
      }
      setIsRunning(true);
    }
  };

  // Timer Tick & Race Physics Loop
  useEffect(() => {
    if (!isRunning) return;

    // 1. Second Countdown Timer
    timerIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleFinishRace();
          return 0;
        }

        // Ticking audio
        if (soundEnabled) {
          if (prev <= 5) {
            sound.playUrgentTick();
          } else {
            sound.playSplash();
          }
        }

        return prev - 1;
      });
    }, 1000);

    // 2. High-speed smooth physics loop (Updates cat positions & rubberbanding surges)
    physicsIntervalRef.current = setInterval(() => {
      setRemainingSeconds((curSec) => {
        const progress = Math.max(0, Math.min(1, 1 - (curSec / totalSeconds)));

        setPositions((prevPositions) => {
          const next = { ...prevPositions };

          // Every frame, apply dynamic surges & drift
          racers.forEach((r) => {
            // Random surge changes periodically
            if (Math.random() < 0.15) {
              driftSpeedRef.current[r.id] = (Math.random() - 0.48) * 8.5; // slight speed variation
            }

            const drift = driftSpeedRef.current[r.id] || 0;
            // Base position tied to time progress + individual cat drift
            let target = progress * 100 + drift;

            // Clamp so cats stay on screen and cross finish at 100%
            if (progress >= 0.98) {
              target = Math.max(target, 96 + Math.random() * 6);
            }
            target = Math.max(0, Math.min(102, target));

            next[r.id] = target;
          });

          // Determine current leader
          let maxPos = -1;
          let currentLead = null;
          Object.entries(next).forEach(([id, pos]) => {
            if (pos > maxPos) {
              maxPos = pos;
              currentLead = id;
            }
          });
          setLeaderId(currentLead);

          return next;
        });

        return curSec;
      });
    }, 120);

    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(physicsIntervalRef.current);
    };
  }, [isRunning, totalSeconds, racers, soundEnabled]);

  // Race Finish Ceremony
  const handleFinishRace = () => {
    clearInterval(timerIntervalRef.current);
    clearInterval(physicsIntervalRef.current);
    setIsRunning(false);
    setIsFinished(true);

    // Sort final rankings
    const sorted = [...racers].sort((a, b) => {
      const posA = (positions[a.id] || 0) + (driftSpeedRef.current[a.id] || 0);
      const posB = (positions[b.id] || 0) + (driftSpeedRef.current[b.id] || 0);
      return posB - posA;
    });

    const winningCat = sorted[0] || racers[0];
    setWinner(winningCat);
    setRankings(sorted);

    // Push all positions across finish line
    const finalPos = {};
    sorted.forEach((r, idx) => {
      finalPos[r.id] = 100 - idx * 4;
    });
    setPositions(finalPos);

    // Sounds & Celebration
    if (alarmBellEnabled) {
      sound.playAlarmBell();
    }
    sound.playFanfare();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
    });

    // Voice announcement in Vietnamese
    if (voiceAnnounceEnabled) {
      setTimeout(() => {
        speech.speakVietnamese(
          `Chúc mừng Mèo số ${winningCat.number}, ${winningCat.name} đã về đích đầu tiên và giành chiến thắng!`
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

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#222B38] select-none flex flex-col font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : 'min-h-[580px] sm:min-h-[660px]'
      }`}
    >
      {/* ==================================================================== */}
      {/* 1. TOP GRASSY RIVERBANK WITH RETRO CONTROLS & DIGITAL CLOCK           */}
      {/* (Exact match with Duck Race screenshot!)                             */}
      {/* ==================================================================== */}
      <div className="relative bg-[#3EA824] px-3 sm:px-6 py-2.5 sm:py-3 z-30 flex items-center justify-between shadow-md border-b-4 border-[#267316]">
        {/* Bush bumps & grass tufts along river edge */}
        <div className="absolute -bottom-3 left-0 right-0 h-4 flex overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-6 bg-[#328D1C] rounded-full -mb-3 flex-shrink-0"
              style={{ marginLeft: '-10px' }}
            />
          ))}
        </div>

        {/* LEFT CONTROLS: Square Black Buttons (⚙️, 🎵, 🔔) & Bubble Text Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 z-10">
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
              title="Cài đặt thời gian & số lượng mèo đua"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 2. Sound Effects Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-1.5 sm:p-2 bg-[#2D3748] hover:bg-[#4A5568] text-white rounded-lg transition"
              title={soundEnabled ? 'Tắt âm thanh bơi bì bõm' : 'Bật âm thanh bơi bì bõm'}
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
          </div>

          {/* Retro Bubble Text Buttons: "Pause / Start" and "Clear" matching screenshot */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="text-white hover:text-yellow-200 font-black text-xs sm:text-base tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] active:translate-y-0.5 transition uppercase"
            >
              {isRunning ? 'Pause' : isFinished ? 'Start' : 'Start'}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                handleResetRace();
              }}
              className="text-white hover:text-yellow-200 font-black text-xs sm:text-base tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] active:translate-y-0.5 transition uppercase"
            >
              Clear
            </button>
          </div>
        </div>

        {/* CENTER: THE ICONIC DIGITAL COUNTDOWN CLOCK BOX (Matching screenshot 00:00:39!) */}
        <div className="z-10 bg-[#F4F4FD] border-[3.5px] border-[#1A202C] rounded-2xl px-4 sm:px-8 py-1 sm:py-1.5 shadow-xl flex items-center justify-center">
          <span className="font-mono text-3xl sm:text-5xl font-black text-[#1A202C] tracking-widest drop-shadow-sm select-all">
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* RIGHT: BRAND TAG & FULLSCREEN (Matching Online-Stopwatch.com logo) */}
        <div className="flex items-center gap-2 z-10">
          <div className="hidden md:flex items-center gap-1 text-[11px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] bg-black/30 px-3 py-1 rounded-full border border-white/20">
            <span className="text-yellow-300">⬆️</span>
            <span>Online-Stopwatch · V English House</span>
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
      {/* 2. THE BLUE RIVER RACETRACK (Exact Duck Race wavy river & lanes)      */}
      {/* ==================================================================== */}
      <div className="relative flex-1 bg-[#2C82BC] overflow-hidden flex flex-col justify-around py-3 sm:py-5 min-h-[440px]">
        {/* Animated Horizontal Water Waves across the river */}
        <div className="absolute inset-0 opacity-40 pointer-events-none flex flex-col justify-around">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-8 border-b-2 border-[#80C9F7] opacity-60"
              style={{
                borderRadius: '50%',
                transform: `translateX(${i % 2 === 0 ? '-10px' : '10px'}) scaleY(0.7)`
              }}
            />
          ))}
        </div>

        {/* STARTING AREA (Left Side): Checkered Start Line & Bold Lane Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-20 pointer-events-none flex">
          {/* Vertical Checkered Ribbon matching screenshot */}
          <div className="w-5 sm:w-6 h-full flex flex-col border-r-2 border-[#1A202C] overflow-hidden shadow-lg">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full flex ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
              >
                <div className={`w-1/2 h-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* FINISH LINE (Right Side): Checkered Tape & Flag */}
        <div className="absolute right-6 sm:right-10 top-0 bottom-0 w-6 sm:w-8 z-20 pointer-events-none flex flex-col border-x-2 border-white/80 shadow-2xl overflow-hidden">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-full flex ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
            >
              <div className={`w-1/2 h-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
            </div>
          ))}
          {/* Finish Post Flag Banner */}
          <div className="absolute top-2 -right-3 bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded shadow">
            🏁 FINISH
          </div>
        </div>

        {/* RACING LANES (Each lane has its number painted on water + swimming cat) */}
        {racers.map((racer, index) => {
          const posPercent = positions[racer.id] || 0;
          // Scale position across the track: from 8% (start dock) to 84% (finish tape)
          const leftStyle = 8 + (posPercent / 100) * 76;
          const isLead = leaderId === racer.id;
          const isWin = winner?.id === racer.id;

          return (
            <div
              key={racer.id}
              className="relative h-18 sm:h-22 flex items-center px-2 z-10"
            >
              {/* BIG BOLD LANE NUMBER DRAWN ON WATER (Exact match with screenshot 1, 2, 3, 4!) */}
              <div className="absolute left-8 sm:left-10 z-10 pointer-events-none select-none">
                <span
                  className="font-black text-3xl sm:text-5xl text-[#1A202C] opacity-80"
                  style={{
                    fontFamily: 'Impact, Arial Black, Montserrat, sans-serif',
                    textShadow: '0 2px 4px rgba(255,255,255,0.4)'
                  }}
                >
                  {racer.number}
                </span>
              </div>

              {/* Gentle water ripples behind cat lane */}
              <div className="absolute left-14 right-14 top-1/2 -translate-y-1/2 border-b border-[#5DAFE5]/40 pointer-events-none" />

              {/* THE SWIMMING CAT ACTOR */}
              <div
                className="absolute transition-all duration-150 ease-out z-20 flex flex-col items-center"
                style={{
                  left: `${leftStyle}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {/* Cat Actor */}
                <SwimmingCat
                  racer={racer}
                  isRunning={isRunning}
                  isWinner={isWin}
                  isLeader={isLead}
                />

                {/* Optional Cat Name / House Tag below actor */}
                <span className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap -mt-1">
                  {racer.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 3. SETTINGS & CUSTOMIZATION MODAL (When teacher clicks ⚙️ Gear)       */}
      {/* ==================================================================== */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full text-[#1F2421] shadow-2xl border-4 border-[#FFC600] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#A67C1E]" />
                <h3 className="font-black text-base sm:text-lg">Cài Đặt Đua Mèo • Cat Race</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Quick Presets */}
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
            <form onSubmit={handleApplyCustomTime} className="space-y-2">
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
                  className="w-1/2 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-center outline-none focus:border-[#FFC600]"
                />
                <span className="font-black text-lg">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="39 Giây"
                  value={customSec}
                  onChange={(e) => setCustomSec(e.target.value)}
                  className="w-1/2 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-center outline-none focus:border-[#FFC600]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 transition flex-shrink-0"
                >
                  Áp Dụng
                </button>
              </div>
            </form>

            {/* 3. Choose Number of Lanes */}
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                🐱 Số Làn Đua Mèo (Mặc định 4 như ảnh mẫu):
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveLaneCount(num);
                    }}
                    className={`flex-1 py-2 rounded-xl font-black text-xs border transition ${
                      activeLaneCount === num
                        ? 'bg-[#1F2421] text-white border-black shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {num} Làn
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Audio Toggles */}
            <div className="pt-2 border-t border-stone-200 space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
                <span className="font-bold text-stone-700">Âm thanh bơi nước bì bõm & còi xuất phát:</span>
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

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer">
                <span className="font-bold text-stone-700">Giọng đọc tiếng Việt xướng tên mèo thắng cuộc:</span>
                <input
                  type="checkbox"
                  checked={voiceAnnounceEnabled}
                  onChange={(e) => setVoiceAnnounceEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
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
            {/* Gold Trophy with Bouncing Winner Cat */}
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
              Đã bơi qua vạch đích đầu tiên khi đồng hồ điểm 00:00:00!
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
                  speech.speakVietnamese(`Chúc mừng Mèo số ${winner.number}, ${winner.name} đã về đích đầu tiên!`)
                }
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#A67C1E]" />
                <span>Nghe Lại</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetRace()}
                className="flex-2 py-3 bg-[#FFC600] hover:brightness-105 text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chạy Lại Cuộc Đua Mới</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
