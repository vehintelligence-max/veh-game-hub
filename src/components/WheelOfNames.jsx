import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Users, RotateCw, Plus, Trash2, Shuffle, Check, Volume2, Gift, Bell } from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

const DEFAULT_ROSTERS = {
  A01: ['Tuấn Minh', 'Gia Bảo', 'Quỳnh Chi', 'Hoàng An', 'Tiến Dũng', 'Bảo Ngọc', 'Phương Linh', 'Minh Khang'],
  B02: ['Quốc Bảo', 'Tuệ Minh', 'Phương Vy', 'Trọng Nhân', 'Gia Thịnh', 'Tô Châu', 'Nguyên Danh', 'Ánh Nhã'],
  IELTS: ['Hoàng Phúc', 'Thu Trang', 'Anh Tuấn', 'Tường Vy', 'Khánh Linh', 'Đức Hải', 'Thảo Nhi', 'Hải Yến'],
};

// Classic Rainbow Wheel Palette
const WHEEL_COLORS = [
  '#FFC600', '#FF4B4B', '#1CB0F6', '#58CC02',
  '#9333EA', '#F97316', '#06B6D4', '#EC4899',
  '#EAB308', '#84CC16', '#10B981', '#6366F1',
];

// Festive Christmas Wheel Palette (Santa Red, Pine Tree Green, Snow Cyan, Star Gold, Cranberry, Mint)
const CHRISTMAS_WHEEL_COLORS = [
  '#DC2626', // Santa Crimson Red
  '#15803D', // Pine Forest Green
  '#0284C7', // Frost Glacier Cyan
  '#EAB308', // Warm Star Gold
  '#B91C1C', // Cranberry Deep Red
  '#166534', // Holly Deep Green
  '#38BDF8', // Snowy Ice Blue
  '#F59E0B', // Golden Bell Amber
  '#BE123C', // Poinsettia Rose
  '#059669', // Winter Mint Green
];

const CLASSIC_ANNOUNCEMENT_TEMPLATES = [
  { id: 'congrats', pattern: 'Congratulations {name}! You have been chosen!', label: '🎉 Congratulations {name}!' },
  { id: 'your_turn', pattern: 'Please welcome {name}! It is your turn to speak!', label: '🎤 Please welcome {name}!' },
  { id: 'lucky_one', pattern: 'The lucky winner today is {name}! Let us give them a big round of applause!', label: '🌟 The lucky winner is {name}!' },
  { id: 'next_question', pattern: 'Get ready {name}! Here comes your challenge question!', label: '⚡ Get ready {name}!' },
  { id: 'wheel_stopped', pattern: 'The wheel has stopped on {name}! Welcome to the stage!', label: '🎡 The wheel stopped on {name}!' },
];

const CHRISTMAS_ANNOUNCEMENT_TEMPLATES = [
  { id: 'xmas_santa_gift', pattern: 'Ho ho ho! Merry Christmas {name}! Santa has a special gift for you!', label: '🎅 Ho ho ho! Merry Christmas {name}!' },
  { id: 'xmas_winner', pattern: 'Congratulations {name}! You are our Christmas Lucky Star winner today!', label: '🎁 Congratulations {name}! Christmas Lucky Star!' },
  { id: 'xmas_magic', pattern: 'Santa Claus has called {name}! Time to unwrap your holiday surprise!', label: '🎄 Santa has called {name}!' },
  { id: 'xmas_reindeer', pattern: 'Rudolph and the reindeer have picked {name}! Come claim your holiday prize!', label: '🦌 Rudolph and Santa picked {name}!' },
  { id: 'xmas_jingle', pattern: 'Jingle bells, jingle bells! Step right up {name}, holiday fortune is yours!', label: '🔔 Jingle bells! Step right up {name}!' },
];

