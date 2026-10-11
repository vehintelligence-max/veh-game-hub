import React, { useState } from 'react';
import {
  BookOpen, Sparkles, Wand2, Plus, Search, Filter, ShieldCheck,
  CheckCircle, ChevronRight, GraduationCap, Trophy, HelpCircle,
  Gamepad2, Headphones, Monitor, Trash2, Edit3, RotateCcw,
  Lightbulb, Layers, Award, Tag, ArrowRight, ExternalLink
} from 'lucide-react';
import {
  VHOUSE_CLASS_PROFILES,
  getStoredCurriculumUnits,
  saveCurriculumUnit,
  deleteCurriculumUnit,
  resetCurriculumToDefault
} from '../data/vhouseCurriculum';
import { sound } from '../utils/sound';

export default function VHouseCurriculumHub({
  onLaunchArenaWithQuiz,
  onLaunchTicTacWithUnit,
  onLaunchHangmanWithUnit,
  onLaunchDictationWithUnit,
  onOpenAIModalWithUnit
}) {
  const [selectedClassId, setSelectedClassId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [units, setUnits] = useState(() => getStoredCurriculumUnits());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New unit form state
  const [newUnitClass, setNewUnitClass] = useState('A01');
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitTheme, setNewUnitTheme] = useState('');
  const [newUnitGrammar, setNewUnitGrammar] = useState('');
  const [newUnitVocab, setNewUnitVocab] = useState('');
  const [newUnitSentence, setNewUnitSentence] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');
  const [newUnitFormat, setNewUnitFormat] = useState('choice');

  // Filter units by class & search query
  const filteredUnits = units.filter((u) => {
    const matchClass = selectedClassId === 'ALL' || u.classId === selectedClassId;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchClass;
    const matchSearch =
      u.title.toLowerCase().includes(q) ||
      u.theme.toLowerCase().includes(q) ||
      u.grammarFocus.toLowerCase().includes(q) ||
      (Array.isArray(u.targetVocab) && u.targetVocab.some((v) => v.toLowerCase().includes(q)));
    return matchClass && matchSearch;
  });

  const selectedProfile = selectedClassId !== 'ALL' ? VHOUSE_CLASS_PROFILES[selectedClassId] : null;

  // Handle Save New Unit
  const handleSaveNewUnit = (e) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) {
      alert('Vui lòng nhập tên bài học / Unit!');
      return;
    }

    const vocabList = newUnitVocab
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const newUnit = {
      id: `custom_unit_${Date.now()}`,
      classId: newUnitClass,
      className: VHOUSE_CLASS_PROFILES[newUnitClass]?.name || 'Lớp V House',
      unitNumber: `Unit Custom`,
      title: newUnitTitle.trim(),
      theme: newUnitTheme.trim() || 'Chủ đề bài học V English House',
      level: VHOUSE_CLASS_PROFILES[newUnitClass]?.cefr || 'Chuẩn V House',
      targetVocab: vocabList.length > 0 ? vocabList : ['vocabulary', 'grammar', 'practice'],
      grammarFocus: newUnitGrammar.trim() || 'Cấu trúc ngữ pháp trọng tâm',
      sentenceLength: VHOUSE_CLASS_PROFILES[newUnitClass]?.id === 'A01' ? '5 - 9 từ / câu' : '12 - 18 từ / câu',
      sampleSentence: newUnitSentence.trim() || 'Sample sentence for this unit.',
      recommendedFormat: newUnitFormat,
      description: newUnitDesc.trim() || 'Tài liệu giáo án bổ sung do giáo viên V English House biên soạn.'
    };

    const updated = saveCurriculumUnit(newUnit);
    if (updated) {
      setUnits(updated);
      sound.playCorrect();
      setIsAddModalOpen(false);
      // Reset form
      setNewUnitTitle('');
      setNewUnitTheme('');
      setNewUnitGrammar('');
      setNewUnitVocab('');
      setNewUnitSentence('');
      setNewUnitDesc('');
      alert(`🎉 Đã lưu bài học "${newUnit.title}" vào Kho Học Liệu V English House thành công!`);
    }
  };

  // Delete custom unit
  const handleDeleteUnit = (unitId, e) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa bài học này khỏi kho tài liệu?')) {
      const updated = deleteCurriculumUnit(unitId);
      if (updated) {
        setUnits(updated);
        sound.playClick();
      }
    }
  };

  // Reset to default units
  const handleResetDefaults = () => {
    if (confirm('Khôi phục toàn bộ kho học liệu về danh mục chuẩn ban đầu của V English House?')) {
      const defs = resetCurriculumToDefault();
      setUnits(defs);
      sound.playClick();
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* HEADER BANNER: V English House Pedagogy & Knowledge Base */}
      {/* ==================================================================== */}
      <div className="bg-[#1F2421] text-white rounded-3xl p-6 sm:p-8 border-4 border-[#FFC600] shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FFC600]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFC600] text-[#1F2421] text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-duo-yellow flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nền Tảng Độc Quyền V English House</span>
              </span>
              <span className="text-gray-400 text-xs font-mono">Curriculum & Pedagogy Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Kho Giáo Án & Trợ Lý Sư Phạm Chuẩn
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Hệ thống được lập trình sẵn <strong className="text-[#FFC600]">khung năng lực CEFR</strong>, triết lý giảng dạy tương tác vui vẻ và kho tài liệu theo từng lớp học. Giáo viên chỉ cần bấm <strong className="text-white">1 chạm</strong> là hệ thống tự hiểu trình độ và tạo ngay trò chơi phù hợp!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 bg-[#FFC600] text-[#1F2421] font-black text-xs sm:text-sm rounded-2xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Thêm Giáo Án / Tài Liệu Mới</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl border border-stone-700 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Giáo Trình Chuẩn</span>
            </button>
          </div>
        </div>

        {/* 4 Houses Motivation Badges (V English House Spirit) */}
        <div className="mt-6 pt-5 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black/30 border border-[#FFC600]/40 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-lg">🦁</span>
            <div>
              <span className="text-[11px] font-black text-[#FFC600] block">Nhà LEADER</span>
              <span className="text-[9.5px] text-stone-400">Dẫn đầu, bứt phá tư duy</span>
            </div>
          </div>

          <div className="bg-black/30 border border-[#FF4B4B]/40 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-lg">🥊</span>
            <div>
              <span className="text-[11px] font-black text-[#FF4B4B] block">Nhà FIGHTER</span>
              <span className="text-[9.5px] text-stone-400">Chiến binh, tốc độ & bản lĩnh</span>
            </div>
          </div>

          <div className="bg-black/30 border border-[#1CB0F6]/40 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-lg">🌊</span>
            <div>
              <span className="text-[11px] font-black text-[#1CB0F6] block">Nhà DWELLER</span>
              <span className="text-[9.5px] text-stone-400">Vững chắc, chiều sâu học thuật</span>
            </div>
          </div>

          <div className="bg-black/30 border border-[#58CC02]/40 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-lg">🍀</span>
            <div>
              <span className="text-[11px] font-black text-[#58CC02] block">Nhà B1</span>
              <span className="text-[9.5px] text-stone-400">Kiên định, vươn tầm chuẩn quốc tế</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CLASS FILTER TABS & SEARCH BAR */}
      {/* ==================================================================== */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm">
        {/* Class Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedClassId('ALL');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedClassId === 'ALL'
                ? 'bg-[#1F2421] text-white font-black shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất Cả Lớp ({units.length})
          </button>

          {Object.entries(VHOUSE_CLASS_PROFILES).map(([cid, prof]) => (
            <button
              key={cid}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedClassId(cid);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedClassId === cid
                  ? 'bg-[#FFC600] text-[#1F2421] font-black shadow-duo-yellow'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {prof.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo bài học, từ vựng, ngữ pháp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-[#1F2421] placeholder:text-stone-400 outline-none focus:border-[#FFC600] focus:bg-white transition"
          />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CLASS PEDAGOGY SPECIFICATION CARD (When a specific class is selected) */}
      {/* ==================================================================== */}
      {selectedProfile && (
        <div className="bg-[#FFFDF6] border-2 border-[#FFC600] rounded-2xl p-5 shadow-sm space-y-3 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FFC600]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1F2421] text-[#FFC600] flex items-center justify-center font-black text-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1F2421]">{selectedProfile.name}</h3>
                <span className="text-xs text-stone-600 font-bold">
                  Độ tuổi: {selectedProfile.ageGroup} • Chuẩn đầu ra: {selectedProfile.cefr}
                </span>
              </div>
            </div>

            <div className="bg-[#FFC600]/20 text-[#A67C1E] font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>{selectedProfile.houseEmphasis}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider block mb-1.5">
              🎯 Triết Lý Giảng Dạy & Quy Chuẩn Sư Phạm Tại V English House:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
              {selectedProfile.teachingPhilosophy.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-stone-200/80">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* UNITS GRID: LIST OF LESSONS WITH 1-CLICK INTERACTIVE GAME GENERATORS */}
      {/* ==================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#A67C1E]" />
            <span>Danh Sách Bài Học ({filteredUnits.length} bài)</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Bấm nút dưới mỗi bài để mở game tương tác ngay
          </span>
        </div>

        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 shadow-sm space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">Không tìm thấy bài học nào phù hợp</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc bấm nút "Thêm Giáo Án Mới" để bổ sung bài học vào hệ thống.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border-2 border-stone-200/90 hover:border-[#FFC600] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Unit Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#1F2421] text-white font-black px-2 py-0.5 rounded-lg">
                          {unit.className || unit.classId}
                        </span>
                        <span className="text-[10px] bg-[#FFC600]/20 text-[#A67C1E] font-bold px-2 py-0.5 rounded-lg">
                          {unit.unitNumber}
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 font-medium px-2 py-0.5 rounded-lg">
                          {unit.level}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#1F2421] group-hover:text-[#A67C1E] transition">
                        {unit.title}
                      </h3>
                    </div>

                    {unit.id.startsWith('custom_') && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteUnit(unit.id, e)}
                        className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-500 rounded-lg transition"
                        title="Xóa bài học tùy chỉnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Theme & Grammar */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-stone-600">
                      <strong className="text-[#1F2421]">Chủ đề:</strong> {unit.theme}
                    </p>
                    <p className="text-stone-600">
                      <strong className="text-[#1F2421]">Ngữ pháp:</strong> {unit.grammarFocus}
                    </p>
                    {unit.sampleSentence && (
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-[11.5px] italic text-stone-700 font-mono">
                        "{unit.sampleSentence}"
                      </div>
                    )}
                  </div>

                  {/* Target Vocab Chips */}
                  {Array.isArray(unit.targetVocab) && unit.targetVocab.length > 0 && (
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block mb-1">
                        Từ vựng trọng tâm:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {unit.targetVocab.map((v, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#FFFDF6] border border-[#FFC600]/60 text-[#1F2421] font-bold px-2 py-0.5 rounded-md"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 1-CLICK INTERACTIVE GAME GENERATORS */}
                <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                    ⚡ CHƠI GAME TƯƠNG TÁC TỪ BÀI HỌC NÀY:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {/* 1. Kahoot Arena */}
                    <button
                      type="button"
                      onClick={() => onLaunchArenaWithQuiz && onLaunchArenaWithQuiz(unit)}
                      className="p-2 bg-[#FFC600] text-[#1F2421] hover:brightness-105 rounded-xl font-black text-[11px] flex flex-col items-center justify-center gap-1 shadow-duo-yellow active:scale-95 transition"
                      title="Sinh đề và chơi ngay trên Đấu Trường Kahoot"
                    >
                      <Monitor className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Đấu Trường</span>
                    </button>

                    {/* 2. TicTac 3x3 */}
                    <button
                      type="button"
                      onClick={() => onLaunchTicTacWithUnit && onLaunchTicTacWithUnit(unit)}
                      className="p-2 bg-[#1F2421] text-white hover:bg-black rounded-xl font-black text-[11px] flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition"
                      title="Chơi Cờ Ca-Rô đối kháng câu hỏi"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-[#FFC600]" />
                      <span>Cờ Ca-Rô</span>
                    </button>

                    {/* 3. Hangman */}
                    <button
                      type="button"
                      onClick={() => onLaunchHangmanWithUnit && onLaunchHangmanWithUnit(unit)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 border border-stone-200 active:scale-95 transition"
                      title="Đoán từ vựng Hangman"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#A67C1E]" />
                      <span>Đoán Từ</span>
                    </button>

                    {/* 4. Dictation */}
                    <button
                      type="button"
                      onClick={() => onLaunchDictationWithUnit && onLaunchDictationWithUnit(unit)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 border border-rose-200 active:scale-95 transition"
                      title="Luyện nghe & Chép chính tả"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Chép Tả</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODAL: THÊM GIÁO ÁN / TÀI LIỆU NỘI BỘ MỚI */}
      {/* ==================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1F2421] text-white rounded-3xl max-w-2xl w-full border-4 border-[#FFC600] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFC600] text-[#1F2421] flex items-center justify-center font-black">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Thêm Giáo Án / Tài Liệu V English House</h3>
                  <span className="text-[10px] text-stone-400">Tài liệu sẽ được lưu vào kho và sẵn sàng để tạo trò chơi 1-chạm</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewUnit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lớp áp dụng */}
                <div>
                  <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                    🏫 Lớp Áp Dụng:
                  </label>
                  <select
                    value={newUnitClass}
                    onChange={(e) => setNewUnitClass(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 text-xs font-bold text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#FFC600]"
                  >
                    <option value="A01">Lớp A01 (Kids Primary)</option>
                    <option value="B01">Lớp B01 (Pre-IELTS)</option>
                    <option value="B02">Lớp B02 (Foundation)</option>
                    <option value="C01">Lớp C01 (IELTS Intensive)</option>
                    <option value="WORKPLACE">Lớp Giao Tiếp Người Đi Làm</option>
                  </select>
                </div>

                {/* Định dạng khuyến nghị */}
                <div>
                  <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                    🎯 Định Dạng Khuyến Nghị:
                  </label>
                  <select
                    value={newUnitFormat}
                    onChange={(e) => setNewUnitFormat(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 text-xs font-bold text-[#FFC600] rounded-xl px-3 py-2.5 outline-none focus:border-[#FFC600]"
                  >
                    <option value="choice">Trắc Nghiệm 4 Màu (Standard)</option>
                    <option value="blank">Điền Từ Vào Chỗ Trống (Fill Blank)</option>
                    <option value="mixed">Hỗn Hợp (Cả Trắc Nghiệm & Điền Từ)</option>
                  </select>
                </div>
              </div>

              {/* Tên bài học */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  📖 Tên Bài Học / Tiêu Đề Unit:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 🚀 Space Exploration & Future Tenses"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs font-bold text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Chủ đề */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  🌍 Chủ Đề (Theme / Context):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khám phá vũ trụ, Kính thiên văn James Webb, Sao Hỏa..."
                  value={newUnitTheme}
                  onChange={(e) => setNewUnitTheme(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs font-medium text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Ngữ pháp trọng tâm */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  ✍️ Ngữ Pháp Trọng Tâm (Grammar Focus):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tương lai đơn (will) vs Tương lai hoàn thành (will have V3/ed)..."
                  value={newUnitGrammar}
                  onChange={(e) => setNewUnitGrammar(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs font-medium text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Từ vựng thô */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  📚 Danh Sách Từ Vựng Trọng Tâm (cách nhau bởi dấu phẩy):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: telescope, astronaut, spacecraft, orbit, gravity, galaxy..."
                  value={newUnitVocab}
                  onChange={(e) => setNewUnitVocab(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs font-medium text-white rounded-xl p-3 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Câu ví dụ chuẩn */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  💡 Câu Mẫu Chuẩn Sư Phạm (Sample Sentence):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: By 2030, humans will have landed on Mars."
                  value={newUnitSentence}
                  onChange={(e) => setNewUnitSentence(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs font-mono text-[#FFC600] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Ghi chú sư phạm */}
              <div>
                <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                  📝 Hướng Dẫn Sư Phạm Cho Giáo Viên:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về lỗi học sinh hay mắc phải, mẹo làm bài..."
                  value={newUnitDesc}
                  onChange={(e) => setNewUnitDesc(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-xs text-stone-300 rounded-xl p-3 outline-none focus:border-[#FFC600]"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FFC600] text-[#1F2421] text-xs font-black rounded-xl shadow-duo-yellow hover:brightness-105 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Lưu Vào Kho Học Liệu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
