import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Users, RotateCw, Plus, Trash2, Shuffle, Check, Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

const DEFAULT_ROSTERS = {
  A01: ['Tuấn Minh', 'Gia Bảo', 'Quỳnh Chi', 'Hoàng An', 'Tiến Dũng', 'Bảo Ngọc', 'Phương Linh', 'Minh Khang'],
  B02: ['Quốc Bảo', 'Tuệ Minh', 'Phương Vy', 'Trọng Nhân', 'Gia Thịnh', 'Tô Châu', 'Nguyên Danh', 'Ánh Nhã'],
  IELTS: ['Hoàng Phúc', 'Thu Trang', 'Anh Tuấn', 'Tường Vy', 'Khánh Linh', 'Đức Hải', 'Thảo Nhi', 'Hải Yến'],
};

const WHEEL_COLORS = [
  '#FFC600', '#FF4B4B', '#1CB0F6', '#58CC02',
  '#9333EA', '#F97316', '#06B6D4', '#EC4899',
  '#EAB308', '#84CC16', '#10B981', '#6366F1',
];

const VIETNAMESE_ANNOUNCEMENT_TEMPLATES = [
  { id: 'chuc_mung', pattern: 'Chúc mừng bạn {name}!', label: '🎉 Chúc mừng bạn...' },
  { id: 'moi_tra_loi', pattern: 'Xin mời bạn {name} chuẩn bị trả lời câu hỏi!', label: '🎤 Xin mời bạn... trả lời' },
  { id: 'may_man', pattern: 'Người may mắn được gọi tên là bạn {name}!', label: '🌟 Người may mắn là...' },
  { id: 'vong_quay', pattern: 'Vòng quay may mắn xin gọi tên bạn {name}!', label: '🎡 Vòng quay gọi tên...' },
];

