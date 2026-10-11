import React, { useState, useEffect, useRef } from 'react';
import {
  Settings, Music, Bell, Play, Pause, RotateCcw, Volume2, VolumeX,
  Maximize2, Minimize2, Trophy, Sparkles, Flag, Plus, Minus, Trash2,
  Check, X, Users, RefreshCw, FileText, ArrowRight
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

// Sample class rosters for 1-click loading
const SAMPLE_ROSTERS = {
  kids: [
    'Bảo An', 'Gia Huy', 'Minh Khôi', 'Khánh Linh', 'Tuấn Kiệt',
    'Bảo Châu', 'Đức Anh', 'Hương Giang', 'Minh Quân', 'Trúc Anh'
  ],
  teens: [
    'Hoàng Long', 'Phương Thảo', 'Quốc Bảo', 'Thùy Chi', 'Minh Trí',
    'Bảo Ngọc', 'Quang Hải', 'Thanh Hằng', 'Tuấn Tú', 'Kim Ngân',
    'Tiến Đạt', 'Yến Nhi', 'Đăng Khoa', 'Khánh Vy', 'Thái An', 'Gia Bảo'
  ],
  large: [
    'An', 'Bảo', 'Chi', 'Dũng', 'Emily', 'Hải', 'Linh', 'Minh',
    'Nam', 'Phương', 'Quân', 'Sơn', 'Trang', 'Vũ', 'Khoa', 'Thịnh',
    'Kiên', 'Hà', 'Vy', 'Nhi', 'Huy', 'Tùng', 'Đức', 'Lâm'
  ]
};

// ============================================================================
// SVG ATHLETIC RUNNING CAT (Galloping on the Track with Dust Puffs & Number Bib)
// ============================================================================
function RunningCat({ racer, isRunning, isWinner, isLeader }) {
  const handleCatClick = () => {
    const variants = ['excited', 'kitten', 'default', 'deep'];
    sound.playMeow(variants[(racer.number - 1) % 4]);
  };

  return (
    <div
      onClick={handleCatClick}
      className="relative flex items-center justify-center select-none cursor-pointer group active:scale-95 transition-transform"
      title={`Nhấn vào ${racer.name} để nghe tiếng mèo kêu!`}
    >
      {/* 1. Dust Puffs kicking up behind rear paws when sprinting on track */}
      {isRunning && (
        <div className="absolute -left-7 bottom-2.5 flex gap-1 pointer-events-none select-none z-10">
          <span className="text-sm inline-block animate-[dustPuff_0.32s_ease-out_infinite]">💨</span>
          <span className="text-xs inline-block animate-[dustPuff_0.4s_ease-out_infinite_0.08s]">💨</span>
          <span className="text-sm inline-block animate-[dustPuff_0.36s_ease-out_infinite_0.16s]">💨</span>
        </div>
      )}

      {/* 2. Leading Star / Crown if leading the pack */}
      {isLeader && isRunning && (
        <div className="absolute -top-4 right-6 z-30 animate-bounce text-xs font-black drop-shadow">
          ⭐
        </div>
      )}

      {/* 3. The Running Cat Actor SVG */}
      <svg
        viewBox="0 0 120 86"
        className={`w-24 h-16 sm:w-28 sm:h-20 drop-shadow-md transition-transform ${
          isWinner ? 'scale-115 drop-shadow-2xl' : ''
        }`}
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

  // Audio & Display Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmBellEnabled, setAlarmBellEnabled] = useState(true);
  const [voiceAnnounceEnabled, setVoiceAnnounceEnabled] = useState(true);
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
    setIsRunning(false);
    setIsFinished(false);
    setWinner(null);
    setRankings([]);
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
          freq1: 1, freq2: 2, phase1: 0, phase2: 0, amplitude: 5, sprintPower: 5
        };

        const wave1 = Math.sin(elapsedSec * pers.freq1 + pers.phase1);
        const wave2 = Math.sin(elapsedSec * pers.freq2 + pers.phase2);
        const surge = (wave1 * 0.65 + wave2 * 0.35) * pers.amplitude;

        // Final sprint amplification in the last 15% of the countdown
        let sprint = 0;
        if (progress > 0.85) {
          const sprintRatio = (progress - 0.85) / 0.15;
          sprint = pers.sprintPower * sprintRatio;
        }

        let p = progress * 100 + surge + sprint;
        if (progress >= 0.99) {
          p = Math.max(98, p);
        }
        p = Math.max(0, Math.min(104, p));

        nextPos[r.id] = p;

        if (p > maxP) {
          maxP = p;
          leadId = r.id;
        }
      });

      setPositions(nextPos);
      setLeaderId(leadId);

      // Finish check when countdown reaches 0 / progress reaches 100%
      if (progress >= 1.0) {
        handleFinishRace(nextPos);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, totalSeconds, racers, soundEnabled]);

  // Race Finish Ceremony
  const handleFinishRace = (finalSnapshotPositions = positions) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sound.stopRaceMusic();
    setIsRunning(false);
    setIsFinished(true);
    setRemainingSeconds(0);

    // Sort final rankings from finish line positions
    const sorted = [...racers].sort((a, b) => {
      const posA = finalSnapshotPositions[a.id] || 0;
      const posB = finalSnapshotPositions[b.id] || 0;
      return posB - posA;
    });

    const winningCat = sorted[0] || racers[0];
    setWinner(winningCat);
    setRankings(sorted);

    // Push all positions across finish line
    const finalPos = {};
    sorted.forEach((r, idx) => {
      finalPos[r.id] = 100 - idx * 3.5;
    });
    setPositions(finalPos);

    if (alarmBellEnabled) {
      sound.playAlarmBell();
    }
    sound.playVictoryMeow();
    sound.playFanfare();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
    });

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
        {/* Stadium turf border trim */}
        <div className="absolute -bottom-3 left-0 right-0 h-4 flex overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-6 bg-[#328D1C] rounded-full -mb-3 flex-shrink-0"
              style={{ marginLeft: '-10px' }}
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

      {/* TOP LIVE LEADERBOARD TICKER */}
      <div className="bg-[#1F2421] text-white text-[11px] font-bold px-4 py-1 flex items-center justify-between border-b border-white/10 z-20">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-yellow-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1 flex-shrink-0">
            🏆 TOP DẪN ĐẦU:
          </span>
          {liveLeaders.map((r, i) => (
            <span key={r.id} className="whitespace-nowrap flex items-center gap-1 opacity-90 text-[11px]">
              <span className="text-xs">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <span className={i === 0 ? 'text-yellow-300 font-black' : ''}>{r.name}</span>
              {i < liveLeaders.length - 1 && <span className="text-stone-500 mx-1">•</span>}
            </span>
          ))}
        </div>
        <span className="text-stone-400 text-[10px] hidden md:inline font-mono">
          Đường Chạy Điền Kinh V English House
        </span>
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

        {/* FINISH LINE (Right Side): Checkered Tape & Flag */}
        <div className="absolute right-6 sm:right-10 top-0 bottom-0 w-6 sm:w-8 z-20 pointer-events-none flex flex-col border-x-2 border-white/80 shadow-2xl overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-full flex ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
            >
              <div className={`w-1/2 h-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
            </div>
          ))}
          <div className="absolute top-2 -right-3 bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded shadow">
            🏁 FINISH
          </div>
        </div>

        {/* ALL RACING LANES (Unlimited: Each lane has its bold painted number + running cat actor) */}
        {racers.map((racer) => {
          const posPercent = positions[racer.id] || 0;
          const leftStyle = 8 + (posPercent / 100) * 76;
          const isLead = leaderId === racer.id;
          const isWin = winner?.id === racer.id;

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
                <RunningCat
                  racer={racer}
                  isRunning={isRunning}
                  isWinner={isWin}
                  isLeader={isLead}
                />

                {/* Name / Jersey Tag below Cat */}
                <span className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap -mt-1 border border-white/10">
                  {racer.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 3. SETTINGS & UNLIMITED ROSTER MODAL (When teacher clicks ⚙️ Gear)     */}
      {/* ==================================================================== */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full text-[#1F2421] shadow-2xl border-4 border-[#FFC600] space-y-4 max-h-[92vh] overflow-y-auto">
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
                  🐱 Số Lượng Mèo Đua (Không Giới Hạn): <span className="text-emerald-700 font-extrabold">{racers.length} Mèo</span>
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

            {/* 4. Import Student Roster (Dán danh sách học sinh) */}
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <label className="text-xs font-black uppercase text-stone-700 block">
                🎓 Dán Danh Sách Tên Học Sinh (Mỗi học sinh 1 con mèo):
              </label>

              {/* Sample Class Roster Quick Load Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-[11px] font-bold text-stone-400 self-center">Mẫu lớp:</span>
                <button
                  type="button"
                  onClick={() => handleImportRoster(SAMPLE_ROSTERS.kids.join('\n'))}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] rounded-lg transition"
                >
                  🎒 Lớp Kids (10 bé)
                </button>
                <button
                  type="button"
                  onClick={() => handleImportRoster(SAMPLE_ROSTERS.teens.join('\n'))}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-[11px] rounded-lg transition"
                >
                  🏫 Lớp Teens (16 em)
                </button>
                <button
                  type="button"
                  onClick={() => handleImportRoster(SAMPLE_ROSTERS.large.join('\n'))}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[11px] rounded-lg transition"
                >
                  👥 Cả Lớp 24 Học Sinh
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Dán danh sách tên học sinh vào đây (mỗi dòng 1 tên)...&#10;Ví dụ:&#10;Bảo An&#10;Gia Huy&#10;Minh Khôi"
                value={rosterInput}
                onChange={(e) => setRosterInput(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono outline-none focus:border-[#FFC600] resize-none"
              />

              {rosterInput.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => handleImportRoster(rosterInput)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Áp Dụng Danh Sách ({rosterInput.split('\n').filter((l) => l.trim()).length} Học Sinh)</span>
                </button>
              )}
            </div>

            {/* 5. Audio Settings */}
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
              Đã chạy băng qua vạch đích đầu tiên khi đồng hồ điểm 00:00:00!
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
