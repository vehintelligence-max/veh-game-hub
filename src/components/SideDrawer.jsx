import React from 'react';
import {
  X, FileText, CheckSquare, Users, MessageSquare, Building2,
  GraduationCap, BarChart3, FileSpreadsheet, Gamepad2, Award,
  Heart, Trophy, ChevronRight, Sparkles, Monitor, Headphones,
  HelpCircle, BookOpen, Layers, Clock
} from 'lucide-react';
import VLogo from './VLogo';
import { sound } from '../utils/sound';

export default function SideDrawer({ isOpen, onClose, mainTab, setMainTab }) {
  if (!isOpen) return null;

  const handleSelectTab = (tabKey) => {
    sound.playClick();
    setMainTab(tabKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (matching Screenshot 2: Dark Charcoal #1F2124) */}
      <div className="relative w-72 sm:w-80 bg-[#1F2124] text-white h-full shadow-2xl flex flex-col z-10 border-r border-gray-800 animate-slide-right select-none">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <VLogo isDark={true} />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Main Modules */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleSelectTab('arena')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'arena'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Đấu Trường (Kahoot)</span>
            </button>

            {/* Kho Học Liệu V House */}
            <button
              type="button"
              onClick={() => handleSelectTab('curriculum')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'curriculum'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-vhouse-gold" />
              </div>
              <span className="flex-1 text-left">Kho Học Liệu V House</span>
              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded">MỚI</span>
            </button>

            {/* Cuộc Đua Mèo - Cat Race Countdown Timer */}
            <button
              type="button"
              onClick={() => handleSelectTab('catrace')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'catrace'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#FFC600]" />
              </div>
              <span className="flex-1 text-left">Đua Mèo & Trí Tuệ (Cat IQ Race)</span>
              <span className="text-[9px] bg-[#FFC600] text-[#1F2421] font-black px-1.5 py-0.5 rounded">HOT</span>
            </button>

            {/* Kids Arcade: Word Scramble & What's Missing */}
            <button
              type="button"
              onClick={() => handleSelectTab('kidsarcade')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'kidsarcade'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="flex-1 text-left">Xếp Chữ & Trí Nhớ (Kids Arcade)</span>
              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded">MỚI</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('dictation')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'dictation'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Chép Chính Tả (YouTube)</span>
              <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded">MỚI</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('tictac')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'tictac'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Cờ Ca-Rô (TicTac 3x3)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('hangman')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'hangman'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Đoán Từ (Hangman)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('practice')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                mainTab === 'practice'
                  ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">Tự Luyện (Duolingo)</span>
            </button>
          </div>

          {/* SECTION: HỌC VIÊN & QUẢN LÝ (Screenshot 2) */}
          <div className="pt-2 border-t border-gray-800">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block px-3.5 mb-2">
              HỌC VIÊN & NHÀ (HOUSES)
            </span>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleSelectTab('classes')}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                  mainTab === 'classes'
                    ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">Lớp & Học Viên</span>
              </button>

              {/* Power Up - Active Item in Screenshot 2 */}
              <button
                type="button"
                onClick={() => handleSelectTab('powerup')}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                  mainTab === 'powerup'
                    ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">Xếp Hạng Power-Up</span>
                <span className="w-2 h-2 rounded-full bg-vhouse-gold animate-ping" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('flashcards')}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                  mainTab === 'flashcards'
                    ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">Flashcards 3D</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('wheel')}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 transition ${
                  mainTab === 'wheel'
                    ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow font-black'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">Vòng Quay Gọi Tên</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Sync Footer Status (matching Screenshot 2) */}
        <div className="p-4 border-t border-gray-800 bg-[#16191D] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-gray-300">Đang đồng bộ trực tiếp</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">17:15</span>
        </div>
      </div>
    </div>
  );
}
