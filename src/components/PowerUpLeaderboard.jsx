import React, { useState } from 'react';
import { Calendar, ChevronDown, Trophy, Award, Sparkles, Filter, List, LayoutGrid } from 'lucide-react';
import { sound } from '../utils/sound';

const HOUSE_DATA = {
  leader: {
    id: 'leader',
    name: 'LEADER',
    headerBg: 'bg-[#A67C1E]',
    textColor: 'text-[#A67C1E]',
    lightBg: 'bg-[#FFFDF6]',
    borderColor: 'border-[#E6D4A6]',
    members: [
      { rank: 1, name: 'Lê Kiều Quốc Bảo', class: 'A27', pu: 8, ap: 0, avatar: '👦🏽' },
      { rank: 2, name: 'Trần Vũ Tuệ Minh', class: 'A21', pu: 7, ap: 0, avatar: '👷🏼' },
      { rank: 3, name: 'Nguyễn Hoàng Phương Vy', class: 'A27', pu: 6, ap: 1, avatar: '👧🏽' },
    ],
  },
  fighter: {
    id: 'fighter',
    name: 'FIGHTER',
    headerBg: 'bg-[#993333]',
    textColor: 'text-[#993333]',
    lightBg: 'bg-[#FFF9F9]',
    borderColor: 'border-[#F0C9C9]',
    members: [
      { rank: 1, name: 'Lê Trọng Nhân', class: 'A28', pu: 9, ap: 0, avatar: '👷🏼' },
      { rank: 2, name: 'Nguyễn Gia Thịnh', class: 'A28', pu: 8, ap: 0, avatar: '🧒🏻' },
      { rank: 2, name: 'Trần Tố Châu', class: 'A28', pu: 8, ap: 0, avatar: '👩🏻' },
    ],
  },
  dweller: {
    id: 'dweller',
    name: 'DWELLER',
    headerBg: 'bg-[#2E6649]',
    textColor: 'text-[#2E6649]',
    lightBg: 'bg-[#F7FBF8]',
    borderColor: 'border-[#C8E3D4]',
    members: [
      { rank: 1, name: 'Đỗ Nguyên Danh', class: 'A20', pu: 9, ap: 1, avatar: '👦🏻' },
      { rank: 2, name: 'Trương Bảo Ngọc', class: 'A20', pu: 9, ap: 0, avatar: '👧🏼' },
      { rank: 3, name: 'Bùi Như Ngọc Vy', class: 'A29', pu: 7, ap: 0, avatar: '👩🏼' },
      { rank: 3, name: 'Nguyễn Minh Hồng Thương', class: 'A20', pu: 7, ap: 0, avatar: '🧒🏾' },
      { rank: 3, name: 'Nguyễn Thụy Ánh Nhã', class: 'A20', pu: 7, ap: 0, avatar: '👧🏾' },
    ],
    footnote: 'Có đồng hạng trong 3 hạng đầu.',
  },
  b1: {
    id: 'b1',
    name: 'B1',
    headerBg: 'bg-[#2E5266]',
    textColor: 'text-[#2E5266]',
    lightBg: 'bg-[#F7FAFB]',
    borderColor: 'border-[#C8DAE4]',
    members: [
      { rank: 1, name: 'Mai Hoàng Nam', class: 'B16', pu: 9, ap: 1, avatar: '🧑🏻' },
      { rank: 1, name: 'Nguyễn Hoài Nam', class: 'B16', pu: 9, ap: 1, avatar: '👷🏼' },
      { rank: 3, name: 'Lê Thiện Nhân', class: 'B16', pu: 8, ap: 0, avatar: '👦🏻' },
    ],
  },
};

export default function PowerUpLeaderboard() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [selectedDate, setSelectedDate] = useState('2026-09-12');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-[#1F2421] select-none font-brand">
      {/* Top Controls matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] tracking-tight">
            Xếp hạng Power-Up
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Theo dõi điểm Power-Up (PU) và điểm Action Points (AP) của 4 Nhà V English House
          </p>
        </div>

        {/* Date Selector Dropdown matching Screenshot 1 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-[#1F2421] shadow-sm outline-none focus:border-vhouse-gold cursor-pointer"
            >
              <option value="2026-09-12">2026-09-12</option>
              <option value="2026-10-01">2026-10-01</option>
              <option value="2026-10-11">2026-10-11 (Hôm nay)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* View Toggle: Danh sách / Lưới matching Screenshot 1 */}
      <div className="flex items-center gap-1.5 mb-6">
        <button
          type="button"
          onClick={() => { sound.playClick(); setViewMode('list'); }}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
            viewMode === 'list'
              ? 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow'
              : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          Danh sách
        </button>
        <button
          type="button"
          onClick={() => { sound.playClick(); setViewMode('grid'); }}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            viewMode === 'grid'
              ? 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow font-black'
              : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Lưới</span>
        </button>
      </div>

      {/* 4 House Leaderboard Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Object.values(HOUSE_DATA).map((house) => (
          <div
            key={house.id}
            className={`bg-white rounded-3xl overflow-hidden border ${house.borderColor} shadow-sm hover:shadow-md transition flex flex-col`}
          >
            {/* House Header matching Screenshot 1 solid colors */}
            <div className={`${house.headerBg} text-white px-5 py-3.5 flex items-center justify-between`}>
              <h3 className="font-black text-sm tracking-wider uppercase font-brand">
                {house.name}
              </h3>
              <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">
                Top 3 (PU+AP)
              </span>
            </div>

            {/* Table Header Row */}
            <div className="px-5 py-2 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-wider">
              <span>Học viên / Lớp</span>
              <div className="flex items-center gap-4">
                <span className="w-6 text-center">PU</span>
                <span className="w-6 text-center">AP</span>
              </div>
            </div>

            {/* Member Rows */}
            <div className="p-3 divide-y divide-gray-100 flex-1">
              {house.members.map((member, idx) => (
                <div
                  key={idx}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-stone-50/80 rounded-xl transition"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <span className="w-4 font-black text-xs text-gray-400 text-center">
                      {member.rank}
                    </span>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-base shadow-sm">
                      {member.avatar}
                    </div>

                    {/* Name & Class */}
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2421] line-clamp-1">
                        {member.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {member.class}
                      </span>
                    </div>
                  </div>

                  {/* Points: PU & AP */}
                  <div className="flex items-center gap-4 font-mono font-black text-xs">
                    <span className={`w-6 text-center font-bold ${house.textColor}`}>
                      {member.pu}
                    </span>
                    <span className="w-6 text-center text-gray-400">
                      {member.ap}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footnote if tie in top 3 */}
            {house.footnote && (
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 text-[10px] text-gray-400 italic">
                {house.footnote}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Rule Explanation matching Screenshot 1 */}
      <p className="text-[11px] text-gray-400 mt-6 italic">
        Xếp theo PU, sau đó AP. Cùng PU và AP giữ đồng hạng.
      </p>
    </div>
  );
}