export default function WheelOfNames() {
  // Theme: 'christmas' (Vòng quay Giáng Sinh Noel) | 'classic' (Vòng quay truyền thống)
  const [wheelTheme, setWheelTheme] = useState('christmas');
  const [names, setNames] = useState(DEFAULT_ROSTERS.A01);
  const [selectedClass, setSelectedClass] = useState('A01');
  const [newName, setNewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('xmas_santa_gift');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinSpeedRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTickSegmentRef = useRef(-1);

  // Redraw Wheel whenever names or theme changes
  useEffect(() => {
    drawWheel();
  }, [names, wheelTheme]);

  const handleChangeTheme = (theme) => {
    if (theme === wheelTheme) return;
    setWheelTheme(theme);
    if (theme === 'christmas') {
      sound.playJingleBells();
      setSelectedTemplateId('xmas_santa_gift');
    } else {
      sound.playClick();
      setSelectedTemplateId('congrats');
    }
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 22;

    ctx.clearRect(0, 0, width, height);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = wheelTheme === 'christmas' ? '#1E293B' : '#E5E7EB';
      ctx.fill();
      ctx.fillStyle = wheelTheme === 'christmas' ? '#F8FAFC' : '#1F2421';
      ctx.font = 'bold 16px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Thêm tên học viên để quay', centerX, centerY);
      return;
    }

    const arc = (Math.PI * 2) / names.length;
    const colors = wheelTheme === 'christmas' ? CHRISTMAS_WHEEL_COLORS : WHEEL_COLORS;

    // Draw slices
    names.forEach((name, i) => {
      const angle = currentAngleRef.current + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Slice borders: Snowy gold or clean white
      ctx.strokeStyle = wheelTheme === 'christmas' ? '#FEF08A' : '#FFFFFF';
      ctx.lineWidth = wheelTheme === 'christmas' ? 3.5 : 3;
      ctx.stroke();

      // Draw Name Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = wheelTheme === 'christmas' ? '#FFFFFF' : '#1F2421';
      ctx.font = 'bold 15px Montserrat, sans-serif';
      if (wheelTheme === 'christmas') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      ctx.fillText(name, radius - 25, 5);
      ctx.restore();
    });

    // Draw Outer Rim with Christmas Dots / Fairy Lights
    if (wheelTheme === 'christmas') {
      const numDots = Math.max(names.length * 2, 24);
      for (let d = 0; d < numDots; d++) {
        const dotAngle = currentAngleRef.current + (d * (Math.PI * 2)) / numDots;
        const dotX = centerX + (radius + 8) * Math.cos(dotAngle);
        const dotY = centerY + (radius + 8) * Math.sin(dotAngle);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = d % 3 === 0 ? '#EF4444' : d % 3 === 1 ? '#22C55E' : '#FBBF24';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Draw Center Circle Hub
    if (wheelTheme === 'christmas') {
      // Christmas Velvet Red & Gold Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#991B1B';
      ctx.fill();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner Gold Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 14px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎄 VEH', centerX, centerY - 6);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Montserrat, sans-serif';
      ctx.fillText('NOEL', centerX, centerY + 10);
    } else {
      // Classic Dark Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#1F2421';
      ctx.fill();
      ctx.strokeStyle = '#FFC600';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#FFC600';
      ctx.font = 'bold 18px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VEH', centerX, centerY);
    }
  };

  const getAnnouncementTemplates = () => {
    return wheelTheme === 'christmas'
      ? [...CHRISTMAS_ANNOUNCEMENT_TEMPLATES, ...CLASSIC_ANNOUNCEMENT_TEMPLATES]
      : CLASSIC_ANNOUNCEMENT_TEMPLATES;
  };

  const speakWinnerInEnglish = (winnerName) => {
    if (!winnerName) return;
    const templates = getAnnouncementTemplates();
    const tpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];
    const sentence = tpl.pattern.replace('{name}', winnerName);
    speech.speakEnglish(sentence);
  };

  const spin = () => {
    if (isSpinning || names.length === 0) return;

    if (wheelTheme === 'christmas') {
      sound.playSleighBells();
    } else {
      sound.playClick();
    }

    setIsSpinning(true);
    setWinner(null);

    // Initial random angular velocity
    spinSpeedRef.current = 0.35 + Math.random() * 0.25;
    lastTickSegmentRef.current = -1;

    const animate = () => {
      currentAngleRef.current += spinSpeedRef.current;
      spinSpeedRef.current *= 0.985; // friction

      // Sound tick when passing each segment
      const arc = (Math.PI * 2) / names.length;
      const normalizedAngle = (Math.PI * 2 - (currentAngleRef.current % (Math.PI * 2))) % (Math.PI * 2);
      const currentSegment = Math.floor(normalizedAngle / arc);

      if (currentSegment !== lastTickSegmentRef.current) {
        if (wheelTheme === 'christmas') {
          sound.playChristmasTick();
        } else {
          sound.playTick();
        }
        lastTickSegmentRef.current = currentSegment;
      }

      drawWheel();

      if (spinSpeedRef.current > 0.002) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Stop and declare winner
        setIsSpinning(false);
        const winningIndex = currentSegment % names.length;
        const selectedWinner = names[winningIndex];
        setWinner(selectedWinner);

        if (wheelTheme === 'christmas') {
          sound.playJingleBells();
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.55 },
            colors: ['#DC2626', '#16A34A', '#FACC15', '#FFFFFF', '#38BDF8'],
          });
        } else {
          sound.playFanfare();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        }

        // Speak winner in authentic natural English voice
        if (voiceEnabled) {
          setTimeout(() => {
            speakWinnerInEnglish(selectedWinner);
          }, 450);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleAddName = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sound.playClick();
    setNames([...names, newName.trim()]);
    setNewName('');
  };

  const handleRemoveName = (index) => {
    sound.playClick();
    setNames(names.filter((_, i) => i !== index));
  };

  const handleRemoveWinner = () => {
    if (!winner) return;
    setNames(names.filter((n) => n !== winner));
    setWinner(null);
  };

  const handleSelectPreset = (clsKey) => {
    sound.playClick();
    setSelectedClass(clsKey);
    setNames(DEFAULT_ROSTERS[clsKey] || []);
  };

  const handleShuffle = () => {
    if (wheelTheme === 'christmas') {
      sound.playSleighBells();
    } else {
      sound.playClick();
    }
    setNames([...names].sort(() => Math.random() - 0.5));
  };

  return (
    <div
      className={`min-h-[85vh] py-6 px-3 sm:px-6 transition-colors duration-500 relative select-none ${
        wheelTheme === 'christmas'
          ? 'bg-gradient-to-b from-[#061426] via-[#0A223E] to-[#04101D] text-white'
          : 'bg-[#FAF8F3] text-[#1F2421]'
      }`}
    >
      {/* Falling Snowflakes Overlay in Christmas Mode */}
      {wheelTheme === 'christmas' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white select-none animate-[snowFall_6s_linear_infinite]"
              style={{
                left: `${(i * 3.1) % 100}%`,
                top: `-${(i * 15) % 50}px`,
                fontSize: `${10 + (i % 5) * 3.5}px`,
                animationDuration: `${3.6 + (i % 6) * 1.1}s`,
                animationDelay: `${(i * 0.22) % 4}s`,
                opacity: 0.35 + (i % 4) * 0.18,
                textShadow: '0 0 6px rgba(255,255,255,0.8)'
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Top Stadium / Roof Trim Fairy Lights in Christmas Mode */}
      {wheelTheme === 'christmas' && (
        <div className="relative max-w-5xl mx-auto flex justify-around pointer-events-none z-10 -mt-2 mb-3 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ['#EF4444', '#FBBF24', '#22C55E', '#38BDF8', '#EC4899', '#A855F7'];
            const col = colors[i % colors.length];
            return (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <div className="w-0.5 h-2 bg-stone-700/80" />
                <div
                  className="w-2.5 h-3.5 rounded-full shadow-md animate-[fairyLightBlink_1.2s_ease-in-out_infinite]"
                  style={{
                    backgroundColor: col,
                    boxShadow: `0 0 8px ${col}`,
                    animationDelay: `${(i * 0.12) % 1.2}s`
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Header Banner & Theme Toggle */}
        <div className="text-center mb-6">
          {/* Dual Theme Switcher: [🎄 VÒNG QUAY GIÁNG SINH] | [🎡 VÒNG QUAY CỔ ĐIỂN] */}
          <div className="flex items-center justify-center gap-2 mb-3.5">
            <div className="inline-flex items-center bg-[#1A202C] p-1 rounded-2xl border-2 border-black/30 shadow-lg">
              <button
                type="button"
                onClick={() => handleChangeTheme('christmas')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                  wheelTheme === 'christmas'
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 text-white shadow ring-2 ring-yellow-300'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Bật giao diện Vòng Quay Giáng Sinh Noel"
              >
                <span>🎄</span>
                <span>Vòng Quay Giáng Sinh</span>
              </button>
              <button
                type="button"
                onClick={() => handleChangeTheme('classic')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                  wheelTheme === 'classic'
                    ? 'bg-[#FFC600] text-[#1F2421] shadow ring-2 ring-yellow-400'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Chuyển về giao diện Vòng Quay Cổ Điển"
              >
                <span>🎡</span>
                <span>Vòng Quay Cổ Điển</span>
              </button>
            </div>
          </div>

          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${
              wheelTheme === 'christmas'
                ? 'text-yellow-300 bg-red-950/80 border-red-500/60 shadow-sm'
                : 'text-[#A67C1E] bg-[#FFC600]/20 border-[#FFC600]/40'
            }`}
          >
            {wheelTheme === 'christmas' ? '🎅 MÙA LỄ HỘI GIÁNG SINH · CHRISTMAS LUCKY WHEEL' : 'V ENGLISH HOUSE · FUNNY CLASSROOM TOOLS'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black mt-1.5 font-brand flex items-center justify-center gap-2">
            <span>{wheelTheme === 'christmas' ? '🎄 VÒNG QUAY MAY MẮN GIÁNG SINH 🎁' : '🎡 VÒNG QUAY GỌI TÊN HỌC VIÊN'}</span>
          </h2>

          <p className={`text-xs sm:text-sm mt-1 font-medium ${wheelTheme === 'christmas' ? 'text-cyan-100/90' : 'text-stone-600'}`}>
            {wheelTheme === 'christmas'
              ? 'Gọi tên học sinh nhận quà Noel, hái sao may mắn hoặc trả lời câu đố vui Giáng Sinh!'
              : 'Dành cho giáo viên gọi học sinh phát biểu, kiểm tra bài cũ hoặc chia quà may mắn (Giọng đọc chuẩn Tiếng Việt)'}
          </p>

          {/* Vietnamese Voice Announcement Controls */}
          <div
            className={`mt-4 p-3 rounded-2xl shadow-sm max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs border ${
              wheelTheme === 'christmas'
                ? 'bg-[#0B1E34]/90 border-red-500/40 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                : 'bg-white border-stone-200/90 text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Volume2 className={`w-4 h-4 ${wheelTheme === 'christmas' ? 'text-yellow-400' : 'text-[#A67C1E]'}`} />
              <span className="font-black">English Voice (Natural TTS):</span>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                  voiceEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-stone-500/20 text-stone-400 border-stone-500/30'
                }`}
              >
                {voiceEnabled ? '✅ ON' : '🔇 OFF'}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-bold ${wheelTheme === 'christmas' ? 'text-stone-300' : 'text-stone-500'}`}>
                Announcement line:
              </span>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  const templates = getAnnouncementTemplates();
                  const tpl = templates.find((t) => t.id === e.target.value);
                  if (tpl) {
                    speech.speakEnglish(tpl.pattern.replace('{name}', names[0] || 'David'));
                  }
                }}
                className={`text-xs font-bold rounded-xl px-2.5 py-1 outline-none border ${
                  wheelTheme === 'christmas'
                    ? 'bg-[#132A45] text-yellow-200 border-red-400/40 focus:border-yellow-400'
                    : 'bg-stone-50 text-stone-800 border-stone-200 focus:border-[#FFC600]'
                }`}
              >
                {getAnnouncementTemplates().map((t) => (
                  <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                    {t.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const templates = getAnnouncementTemplates();
                  const tpl = templates.find((t) => t.id === selectedTemplateId);
                  speech.speakEnglish(tpl ? tpl.pattern.replace('{name}', names[0] || 'David') : 'Congratulations David!');
                }}
                className={`px-2.5 py-1 font-bold rounded-lg border transition ${
                  wheelTheme === 'christmas'
                    ? 'bg-red-700 hover:bg-red-600 text-yellow-200 border-red-500/60'
                    : 'bg-stone-100 hover:bg-stone-200 text-[#1F2421] border-stone-200'
                }`}
                title="Listen to natural English voice sample"
              >
                🔊 Test Voice
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Main Section: Wheel (Left) & Student List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: The Spinning Wheel */}
          <div
            className={`lg:col-span-7 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden border-2 ${
              wheelTheme === 'christmas'
                ? 'bg-[#0B1E34]/95 border-red-500/40 shadow-[0_0_35px_rgba(220,38,38,0.25)]'
                : 'bg-white border-stone-200/90 shadow-sm'
            }`}
          >
            {/* Top Indicator Arrow / Needle */}
            <div className="relative z-15 -mb-6 flex flex-col items-center drop-shadow-lg">
              {wheelTheme === 'christmas' ? (
                /* Christmas Santa Hat with Golden Needle Arrow */
                <div className="relative flex flex-col items-center">
                  <span className="text-3xl select-none -mb-1 animate-bounce">🎅</span>
                  <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[28px] border-t-[#DC2626] filter drop-shadow" />
                  <div className="absolute top-[30px] w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-md" />
                </div>
              ) : (
                /* Classic Yellow Pointer Triangle */
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#FFC600] drop-shadow-md" />
              )}
            </div>

            {/* Canvas Wheel with Circular Glow */}
            <div className="relative p-2 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={440}
                height={440}
                className="max-w-full h-auto drop-shadow-2xl rounded-full"
              />
            </div>

            {/* Spin & Shuffle Controls */}
            <div className="mt-6 flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={spin}
                disabled={isSpinning || names.length === 0}
                className={`px-8 sm:px-12 py-4 rounded-2xl font-black text-base sm:text-lg transition transform active:scale-95 flex items-center gap-2.5 shadow-xl ${
                  isSpinning
                    ? 'bg-stone-600 text-stone-300 cursor-wait'
                    : wheelTheme === 'christmas'
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:brightness-110 text-yellow-200 border-2 border-yellow-300 shadow-[0_0_25px_rgba(220,38,38,0.5)]'
                    : 'bg-[#FFC600] hover:brightness-105 text-[#1F2421] shadow-duo-yellow'
                }`}
              >
                <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>
                  {isSpinning
                    ? wheelTheme === 'christmas'
                      ? '🎁 ĐANG MỞ QUÀ...'
                      : 'ĐANG QUAY...'
                    : wheelTheme === 'christmas'
                    ? '🎅 QUAY NHẬN QUÀ NOEL!'
                    : 'QUAY NGAY!'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                disabled={isSpinning}
                className={`p-4 rounded-2xl border transition shadow-md ${
                  wheelTheme === 'christmas'
                    ? 'bg-[#132A45] hover:bg-[#1A385E] text-yellow-300 border-white/20'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                }`}
                title="Xáo trộn vị trí các ô học sinh"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Class Rosters & Student List Management */}
          <div
            className={`lg:col-span-5 rounded-3xl p-5 shadow-xl space-y-4 border ${
              wheelTheme === 'christmas'
                ? 'bg-[#0B1E34]/95 border-emerald-600/40 shadow-[0_0_30px_rgba(5,150,105,0.2)]'
                : 'bg-white border-stone-200/90 shadow-sm'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${wheelTheme === 'christmas' ? 'border-white/10' : 'border-stone-100'}`}>
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${wheelTheme === 'christmas' ? 'text-yellow-400' : 'text-[#A67C1E]'}`} />
                <h3 className="text-sm font-black">
                  {wheelTheme === 'christmas' ? '🎁 Danh Sách Nhận Quà' : 'Danh Sách Học Viên'} ({names.length})
                </h3>
              </div>
            </div>

            {/* Preset Buttons for Classes */}
            <div>
              <label className={`block text-[11px] font-bold uppercase mb-1.5 ${wheelTheme === 'christmas' ? 'text-stone-300' : 'text-stone-500'}`}>
                {wheelTheme === 'christmas' ? '🎄 Chọn lớp học nhận quà:' : 'Chọn danh sách lớp học có sẵn:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'A01', label: wheelTheme === 'christmas' ? '🎅 Lớp A01' : 'Lớp A01' },
                  { key: 'B02', label: wheelTheme === 'christmas' ? '🦌 Lớp B02' : 'Lớp B02' },
                  { key: 'IELTS', label: wheelTheme === 'christmas' ? '🎄 Lớp IELTS' : 'Lớp IELTS' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectPreset(item.key)}
                    className={`py-2 rounded-xl text-xs font-black transition border ${
                      selectedClass === item.key
                        ? wheelTheme === 'christmas'
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-yellow-300 shadow ring-2 ring-yellow-400/50'
                          : 'bg-[#FFC600] text-[#1F2421] border-[#FFC600] shadow-sm'
                        : wheelTheme === 'christmas'
                        ? 'bg-[#132A45] text-stone-200 border-white/15 hover:bg-[#1C3D65]'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Name Input */}
            <form onSubmit={handleAddName} className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={wheelTheme === 'christmas' ? 'Nhập thêm tên bé ngoan...' : 'Nhập thêm tên học viên...'}
                className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none border ${
                  wheelTheme === 'christmas'
                    ? 'bg-[#132A45] text-white border-white/20 focus:border-yellow-400 placeholder:text-stone-400'
                    : 'bg-stone-50 text-[#1F2421] border-stone-300 focus:bg-white focus:border-[#FFC600]'
                }`}
              />
              <button
                type="submit"
                className={`px-4 py-2.5 font-black text-xs rounded-xl transition flex items-center gap-1 flex-shrink-0 shadow ${
                  wheelTheme === 'christmas'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white ring-1 ring-emerald-300'
                    : 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow hover:brightness-105'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Thêm</span>
              </button>
            </form>

            {/* Student Chips List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {names.map((name, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs group transition ${
                    wheelTheme === 'christmas'
                      ? 'bg-[#132A45]/80 hover:bg-[#1A385E] border-white/10 text-white'
                      : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-[#1F2421]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md font-black flex items-center justify-center text-[10px] ${
                        wheelTheme === 'christmas'
                          ? idx % 2 === 0
                            ? 'bg-red-700 text-white'
                            : 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-[#1F2421]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold">{name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => speech.speakEnglish(`Please welcome, ${name}!`)}
                      className={`p-1 rounded-lg transition ${
                        wheelTheme === 'christmas' ? 'text-yellow-400 hover:text-yellow-200' : 'text-stone-400 hover:text-[#A67C1E]'
                      }`}
                      title="Listen to English voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveName(idx)}
                      className="p-1 text-stone-400 hover:text-rose-400 rounded-lg transition"
                      title="Xóa tên khỏi vòng quay"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Celebration Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className={`rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative border-4 ${
              wheelTheme === 'christmas'
                ? 'bg-[#0B1E34] border-yellow-400 text-white shadow-[0_0_60px_rgba(250,204,21,0.45)]'
                : 'bg-white border-[#FFC600] text-[#1F2421]'
            }`}
          >
            {/* Top Holiday Icon */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-xl animate-bounce ${
                wheelTheme === 'christmas'
                  ? 'bg-gradient-to-tr from-red-600 to-rose-600 text-yellow-200 ring-4 ring-yellow-400/80 shadow-[0_0_25px_rgba(239,68,68,0.6)]'
                  : 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow'
              }`}
            >
              {wheelTheme === 'christmas' ? '🎁' : '🎉'}
            </div>

            <span
              className={`text-[11px] font-black uppercase tracking-widest ${
                wheelTheme === 'christmas' ? 'text-yellow-400' : 'text-[#A67C1E]'
              }`}
            >
              {wheelTheme === 'christmas' ? '🎄 MERRY CHRISTMAS • QUÀ TẶNG NOEL 🎁' : 'CHÚC MỪNG BẠN'}
            </span>

            <h3
              className={`text-3xl font-black mt-1 font-brand ${
                wheelTheme === 'christmas'
                  ? 'text-yellow-300 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]'
                  : 'text-[#1F2421]'
              }`}
            >
              {winner}
            </h3>

            <p className={`text-xs mt-2 font-medium ${wheelTheme === 'christmas' ? 'text-cyan-100' : 'text-stone-600'}`}>
              {wheelTheme === 'christmas'
                ? 'Đã may mắn được ông già Noel gọi tên nhận quà và mở câu đố bí mật!'
                : 'Đã được chọn tham gia trả lời câu hỏi tiếp theo!'}
            </p>

            {/* Replay English Voice Button */}
            <div className="mt-4 flex flex-col gap-2 items-center justify-center">
              <button
                type="button"
                onClick={() => speakWinnerInEnglish(winner)}
                className={`px-4 py-2 font-bold text-xs rounded-xl border transition flex items-center gap-1.5 shadow-sm ${
                  wheelTheme === 'christmas'
                    ? 'bg-[#132A45] hover:bg-[#1A385E] text-yellow-200 border-white/20'
                    : 'bg-stone-100 hover:bg-stone-200 text-[#1F2421] border-stone-200'
                }`}
                title="Replay natural English announcement"
              >
                <Volume2 className={`w-4 h-4 ${wheelTheme === 'christmas' ? 'text-yellow-400' : 'text-[#A67C1E]'}`} />
                <span>🔊 Replay Announcement (English)</span>
              </button>

              {wheelTheme === 'christmas' && (
                <button
                  type="button"
                  onClick={() => sound.playJingleBells()}
                  className="px-4 py-1.5 bg-red-700/80 hover:bg-red-600 text-yellow-300 font-bold text-xs rounded-xl border border-yellow-400/50 transition flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                  <span>🔔 Rung Chuông Jingle Bells</span>
                </button>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => setWinner(null)}
                className={`w-full py-3.5 font-black text-xs rounded-xl transition ${
                  wheelTheme === 'christmas'
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 text-white ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:brightness-110'
                    : 'bg-[#FFC600] hover:brightness-105 text-[#1F2421] shadow-duo-yellow'
                }`}
              >
                {wheelTheme === 'christmas' ? '🎁 Tiếp Tục Mở Quà Noel' : 'Tiếp Tục Trò Chơi'}
              </button>

              <button
                type="button"
                onClick={handleRemoveWinner}
                className={`w-full py-2.5 font-bold text-xs rounded-xl border transition ${
                  wheelTheme === 'christmas'
                    ? 'bg-[#132A45] hover:bg-[#1A385E] text-stone-300 border-white/20'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                Tạm thời loại bạn này để quay bạn khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
