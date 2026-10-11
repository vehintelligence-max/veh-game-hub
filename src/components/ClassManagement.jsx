import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Award,
  Sparkles,
  Wand2,
  Shield,
  UserCheck,
  Trophy,
  Gift,
  Plus
} from 'lucide-react';
import { sound } from '../utils/sound';
import CatMascot from './CatMascot';

// Authentic student roster from V English House Power-Up system (media_1791701628096_98ddda92.png)
const INITIAL_HOUSES = {
  LEADER: {
    name: 'LEADER',
    color: '#b8860b',
    headerBg: 'bg-[#b8860b]',
    border: 'border-[#b8860b]',
    students: [
      { rank: 1, name: 'Lê Kiều Quốc Bảo', class: 'A27', pu: 8, ap: 0, avatar: '👦🏽' },
      { rank: 2, name: 'Trần Vũ Tuệ Minh', class: 'A21', pu: 7, ap: 0, avatar: '👧🏼' },
      { rank: 3, name: 'Nguyễn Hoàng Phương Vy', class: 'A27', pu: 6, ap: 1, avatar: '👧🏻' },
    ],
  },
  FIGHTER: {
    name: 'FIGHTER',
    color: '#a03838',
    headerBg: 'bg-[#a03838]',
    border: 'border-[#a03838]',
    students: [
      { rank: 1, name: 'Lê Trọng Nhân', class: 'A28', pu: 9, ap: 0, avatar: '👦🏻' },
      { rank: 2, name: 'Nguyễn Gia Thịnh', class: 'A28', pu: 8, ap: 0, avatar: '👦🏽' },
      { rank: 2, name: 'Trần Tô Châu', class: 'A28', pu: 8, ap: 0, avatar: '👧🏼' },
    ],
  },
  DWELLER: {
    name: 'DWELLER',
    color: '#2d6948',
    headerBg: 'bg-[#2d6948]',
    border: 'border-[#2d6948]',
    students: [
      { rank: 1, name: 'Đỗ Nguyên Danh', class: 'A20', pu: 9, ap: 1, avatar: '👦🏼' },
      { rank: 2, name: 'Trương Bảo Ngọc', class: 'A20', pu: 9, ap: 0, avatar: '👧🏻' },
      { rank: 3, name: 'Bùi Như Ngọc Vy', class: 'A29', pu: 7, ap: 0, avatar: '👧🏽' },
      { rank: 3, name: 'Nguyễn Minh Hồng Thương', class: 'A20', pu: 7, ap: 0, avatar: '👧🏼' },
      { rank: 3, name: 'Nguyễn Thụy Ánh Nhã', class: 'A20', pu: 7, ap: 0, avatar: '👧🏽' },
    ],
  },
  B1: {
    name: 'B1',
    color: '#39607a',
    headerBg: 'bg-[#39607a]',
    border: 'border-[#39607a]',
    students: [
      { rank: 1, name: 'Mai Hoàng Nam', class: 'B16', pu: 9, ap: 1, avatar: '👦🏼' },
      { rank: 1, name: 'Nguyễn Hoài Nam', class: 'B16', pu: 9, ap: 1, avatar: '👦🏻' },
      { rank: 3, name: 'Lê Thiện Nhân', class: 'B16', pu: 8, ap: 0, avatar: '👦🏼' },
    ],
  },
};

