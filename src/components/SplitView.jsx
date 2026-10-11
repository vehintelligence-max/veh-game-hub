import React from 'react';
import HostView from './HostView';
import PlayerView from './PlayerView';
import { Smartphone, Monitor } from 'lucide-react';

export default function SplitView({
  socket,
  playerSocket,
  quizzes,
  selectedQuiz,
  setSelectedQuiz,
  onOpenAIModal,
  onEditQuiz,
  answerThemeKey,
  onSelectAnswerTheme,
}) {
  return (
    <div className="p-2 sm:p-4 min-h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
        {/* Left: Host Screen (Projector / Teacher screen) */}
        <div className="lg:col-span-8 bg-white border-2 border-stone-200 rounded-3xl p-4 sm:p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFC600]/20 flex items-center justify-center text-[#1F2421]">
                <Monitor className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#1F2421]">
                MÀN HÌNH CHIẾU CHÍNH (HOST SCREEN)
              </span>
            </div>
            <span className="text-[10px] bg-stone-100 border border-stone-200 px-3 py-1 rounded-full text-stone-600 font-bold">
              📺 Kết nối TV / Máy chiếu phòng học
            </span>
          </div>

          <HostView
            socket={socket}
            quizzes={quizzes}
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
            onOpenAIModal={onOpenAIModal}
            onEditQuiz={onEditQuiz}
            answerThemeKey={answerThemeKey}
            onSelectAnswerTheme={onSelectAnswerTheme}
          />
        </div>

        {/* Right: Player Mobile Screen (Smartphone simulator) */}
        <div className="lg:col-span-4 bg-[#1F2124] rounded-[44px] p-4 shadow-2xl relative max-w-md mx-auto w-full ring-8 ring-stone-200 border-4 border-[#FFC600]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800 text-vhouse-gold">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FFC600]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                ĐIỆN THOẠI HỌC VIÊN
              </span>
            </div>
            {/* Speaker hole simulator */}
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto" />
          </div>

          <div className="rounded-3xl overflow-y-auto max-h-[720px] min-h-[580px] bg-[#14171A] flex flex-col p-1 border border-gray-800">
            <PlayerView
              socket={playerSocket || socket}
              answerThemeKey={answerThemeKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