export default function WheelOfNames() {
  const [names, setNames] = useState(DEFAULT_ROSTERS.A01);
  const [selectedClass, setSelectedClass] = useState('A01');
  const [newName, setNewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('chuc_mung');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinSpeedRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTickSegmentRef = useRef(-1);

  // Redraw Wheel
  useEffect(() => {
    drawWheel();
  }, [names]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 15;

    ctx.clearRect(0, 0, width, height);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#E5E7EB';
      ctx.fill();
      ctx.fillStyle = '#1F2421';
      ctx.font = 'bold 16px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Thêm tên học viên để quay', centerX, centerY);
      return;
    }

    const arc = (Math.PI * 2) / names.length;

    // Draw slices
    names.forEach((name, i) => {
      const angle = currentAngleRef.current + i * arc;
      ctx.beginPath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Name Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1F2421';
      ctx.font = 'bold 14px Montserrat, sans-serif';
      ctx.fillText(name, radius - 25, 5);
      ctx.restore();
    });

    // Draw Center Circle with V Logo Dot
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
  };

  const speakWinnerInVietnamese = (winnerName) => {
    if (!winnerName) return;
    const tpl = VIETNAMESE_ANNOUNCEMENT_TEMPLATES.find((t) => t.id === selectedTemplateId) || VIETNAMESE_ANNOUNCEMENT_TEMPLATES[0];
    const sentence = tpl.pattern.replace('{name}', winnerName);
    speech.speakVietnamese(sentence);
  };

  const spin = () => {
    if (isSpinning || names.length === 0) return;

    sound.playClick();
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
        sound.playTick();
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
        sound.playFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        // Speak winner in authentic natural Vietnamese
        if (voiceEnabled) {
          setTimeout(() => {
            speakWinnerInVietnamese(selectedWinner);
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
    sound.playClick();
    setNames([...names].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-[#1F2421]">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#A67C1E] bg-[#FFC600]/20 px-3 py-1 rounded-full border border-[#FFC600]/40">
          V ENGLISH HOUSE · FUNNY CLASSROOM TOOLS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] mt-1.5 font-brand flex items-center justify-center gap-2">
          <span>🎡 VÒNG QUAY GỌI TÊN HỌC VIÊN</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
          Dành cho giáo viên gọi học sinh phát biểu, kiểm tra bài cũ hoặc chia quà may mắn (Giọng đọc chuẩn Tiếng Việt)
        </p>

        {/* Vietnamese Voice Announcement Controls */}
        <div className="mt-4 p-3 bg-white border border-stone-200/90 rounded-2xl shadow-sm max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#A67C1E]" />
            <span className="font-black text-stone-700">Giọng đọc Tiếng Việt:</span>
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                voiceEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              {voiceEnabled ? '✅ Đang Bật' : '🔇 Đang Tắt'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-stone-500">Mẫu câu gọi tên:</span>
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                const tpl = VIETNAMESE_ANNOUNCEMENT_TEMPLATES.find((t) => t.id === e.target.value);
                if (tpl) {
                  speech.speakVietnamese(tpl.pattern.replace('{name}', names[0] || 'Tuấn Minh'));
                }
              }}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold rounded-xl px-2.5 py-1 outline-none focus:border-[#FFC600]"
            >
              {VIETNAMESE_ANNOUNCEMENT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                const tpl = VIETNAMESE_ANNOUNCEMENT_TEMPLATES.find((t) => t.id === selectedTemplateId);
                speech.speakVietnamese(tpl ? tpl.pattern.replace('{name}', names[0] || 'Tuấn Minh') : 'Chúc mừng bạn!');
              }}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-[#1F2421] font-bold rounded-lg border border-stone-200 transition"
              title="Nghe thử giọng đọc tiếng Việt"
            >
              🔊 Thử giọng
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Spinning Wheel */}
        <div className="lg:col-span-7 bg-white border-2 border-stone-200/90 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Top Indicator Arrow */}
          <div className="relative z-10 -mb-5 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#FFC600] drop-shadow-md" />
          </div>

          {/* Canvas Wheel */}
          <div className="relative p-2">
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full h-auto drop-shadow-xl rounded-full"
            />
          </div>

          {/* Spin Button */}
          <div className="mt-6 flex items-center gap-3 w-full justify-center">
            <button
              type="button"
              onClick={spin}
              disabled={isSpinning || names.length === 0}
              className={`px-10 py-4 rounded-2xl font-black text-base transition transform active:scale-95 shadow-duo-yellow flex items-center gap-2 ${
                isSpinning
                  ? 'bg-stone-300 text-stone-500 cursor-wait'
                  : 'bg-[#FFC600] hover:brightness-105 text-[#1F2421]'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY!'}</span>
            </button>

            <button
              type="button"
              onClick={handleShuffle}
              disabled={isSpinning}
              className="p-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl border border-stone-300 transition"
              title="Xáo trộn vị trí các ô"
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Class Rosters & Student List Management */}
        <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A67C1E]" />
              <h3 className="text-sm font-black text-[#1F2421]">Danh Sách Học Viên ({names.length})</h3>
            </div>
          </div>

          {/* Preset Buttons for Classes */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1.5">
              Chọn danh sách lớp học có sẵn:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['A01', 'B02', 'IELTS'].map((clsKey) => (
                <button
                  key={clsKey}
                  type="button"
                  onClick={() => handleSelectPreset(clsKey)}
                  className={`py-2 rounded-xl text-xs font-black transition border ${
                    selectedClass === clsKey
                      ? 'bg-[#FFC600] text-[#1F2421] border-[#FFC600] shadow-sm'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  Lớp {clsKey}
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
              placeholder="Nhập thêm tên học viên..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1F2421] focus:bg-white focus:border-[#FFC600] outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Thêm</span>
            </button>
          </form>

          {/* Student Chips */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {names.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-[#1F2421] group transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-stone-200 text-[#1F2421] font-black flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold">{name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speech.speakVietnamese(`Xin mời bạn ${name}!`)}
                    className="p-1 text-stone-400 hover:text-[#A67C1E] rounded-lg transition"
                    title="Nghe đọc tên tiếng Việt"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveName(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-lg transition"
                    title="Xóa tên"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Celebration Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-bounce-short">
          <div className="bg-white border-4 border-[#FFC600] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative text-[#1F2421]">
            <div className="w-20 h-20 bg-[#FFC600] text-[#1F2421] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-duo-yellow animate-bounce">
              🎉
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A67C1E]">
              CHÚC MỪNG BẠN
            </span>
            <h3 className="text-3xl font-black text-[#1F2421] mt-1 font-brand">
              {winner}
            </h3>
            <p className="text-xs text-stone-600 mt-2 font-medium">
              Đã được chọn tham gia trả lời câu hỏi tiếp theo!
            </p>

            {/* Replay Vietnamese Voice Button */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => speakWinnerInVietnamese(winner)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F2421] font-bold text-xs rounded-xl border border-stone-200 transition flex items-center gap-1.5 shadow-sm"
                title="Nghe lại phát âm tiếng Việt"
              >
                <Volume2 className="w-4 h-4 text-[#A67C1E]" />
                <span>🔊 Nghe Lại Giọng Đọc Tiếng Việt</span>
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => setWinner(null)}
                className="w-full py-3.5 bg-[#FFC600] hover:brightness-105 text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow transition"
              >
                Tiếp Tục Trò Chơi
              </button>

              <button
                type="button"
                onClick={handleRemoveWinner}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition"
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
