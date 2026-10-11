import React, { useState } from 'react';
import {
  Menu, Search, Bell, ChevronDown, Volume2, VolumeX,
  Sparkles, LayoutGrid, Monitor, BookOpen, GraduationCap,
  Wand2, Mic, Headphones, Gamepad2, HelpCircle, Award,
  Edit3, Trophy, Palette, Check, Clock, Layers, Flame
} from 'lucide-react';
import { sound } from '../utils/sound';
import { ANSWER_THEMES } from '../data/defaultQuizzes';
import VLogo from './VLogo';

export default function Navbar({
  mainTab,
  setMainTab,
  activeMode,
  setActiveMode,
  isSplitView,
  setIsSplitView,
  onOpenAIModal,
  onOpenEditor,
  onOpenVoiceSettings,
  onOpenSideDrawer,
  answerThemeKey = 'vhouse',
  onSelectAnswerTheme,
}) {
  const [muted, setMuted] = useState(sound.getMuted());
  const [viewRole, setViewRole] = useState('Học vụ / Admin');
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const currentTheme = ANSWER_THEMES[answerThemeKey] || ANSWER_THEMES.vhouse;

  const handleToggleMute = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm select-none">
      {/* Top Header Bar matching Screenshot 3 & 4 */}
      <div className="border-b-[3.5px] border-[#FFC600] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Hamburger Button + V Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSideDrawer}
            className="p-2 hover:bg-stone-100 rounded-xl text-[#1F2421] transition active:scale-95"
            title="Mở menu V English House Hub"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          <VLogo isDark={false} />
        </div>

        {/* Center: Search Bar matching Screenshot 3 & 4 */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="w-full relative flex items-center bg-stone-100/90 hover:bg-stone-100 rounded-full px-3.5 py-1.5 border border-stone-200 transition focus-within:border-[#FFC600] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FFC600]/30">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search classes, games or questions..."
              className="w-full bg-transparent text-xs text-[#1F2421] placeholder:text-gray-400 outline-none font-medium"
            />
            <span className="text-[10px] bg-white border border-stone-300 text-gray-500 font-bold px-1.5 py-0.5 rounded shadow-2xl flex-shrink-0 font-mono">
              ⌘ K
            </span>
          </div>
        </div>

        {/* Right: Role, Notifications, Avatar, Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Indicator matching Screenshot 3 */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[8.5px] font-black uppercase text-gray-400 tracking-wider">
              Đang xem như
            </span>
            <div className="relative">
              <select
                value={viewRole}
                onChange={(e) => setViewRole(e.target.value)}
                className="appearance-none bg-transparent pr-4 text-xs font-bold text-[#1F2421] outline-none cursor-pointer"
              >
                <option value="Học vụ / Admin">Học vụ / Admin</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Học viên">Học viên</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 top-1 pointer-events-none" />
            </div>
          </div>

          {/* Notification Bell matching Screenshot 3 */}
          <div className="relative">
            <button
              type="button"
              className="p-2 hover:bg-stone-100 rounded-full text-gray-600 transition"
              title="Thông báo"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>

          {/* User Profile Avatar matching Screenshot 3 */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 rounded-full bg-[#1F2421] text-white flex items-center justify-center font-black text-xs shadow-sm">
              HI
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-black text-[#1F2421] line-clamp-1">
                V English House intelligence
              </span>
              <span className="text-[9.5px] text-gray-400 font-bold">
                Admin / Founder
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
            {/* AI Generator Button */}
            <button
              type="button"
              onClick={onOpenAIModal}
              className="px-3 py-1.5 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex items-center gap-1.5"
              title="AI Soạn Đề Tự Động"
            >
              <Wand2 className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">AI Soạn Game</span>
            </button>

            {/* Quiz Editor Button */}
            <button
              type="button"
              onClick={onOpenEditor}
              className="px-3 py-1.5 bg-[#1F2421] text-white font-black text-xs rounded-xl shadow-sm hover:bg-black active:scale-95 transition flex items-center gap-1.5"
              title="Mở trình soạn thảo câu hỏi & quản lý hình ảnh"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FFC600]" />
              <span className="hidden sm:inline">Soạn / Sửa Đề</span>
            </button>

            {/* Arena Split-screen toggle */}
            {mainTab === 'arena' && (
              <button
                type="button"
                onClick={() => setIsSplitView(!isSplitView)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                  isSplitView
                    ? 'bg-stone-100 text-[#1F2421] border-stone-300 shadow-inner'
                    : 'bg-white text-gray-600 border-stone-200 hover:text-black'
                }`}
                title="Chia đôi màn hình Host + Học viên"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isSplitView ? 'Đang chia đôi' : '2 Màn hình'}</span>
              </button>
            )}

            {/* Answer Color Palette Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-[#1F2421] border border-stone-200 transition flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Chọn bộ màu 4 ô trả lời (V English House / Kahoot)"
              >
                <Palette className="w-3.5 h-3.5 text-[#A67C1E]" />
                <span className="hidden xl:inline">{currentTheme.shortName}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-2xl z-50 w-80 text-left animate-slide-down">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                      BỘ MÀU 4 Ô TRẢ LỜI CỦA BẠN
                    </span>
                    <span className="text-[10px] bg-[#FFC600]/20 text-[#A67C1E] font-black px-1.5 py-0.5 rounded">
                      V-HOUSE
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {Object.values(ANSWER_THEMES).map((th) => {
                      const isSelected = th.id === currentTheme.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            if (onSelectAnswerTheme) onSelectAnswerTheme(th.id);
                            setIsThemeOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-xs text-left transition border ${
                            isSelected
                              ? 'bg-[#FFFDF6] border-[#FFC600] text-[#1F2421] shadow-sm'
                              : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200/80 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-black text-xs text-[#1F2421] flex items-center gap-1.5">
                              {th.name}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#A67C1E] stroke-[3]" />
                            )}
                          </div>
                          <p className="text-[10.5px] text-stone-500 leading-snug mb-2">
                            {th.description}
                          </p>
                          {/* 4 Color Swatches */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {th.colors.map((c, i) => (
                              <div
                                key={i}
                                className={`h-6 rounded-lg ${c.bg} ${c.text || 'text-white'} flex items-center justify-center font-black text-xs shadow-xs border-b-2 ${c.border}`}
                              >
                                {c.shape}
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Google Voice Settings Button */}
            <button
              type="button"
              onClick={onOpenVoiceSettings}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-[#1F2421] border border-stone-200 transition flex items-center gap-1"
              title="Cài đặt giọng đọc Google Voice"
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
            </button>

            {/* Mute button */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-700 transition"
              title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Tabs matching V English House Hub Modules */}
      <div className="bg-[#FAF8F3] border-b border-stone-200/80 px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'arena', label: 'Đấu Trường (Kahoot)', icon: Monitor },
            { id: 'catrace', label: '🐱 Đua Mèo & Trí Tuệ (Cat IQ Race)', icon: Clock, isHot: true },
            { id: 'kidsarcade', label: '🧩 Xếp Chữ & Trí Nhớ (Kids Arcade)', icon: Sparkles, isNew: true },
            { id: 'curriculum', label: 'Kho Học Liệu V House', icon: Layers },
            { id: 'dictation', label: 'Chép Chính Tả (YouTube)', icon: Headphones },
            { id: 'tictac', label: 'Cờ Ca-Rô (TicTac)', icon: Gamepad2 },
            { id: 'hangman', label: 'Đoán Từ (Hangman)', icon: HelpCircle },
            { id: 'practice', label: 'Tự Luyện (Duolingo)', icon: BookOpen },
            { id: 'flashcards', label: 'Flashcards 3D', icon: Award },
            { id: 'wheel', label: 'Vòng Quay Gọi Tên', icon: Sparkles },
            { id: 'powerup', label: 'Xếp Hạng Power-Up', icon: Trophy },
            { id: 'classes', label: 'Lớp & Học Viên', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMainTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1F2421] text-white shadow-sm font-black'
                    : 'text-[#4A4F4C] hover:text-[#1F2421] hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFC600]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.isNew && (
                  <span className="text-[8.5px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded">
                    MỚI
                  </span>
                )}
                {tab.isHot && (
                  <span className="text-[8.5px] bg-[#FFC600] text-[#1F2421] font-black px-1.5 py-0.2 rounded shadow-sm">
                    TOP 4
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