export default function ClassManagement({ quizzes, onAssignQuiz, onOpenAIModal }) {
  const [activeSubTab, setActiveSubTab] = useState('powerup'); // 'powerup' | 'classes' | 'award'
  const [houseData, setHouseData] = useState(INITIAL_HOUSES);
  const [selectedHouseToAward, setSelectedHouseToAward] = useState('LEADER');
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [assignedStatus, setAssignedStatus] = useState({});

  const classes = [
    {
      id: 'A01',
      name: 'Lớp A01 (Primary / Kids)',
      schedule: 'Thứ 7 & CN (9:45 - 11:15)',
      pickupTime: 'Đón: 9:30 - 9:40 | Giao: 11:15 - 11:25',
      leadTeacher: 'Nguyễn Thị Tường Vi (Director)',
      ta: 'Lan Anh (TA)',
      totalStudents: 14,
      skills: ['Speaking', 'Reading'],
      activeQuiz: 'Lớp A01: Vị trí đồ vật & Thói quen',
      completionRate: 88,
    },
    {
      id: 'B02',
      name: 'Lớp B02 (Junior / Teens)',
      schedule: 'Thứ 3 & Thứ 5 (17:30 - 19:00)',
      pickupTime: 'Đón: 17:15 - 17:25 | Giao: 19:00 - 19:10',
      leadTeacher: 'Thầy Mark & Cô Hoàng Yến',
      ta: 'Minh Đức (TA)',
      totalStudents: 18,
      skills: ['Grammar', 'Writing'],
      activeQuiz: 'Ngữ pháp: Thì Quá khứ & Bất quy tắc',
      completionRate: 94,
    },
    {
      id: 'IELTS-03',
      name: 'Pre-IELTS Foundation',
      schedule: 'Thứ 2 & Thứ 6 (19:30 - 21:00)',
      pickupTime: 'Ca tối toà nhà tầng 3',
      leadTeacher: 'Cô Tường Vi & Thầy Daniel',
      ta: 'Thu Trang (TA)',
      totalStudents: 12,
      skills: ['Speaking', 'Listening', 'Collocations'],
      activeQuiz: 'Essential Collocations & Vocabulary B2',
      completionRate: 100,
    },
  ];

  const handleAssign = (classId) => {
    sound.playClick();
    setAssignedStatus({ ...assignedStatus, [classId]: true });
  };

  const handleAwardPowerUp = () => {
    sound.playCorrect();
    setHouseData((prev) => {
      const updated = { ...prev };
      const house = updated[selectedHouseToAward];
      if (house && house.students.length > 0) {
        house.students[0].pu += pointsToAdd;
      }
      return updated;
    });
    alert(`🎉 Đã cộng +${pointsToAdd} Power-Up (PU) cho Nhà ${selectedHouseToAward}!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 text-[#1F2421]">
      {/* V ENGLISH HOUSE - HOUSE POWER-UP BANNER (media_1791701618526_fc15c6aa.png) */}
      <div className="bg-[#FFF8E7] text-[#1C2024] rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-[#FFC600]/60 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="z-10">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#A67800] block mb-1">
            V ENGLISH HOUSE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#1C2024]">
            House Power-Up
          </h1>
          <p className="text-xs text-[#6B5A33] mt-2 font-medium max-w-lg">
            Hệ thống thi đua & xếp hạng 4 Nhà (LEADER, FIGHTER, DWELLER, B1). Điểm lưu theo từng buổi học trực tiếp trên hệ thống!
          </p>
        </div>

        {/* The Golden Cat Mascot Waving with Yellow Foam Glove */}
        <div className="flex-shrink-0 z-10 sm:mr-4">
          <CatMascot expression="wave" size="lg" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('powerup');
            sound.playClick();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
            activeSubTab === 'powerup'
              ? 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow'
              : 'text-stone-600 hover:text-[#1F2421] bg-white border border-stone-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Bảng Xếp Hạng 4 Nhà (Leaderboard)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('award');
            sound.playClick();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
            activeSubTab === 'award'
              ? 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow'
              : 'text-stone-600 hover:text-[#1F2421] bg-white border border-stone-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Trao Điểm Power-Up</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('classes');
            sound.playClick();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
            activeSubTab === 'classes'
              ? 'bg-[#FFC600] text-[#1F2421] shadow-duo-yellow'
              : 'text-stone-600 hover:text-[#1F2421] bg-white border border-stone-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Danh Sách Lớp & Giáo Án AI</span>
        </button>
      </div>

      {/* ----------------- SUB-TAB 1: 4 HOUSES LEADERBOARD (98ddda92.png) ----------------- */}
      {activeSubTab === 'powerup' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F2421] font-brand">
                Xếp hạng Power-Up
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Xếp theo PU (Power-Up), sau đó AP (Activity Points). Cùng PU và AP giữ đồng hạng.
              </p>
            </div>
            <span className="text-xs bg-[#FFFDF6] border border-[#FFC600] text-[#A67C1E] font-black px-3 py-1.5 rounded-xl shadow-sm">
              Học kỳ Thu 2026
            </span>
          </div>

          {/* 4 Houses Columns matching 98ddda92.png */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(houseData).map((house) => (
              <div
                key={house.name}
                className="bg-white border-2 border-stone-200/90 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Header Badge */}
                <div className={`${house.headerBg} p-3.5 text-white flex items-center justify-between`}>
                  <strong className="text-sm font-black tracking-wider">{house.name}</strong>
                  <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest">
                    Top 3 (PU+AP)
                  </span>
                </div>

                {/* Table Header */}
                <div className="px-4 py-2 bg-stone-50 flex items-center justify-between text-[10px] font-black uppercase text-stone-500 border-b border-stone-200">
                  <span>Học viên / Lớp</span>
                  <div className="flex gap-4">
                    <span>PU</span>
                    <span>AP</span>
                  </div>
                </div>

                {/* Student Rows */}
                <div className="divide-y divide-stone-100 p-2 space-y-1 flex-1">
                  {house.students.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl flex items-center justify-between hover:bg-stone-50 transition text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-[#A67C1E] w-4 text-center">{st.rank}</span>
                        <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-sm border border-stone-200">
                          {st.avatar}
                        </div>
                        <div>
                          <strong className="block text-[#1F2421] font-bold leading-tight truncate max-w-[110px]">
                            {st.name}
                          </strong>
                          <span className="text-[10px] text-stone-500">{st.class}</span>
                        </div>
                      </div>

                      <div className="flex gap-5 font-black text-xs">
                        <span className="text-emerald-600">{st.pu}</span>
                        <span className="text-stone-500">{st.ap}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Quick Power-Up Button */}
                <div className="p-3 bg-stone-50 border-t border-stone-200">
                  <button
                    onClick={() => {
                      setSelectedHouseToAward(house.name);
                      setActiveSubTab('award');
                      sound.playClick();
                    }}
                    className="w-full py-2 rounded-xl text-xs font-black bg-white hover:bg-[#FFC600] hover:text-[#1F2421] text-stone-700 transition border border-stone-200 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#A67C1E]" />
                    <span>Cộng Điểm Cho {house.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: AWARD POWER-UP ----------------- */}
      {activeSubTab === 'award' && (
        <div className="bg-white border-2 border-[#FFC600] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto text-[#1F2421]">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#1F2421] font-display">
              Trao Điểm House Power-Up
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Cộng điểm nỗ lực phát âm, trả lời đúng câu hỏi và nghe chép chính tả cho từng Nhà
            </p>
          </div>

          {/* Select House */}
          <div>
            <label className="text-xs font-black uppercase text-stone-600 block mb-2">
              1. Chọn Nhà Được Thưởng:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'LEADER', bg: 'bg-[#b8860b]' },
                { id: 'FIGHTER', bg: 'bg-[#a03838]' },
                { id: 'DWELLER', bg: 'bg-[#2d6948]' },
                { id: 'B1', bg: 'bg-[#39607a]' },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setSelectedHouseToAward(h.id);
                    sound.playClick();
                  }}
                  className={`p-3 rounded-2xl border text-center transition font-black text-xs ${
                    selectedHouseToAward === h.id
                      ? `${h.bg} text-white border-black/20 shadow-md scale-105 ring-2 ring-[#FFC600]`
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {h.id}
                </button>
              ))}
            </div>
          </div>

          {/* Select Points */}
          <div>
            <label className="text-xs font-black uppercase text-stone-600 block mb-2">
              2. Số Điểm Power-Up (PU):
            </label>
            <div className="flex gap-2">
              {[1, 2, 5, 10].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setPointsToAdd(pts)}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs border transition ${
                    pointsToAdd === pts
                      ? 'bg-[#FFC600] text-[#1F2421] border-[#FFC600] shadow-duo-yellow'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  +{pts} PU
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={handleAwardPowerUp}
              className="w-full py-3.5 bg-gradient-to-r from-[#FFC600] to-amber-500 text-[#1F2421] font-black text-sm rounded-2xl shadow-duo-yellow hover:brightness-105 active:translate-y-1 transition flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5 fill-current" />
              <span>Xác Nhận Trao +{pointsToAdd} PU Cho Nhà {selectedHouseToAward}</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: CLASSES LIST & AI GENERATOR ----------------- */}
      {activeSubTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#1F2421] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#A67C1E]" />
              <span>Danh Sách Lớp Học Thuộc V English House</span>
            </h3>

            <button
              onClick={onOpenAIModal}
              className="px-4 py-2 bg-gradient-to-r from-[#FFC600] to-amber-500 text-[#1F2421] text-xs font-black rounded-xl shadow-duo-yellow hover:brightness-105 transition flex items-center gap-1.5"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Tạo Đề Mới Cho Lớp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white border-2 border-stone-200 hover:border-[#FFC600] rounded-3xl p-5 shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-[#A67C1E] bg-[#FFFDF6] px-2.5 py-1 rounded-lg border border-[#FFC600]">
                      LỚP {cls.id}
                    </span>
                    <span className="text-xs text-stone-500 font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#A67C1E]" /> {cls.totalStudents} học viên
                    </span>
                  </div>

                  <h4 className="text-base font-black text-[#1F2421]">{cls.name}</h4>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-[#A67C1E]" />
                      <span>{cls.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{cls.pickupTime}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-100 text-[11px]">
                      <p className="font-bold text-[#1F2421]">GV: {cls.leadTeacher}</p>
                      <p className="text-stone-500">Trợ giảng: {cls.ta}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-stone-500">Tỉ lệ hoàn thành bài:</span>
                      <span className="text-emerald-600 font-black">{cls.completionRate}%</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${cls.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 space-y-2">
                  {assignedStatus[cls.id] ? (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Đã giao bộ bài tập AI cho lớp</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAssign(cls.id)}
                      className="w-full py-2.5 bg-stone-100 hover:bg-[#FFC600] hover:text-[#1F2421] text-stone-700 font-black text-xs rounded-xl transition border border-stone-200 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <BookOpen className="w-4 h-4 text-[#A67C1E]" />
                      <span>Giao Bộ Đề AI Này Cho Lớp</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
