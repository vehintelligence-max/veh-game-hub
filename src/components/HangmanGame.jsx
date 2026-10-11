import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy, RotateCcw, Volume2, Sparkles, Heart, HelpCircle,
  ArrowRight, CheckCircle2, Wand2, Plus, Trash2, BookOpen,
  Layers, X, Check, Shuffle, Edit3, Image as ImageIcon
} from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import { smartAIGenerate } from '../utils/aiGenerator';
import { getSafeEducationalImageUrl } from '../utils/imageHelper';

const PRESET_PACKS = {
  peace: {
    name: '🌍 Hòa Bình & Thời Sự Thế Giới',
    words: [
      { word: 'DIPLOMACY', hint: 'Nghệ thuật đàm phán và quan hệ đối ngoại giữa các quốc gia', category: 'Thời Sự Quốc Tế' },
      { word: 'CEASEFIRE', hint: 'Lệnh thỏa thuận ngừng bắn tạm thời trong chiến sự', category: 'Thời Sự Quốc Tế' },
      { word: 'TREATY', hint: 'Hiệp ước hòa bình chính thức được ký kết giữa các bên', category: 'Thời Sự Quốc Tế' },
      { word: 'SOVEREIGNTY', hint: 'Quyền chủ quyền và độc lập tối cao của một quốc gia', category: 'Thời Sự Quốc Tế' },
      { word: 'HUMANITARIAN', hint: 'Hoạt động cứu trợ nhân đạo vì mục đích hòa bình', category: 'Thời Sự Quốc Tế' },
      { word: 'RECONSTRUCTION', hint: 'Sự tái thiết và khôi phục kinh tế sau chiến tranh', category: 'Thời Sự Quốc Tế' },
    ],
  },
  tech: {
    name: '🤖 Trí Tuệ Nhân Tạo & Khoa Học Công Nghệ',
    words: [
      { word: 'ALGORITHM', hint: 'Thuật toán máy tính giải quyết bài toán phức tạp', category: 'Công Nghệ AI' },
      { word: 'AUTONOMOUS', hint: 'Xe tự hành hoặc hệ thống hoạt động tự động thông minh', category: 'Công Nghệ AI' },
      { word: 'GENERATIVE', hint: 'Mô hình AI có khả năng tự sáng tạo văn bản và hình ảnh', category: 'Công Nghệ AI' },
      { word: 'SATELLITE', hint: 'Vệ tinh nhân tạo bay quanh quỹ đạo trái đất', category: 'Khoa Học Vũ Trụ' },
      { word: 'RENEWABLE', hint: 'Năng lượng tái tạo sạch như năng lượng gió và mặt trời', category: 'Năng Lượng Xanh' },
      { word: 'INNOVATION', hint: 'Sự đổi mới sáng tạo công nghệ thúc đẩy tiến bộ', category: 'Công Nghệ AI' },
    ],
  },
  ielts: {
    name: '🎓 IELTS Academic Vocabulary (Band 7.0+)',
    words: [
      { word: 'PERSEVERANCE', hint: 'Sự kiên trì, bền bỉ vượt qua khó khăn thử thách', category: 'IELTS Academic' },
      { word: 'SUSTAINABLE', hint: 'Có tính bền vững, không làm cạn kiệt tài nguyên thiên nhiên', category: 'IELTS Academic' },
      { word: 'COMPREHENSIVE', hint: 'Mang tính toàn diện, bao quát mọi khía cạnh', category: 'IELTS Academic' },
      { word: 'COLLABORATION', hint: 'Sự cộng tác phối hợp làm việc nhóm hiệu quả', category: 'IELTS Academic' },
      { word: 'UNPRECEDENTED', hint: 'Chưa từng có tiền lệ trong lịch sử trước đây', category: 'IELTS Academic' },
      { word: 'METICULOUS', hint: 'Tỉ mỉ, cẩn trọng kỹ lưỡng đến từng chi tiết nhỏ', category: 'IELTS Academic' },
    ],
  },
  grammar: {
    name: '🗣️ Ngữ Pháp & Ngữ Âm V English House',
    words: [
      { word: 'INVERSION', hint: 'Hiện tượng đảo trợ động từ lên trước chủ ngữ trong tiếng Anh', category: 'Ngữ Pháp' },
      { word: 'CONDITIONAL', hint: 'Câu điều kiện diễn tả giả định trái với thực tế', category: 'Ngữ Pháp' },
      { word: 'COLLOCATION', hint: 'Cụm từ cố định thường đi tự nhiên liền với nhau', category: 'Từ Vựng' },
      { word: 'PRONUNCIATION', hint: 'Cách phát âm chuẩn các âm tiết trong bảng ký hiệu IPA', category: 'Phát Âm' },
      { word: 'SUBJUNCTIVE', hint: 'Thức giả định dùng sau các tính từ khuyên bảo quan trọng', category: 'Ngữ Pháp' },
      { word: 'GERUND', hint: 'Danh động từ có đuôi V-ing đóng vai trò chủ ngữ hoặc tân ngữ', category: 'Ngữ Pháp' },
    ],
  },
  kids: {
    name: '🎒 Tiếng Anh Thiếu Nhi Lớp A01 (Primary)',
    words: [
      { word: 'ELEPHANT', hint: 'Loài động vật to lớn có chiếc vòi dài và đôi tai to', category: 'Lớp A01 Kids' },
      { word: 'BUTTERFLY', hint: 'Chú bướm xinh đẹp bay lượn rực rỡ trong vườn hoa', category: 'Lớp A01 Kids' },
      { word: 'RAINBOW', hint: 'Cầu vồng 7 sắc lung linh xuất hiện sau cơn mưa rào', category: 'Lớp A01 Kids' },
      { word: 'DOLPHIN', hint: 'Chú cá heo thông minh bơi lội nhào lộn dưới biển', category: 'Lớp A01 Kids' },
      { word: 'KANGAROO', hint: 'Chú chuột túi nhảy nhót với chiếc túi trước bụng', category: 'Lớp A01 Kids' },
    ],
  },
};

// ============================================================================
// HANGMAN GALLOWS & STICKMAN CANVAS (Matching user's graph paper sketch!)
// ============================================================================
function HangmanGallows({ wrongCount, maxWrong = 6, isWon, isLost }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-5 border-2 border-stone-300 shadow-md relative overflow-hidden mb-6 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:22px_22px]">
      {/* Red vertical margin line of student graph notebook */}
      <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-rose-400 opacity-60 pointer-events-none" />

      {/* Stage Status Pill */}
      <div className="flex items-center justify-between mb-1 pl-6 text-xs select-none">
        <span className="font-mono font-black text-stone-600">
          NÉT VẼ: {wrongCount}/{maxWrong}
        </span>
        {isLost ? (
          <span className="text-rose-700 font-black bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 animate-bounce">
            💀 ĐÃ BỊ DIE (TREO CỔ)!
          </span>
        ) : isWon ? (
          <span className="text-emerald-700 font-black bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 animate-bounce">
            🎉 ĐÃ CỨU SỐNG NGƯỜI NÀY!
          </span>
        ) : wrongCount === 5 ? (
          <span className="text-amber-700 font-black bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
            ⚠️ CHỈ CÒN 1 CƠ HỘI CUỐI!
          </span>
        ) : (
          <span className="text-stone-500 font-bold">
            {wrongCount === 0 && 'Giá treo trống'}
            {wrongCount === 1 && '1/6: Đã vẽ Đầu 👤'}
            {wrongCount === 2 && '2/6: Đã vẽ Thân 👕'}
            {wrongCount === 3 && '3/6: Đã vẽ Tay trái 🦾'}
            {wrongCount === 4 && '4/6: Đã vẽ Tay phải 🦾'}
          </span>
        )}
      </div>

      {/* The SVG Gallows & Stickman Canvas matching user sketch */}
      <svg
        viewBox="0 0 240 250"
        className="w-56 h-64 sm:w-64 sm:h-72 mx-auto drop-shadow-sm select-none"
      >
        {/* 1. Gallows Stand Base (Ground) */}
        <line x1="30" y1="230" x2="135" y2="230" stroke="#1F2421" strokeWidth="6" strokeLinecap="round" />

        {/* 2. Vertical Pole */}
        <line x1="80" y1="230" x2="80" y2="25" stroke="#1F2421" strokeWidth="6" strokeLinecap="round" />

        {/* 3. Top Horizontal Beam */}
        <line x1="77" y1="25" x2="185" y2="25" stroke="#1F2421" strokeWidth="6" strokeLinecap="round" />

        {/* 4. Diagonal Support Strut */}
        <line x1="80" y1="70" x2="125" y2="25" stroke="#1F2421" strokeWidth="5" strokeLinecap="round" />

        {/* 5. Hanging Rope */}
        <line
          x1="180"
          y1="25"
          x2="180"
          y2={isWon ? "45" : "68"}
          stroke={isWon ? "#16A34A" : "#B45309"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={isWon ? "4,2" : "none"}
        />

        {/* WINNING STATE: Stickman drops to ground and cheers with arms up \ O / */}
        {isWon ? (
          <g className="animate-bounce" style={{ transformOrigin: '180px 170px' }}>
            {/* Cut rope segment */}
            <path d="M 178 50 Q 182 55 180 60" stroke="#B45309" strokeWidth="3" strokeDasharray="3,2" fill="none" />

            {/* Rescued Happy Stickman */}
            <circle cx="180" cy="115" r="18" fill="#FFFFFF" stroke="#16A34A" strokeWidth="4.5" />
            {/* Happy eyes & smile ^ _ ^ */}
            <path d="M 174 113 Q 177 109 180 113" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 181 113 Q 184 109 187 113" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 175 121 Q 180 127 185 121" stroke="#16A34A" strokeWidth="2.5" fill="none" />

            {/* Torso */}
            <line x1="180" y1="133" x2="180" y2="180" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />

            {/* Arms up cheering: \ O / */}
            <line x1="180" y1="145" x2="155" y2="120" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="180" y1="145" x2="205" y2="120" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />

            {/* Standing Legs */}
            <line x1="180" y1="180" x2="160" y2="225" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="180" y1="180" x2="200" y2="225" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />

            <text x="135" y="100" fill="#16A34A" fontSize="15" fontWeight="900" fontFamily="sans-serif">
              SAVED! 🎉
            </text>
          </g>
        ) : (
          /* THE HANGING STICKMAN (Drawn incrementally 1 to 6) */
          <g
            style={{
              transformOrigin: '180px 25px',
              animation: isLost ? 'hangSwing 2s ease-in-out infinite' : 'none'
            }}
          >
            {/* Step 1: Head (circle at 180, 86, r=18) */}
            {wrongCount >= 1 && (
              <g>
                <circle cx="180" cy="86" r="18" fill="#FFFFFF" stroke="#1F2421" strokeWidth="4.5" />
                {isLost ? (
                  /* DEAD FACE: Red X X eyes, tongue hanging out */
                  <g>
                    {/* Left X eye */}
                    <line x1="173" y1="81" x2="178" y2="86" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="178" y1="81" x2="173" y2="86" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Right X eye */}
                    <line x1="182" y1="81" x2="187" y2="86" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="187" y1="81" x2="182" y2="86" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Tongue hanging out */}
                    <path d="M 178 93 Q 180 100 183 93" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
                  </g>
                ) : (
                  /* Alive face */
                  <g>
                    <circle cx="175" cy="84" r="2.2" fill="#1F2421" />
                    <circle cx="185" cy="84" r="2.2" fill="#1F2421" />
                    <path d="M 176 93 Q 180 90 184 93" stroke="#1F2421" strokeWidth="2" fill="none" />
                    {/* Sweat drop on 5th mistake */}
                    {wrongCount >= 5 && (
                      <path d="M 197 76 Q 200 81 198 84 Q 195 84 195 81 Z" fill="#38BDF8" />
                    )}
                  </g>
                )}
              </g>
            )}

            {/* Step 2: Torso (spine line from 180, 104 to 180, 155) */}
            {wrongCount >= 2 && (
              <line x1="180" y1="104" x2="180" y2="155" stroke="#1F2421" strokeWidth="5" strokeLinecap="round" />
            )}

            {/* Step 3: Left Arm (drawn diagonally down-left matching user sketch!) */}
            {wrongCount >= 3 && (
              <line x1="180" y1="118" x2="155" y2="142" stroke="#1F2421" strokeWidth="4.5" strokeLinecap="round" />
            )}

            {/* Step 4: Right Arm (drawn diagonally down-right matching user sketch!) */}
            {wrongCount >= 4 && (
              <line x1="180" y1="118" x2="205" y2="142" stroke="#1F2421" strokeWidth="4.5" strokeLinecap="round" />
            )}

            {/* Step 5: Left Leg (drawn diagonally down-left matching user sketch!) */}
            {wrongCount >= 5 && (
              <line x1="180" y1="155" x2="150" y2="200" stroke="#1F2421" strokeWidth="5" strokeLinecap="round" />
            )}

            {/* Step 6: Right Leg (drawn diagonally down-right - FINAL - DIE!) */}
            {wrongCount >= 6 && (
              <g>
                <line x1="180" y1="155" x2="210" y2="200" stroke="#1F2421" strokeWidth="5" strokeLinecap="round" />
                <text x="135" y="55" fill="#DC2626" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  💀 DIE!
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

export default function HangmanGame({ quiz, quizzes = [], onSelectQuiz, onOpenAIModal, onEditQuiz }) {
  const [packName, setPackName] = useState(PRESET_PACKS.peace.name);
  const [vocabList, setVocabList] = useState(PRESET_PACKS.peace.words);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showIllustration, setShowIllustration] = useState(false); // Default to FALSE to eliminate distracting/creepy images

  // Content Manager Modal State
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerTab, setManagerTab] = useState('ai'); // 'ai' | 'manual' | 'quizzes' | 'presets'
  const [aiPrompt, setAiPrompt] = useState('Từ vựng chủ đề Chiến tranh & Hòa bình thế giới');
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Manual word inputs
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newCategory, setNewCategory] = useState('Custom Vocabulary');
  const [bulkText, setBulkText] = useState('');

  const currentItem = vocabList[currentIdx] || vocabList[0] || { word: 'ENGLISH', hint: 'Tiếng Anh', category: 'Chung' };
  const targetWord = (currentItem.word || 'ENGLISH').toUpperCase().replace(/[^A-Z]/g, '');
  const maxWrong = 6;

  const isWon = targetWord.length > 0 && targetWord.split('').every((letter) => guessedLetters.has(letter) || letter === ' ');
  const isLost = wrongCount >= maxWrong;

  useEffect(() => {
    if (isWon) {
      sound.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      speech.speakEnglish(`Awesome job! You solved the puzzle and guessed the word: ${targetWord}!`);
      setScore((s) => s + 100);
    } else if (isLost) {
      sound.playWrong();
      speech.speakEnglish(`Game over! The correct word was: ${targetWord}! Better luck next time!`);
    }
  }, [isWon, isLost]);

  // Sync with quiz when teacher chooses an existing quiz
  const handleLoadFromQuiz = (targetQuiz) => {
    if (!targetQuiz || !targetQuiz.questions) return;
    const extracted = [];
    targetQuiz.questions.forEach((q) => {
      let w = '';
      let h = '';
      if (q.type === 'blank' && q.correctAnswer) {
        w = String(q.correctAnswer).replace(/[^a-zA-Z]/g, '').toUpperCase();
        h = q.text ? q.text.replace(/_______/g, `[${w}]`) : q.explanation || 'Điền từ vào câu';
      } else if (q.correctAnswer && !q.correctAnswer.includes(' ')) {
        w = String(q.correctAnswer).replace(/[^a-zA-Z]/g, '').toUpperCase();
        h = q.text || q.explanation || 'Thuật ngữ tiếng Anh';
      } else if (q.options) {
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (correctOpt && correctOpt.text && !correctOpt.text.includes(' ')) {
          w = String(correctOpt.text).replace(/[^a-zA-Z]/g, '').toUpperCase();
          h = q.text || q.explanation || 'Đáp án chính xác';
        }
      }

      if (w && w.length >= 3 && w.length <= 15) {
        extracted.push({
          word: w,
          hint: h,
          category: targetQuiz.title || 'Từ vựng đề thi',
          image: q.image || '',
        });
      }
    });

    if (extracted.length > 0) {
      sound.playCorrect();
      setPackName(`📚 ${targetQuiz.title}`);
      setVocabList(extracted);
      setCurrentIdx(0);
      setGuessedLetters(new Set());
      setWrongCount(0);
      setIsManagerOpen(false);
      alert(`🎉 Đã nạp thành công ${extracted.length} từ vựng từ bộ đề: "${targetQuiz.title}"!`);
    } else {
      alert('Bộ đề này không có từ đơn phù hợp (từ 3-15 chữ cái) để chơi Hangman.');
    }
  };

  // AI Generator Handler for Hangman
  const handleGenerateAIWords = async () => {
    if (!aiPrompt.trim()) return;
    sound.playClick();
    setIsAIGenerating(true);
    try {
      const result = await smartAIGenerate({
        prompt: `Tạo 8 từ vựng tiếng Anh để chơi Hangman: ${aiPrompt}`,
        questionCount: 8,
        questionFormat: 'blank',
      });

      const newWords = [];
      if (result && result.questions) {
        result.questions.forEach((q) => {
          let rawW = (q.correctAnswer || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
          if (!rawW && q.options) {
            rawW = (q.options.find((o) => o.isCorrect)?.text || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
          }
          if (rawW && rawW.length >= 3 && rawW.length <= 15) {
            newWords.push({
              word: rawW,
              hint: q.explanation || q.text || `Chủ đề: ${aiPrompt}`,
              category: aiPrompt,
              image: q.image || '',
            });
          }
        });
      }

      if (newWords.length > 0) {
        sound.playCorrect();
        setPackName(`✨ AI: ${aiPrompt}`);
        setVocabList(newWords);
        setCurrentIdx(0);
        setGuessedLetters(new Set());
        setWrongCount(0);
        setIsManagerOpen(false);
      } else {
        alert('Chưa tạo được từ vựng, vui lòng thử lại với câu lệnh khác.');
      }
    } catch (err) {
      console.error(err);
      sound.playWrong();
      alert('Lỗi khi tạo từ vựng: ' + err.message);
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Manual word addition
  const handleAddManualWord = () => {
    const cleanW = newWord.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanW || cleanW.length < 3) {
      alert('Vui lòng nhập từ tiếng Anh hợp lệ (từ 3 chữ cái trở lên)!');
      return;
    }
    if (!newHint.trim()) {
      alert('Vui lòng nhập gợi ý nghĩa tiếng Việt cho học sinh!');
      return;
    }

    sound.playClick();
    const item = {
      word: cleanW,
      hint: newHint.trim(),
      category: newCategory.trim() || 'Custom',
      image: getSafeEducationalImageUrl(cleanW, { width: 500, height: 300 }),
    };

    setVocabList([...vocabList, item]);
    setNewWord('');
    setNewHint('');
    alert(`🎉 Đã thêm từ "${cleanW}" vào danh sách!`);
  };

  // Bulk paste handler
  const handleAddBulkWords = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n').filter((l) => l.includes(':') || l.includes('-'));
    const parsed = [];
    lines.forEach((l) => {
      const parts = l.split(/[:\-]/);
      const w = parts[0]?.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();
      const h = parts.slice(1).join(' ').trim();
      if (w && w.length >= 3 && h) {
        parsed.push({
          word: w,
          hint: h,
          category: 'Danh Sách Dán Thô',
          image: getSafeEducationalImageUrl(w, { width: 500, height: 300 }),
        });
      }
    });

    if (parsed.length > 0) {
      sound.playCorrect();
      setVocabList([...vocabList, ...parsed]);
      setBulkText('');
      alert(`🎉 Đã thêm thành công ${parsed.length} từ vựng mới!`);
    } else {
      alert('Vui lòng dán theo định dạng "TỪ_TIẾNG_ANH: Gợi ý nghĩa" (Mỗi dòng 1 từ)!');
    }
  };

  const handleRemoveWord = (idx) => {
    sound.playClick();
    if (vocabList.length <= 1) {
      alert('Danh sách cần giữ lại ít nhất 1 từ!');
      return;
    }
    const updated = vocabList.filter((_, i) => i !== idx);
    setVocabList(updated);
    if (currentIdx >= updated.length) {
      setCurrentIdx(0);
    }
  };

  const handleSelectPreset = (key) => {
    sound.playClick();
    const pack = PRESET_PACKS[key];
    if (pack) {
      setPackName(pack.name);
      setVocabList(pack.words);
      setCurrentIdx(0);
      setGuessedLetters(new Set());
      setWrongCount(0);
      setIsManagerOpen(false);
    }
  };

  const handleGuess = (letter) => {
    if (guessedLetters.has(letter) || isWon || isLost) return;
    sound.playClick();

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!targetWord.includes(letter)) {
      setWrongCount((w) => w + 1);
      sound.playWrong();
    } else {
      sound.playCorrect();
    }
  };

  const handleNextWord = () => {
    sound.playClick();
    setCurrentIdx((prev) => (prev + 1) % vocabList.length);
    setGuessedLetters(new Set());
    setWrongCount(0);
  };

  const handleRandomWord = () => {
    sound.playClick();
    const nextIdx = Math.floor(Math.random() * vocabList.length);
    setCurrentIdx(nextIdx);
    setGuessedLetters(new Set());
    setWrongCount(0);
  };

  const handleResetGame = () => {
    sound.playClick();
    setGuessedLetters(new Set());
    setWrongCount(0);
    setScore(0);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-[#1F2421] flex flex-col items-center">
      {/* Title & Badge */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-black uppercase tracking-wider mb-2">
          <span>🔤 TriviaMaker Style: Hangman Word Guessing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1F2421] font-display">
          ĐOÁN TỪ VỰNG TIẾNG ANH (HANGMAN)
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
          Luyện phát âm, chính tả và phản xạ từ vựng V English House qua từng chữ cái. Đoán đúng trước khi hết 6 mạng sống!
        </p>
      </div>

      {/* TOP CONTROLLER: Pack Indicator & Content Creation Buttons (Requested by User) */}
      <div className="w-full max-w-2xl bg-white border border-stone-200/90 rounded-3xl p-3.5 sm:p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <Layers className="w-4 h-4 text-[#A67C1E] flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] font-black uppercase text-stone-500 block tracking-wider">
              Gói Từ Vựng Đang Chơi ({currentIdx + 1}/{vocabList.length} từ):
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1F2421] truncate block">
              {packName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsManagerOpen(true);
              setManagerTab('ai');
            }}
            className="px-3.5 py-2 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex items-center gap-1.5"
            title="Dùng AI tạo danh sách từ vựng Hangman mới"
          >
            <Wand2 className="w-3.5 h-3.5 fill-current" />
            <span>AI Tạo Từ Mới</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsManagerOpen(true);
              setManagerTab('manual');
            }}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F2421] border border-stone-300 font-black text-xs rounded-xl transition flex items-center gap-1.5"
            title="Tự thêm, xóa, quản lý từ vựng và lấy từ bộ đề"
          >
            <Plus className="w-3.5 h-3.5 text-[#A67C1E]" />
            <span>Quản Lý Từ Vựng</span>
          </button>

          <button
            type="button"
            onClick={handleRandomWord}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-300 transition"
            title="Chọn ngẫu nhiên một từ khác trong gói"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full max-w-xl bg-white border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between gap-4 mb-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black uppercase text-stone-500">Mạng Sống:</span>
          <div className="flex gap-1">
            {Array.from({ length: maxWrong }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition ${
                  i < maxWrong - wrongCount
                    ? 'text-red-500 fill-red-500 animate-pulse'
                    : 'text-stone-300 fill-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-stone-500 ml-1">
            ({maxWrong - wrongCount}/{maxWrong})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase font-black block">Chủ đề</span>
            <span className="text-xs font-black text-[#A67C1E]">{currentItem.category}</span>
          </div>
          <div className="text-right pl-3 border-l border-stone-200">
            <span className="text-[10px] text-stone-400 uppercase font-black block">Điểm số</span>
            <span className="text-sm font-black text-[#1F2421]">{score} đ</span>
          </div>
        </div>
      </div>

      {/* Clue / Hint Box with Audio and Optional Cartoon Illustration */}
      <div className="w-full max-w-xl bg-white border-2 border-[#FFC600] rounded-3xl p-5 mb-5 text-center shadow-sm relative text-[#1F2421]">
        <div className="flex items-center justify-center gap-2 mb-2 text-[#A67C1E] text-xs font-black uppercase tracking-wider flex-wrap">
          <Sparkles className="w-4 h-4" />
          <span>Gợi Ý Ngữ Nghĩa V English House ({targetWord.length} chữ cái):</span>
          <button
            type="button"
            onClick={() => speech.speak(currentItem.hint, 'vi-VN')}
            className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-[#1F2421]"
            title="Đọc gợi ý tiếng Việt"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle illustration button */}
          <button
            type="button"
            onClick={() => setShowIllustration(!showIllustration)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ml-1 flex items-center gap-1 ${
              showIllustration
                ? 'bg-[#FFC600]/20 text-[#A67C1E] border-[#FFC600]'
                : 'bg-stone-100 text-stone-500 border-stone-200 hover:text-stone-700'
            }`}
            title="Bật/Tắt ảnh minh họa hoạt hình 3D"
          >
            <ImageIcon className="w-3 h-3" />
            <span>{showIllustration ? 'Ẩn ảnh minh họa' : 'Hiện ảnh minh họa (3D)'}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base font-bold text-stone-800 leading-relaxed">
          "{currentItem.hint}"
        </p>

        {/* Clean 3D Pixar Cartoon Illustration - only when enabled or upon winning */}
        {(showIllustration || isWon) && (
          <div className="mt-3 relative max-h-36 rounded-2xl overflow-hidden border border-[#FFC600]/40 bg-stone-50 flex justify-center p-2">
            <img
              src={getSafeEducationalImageUrl(targetWord, { width: 500, height: 280 })}
              alt="Minh họa hoạt hình"
              className="max-h-32 object-contain rounded-xl drop-shadow-sm"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <button
              type="button"
              onClick={() => setShowIllustration(false)}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full text-xs"
              title="Đóng ảnh"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 1. REAL HANGMAN GALLOWS & STICKMAN CANVAS (Matching user sketch!)    */}
      {/* ==================================================================== */}
      <HangmanGallows
        wrongCount={wrongCount}
        maxWrong={maxWrong}
        isWon={isWon}
        isLost={isLost}
      />

      {/* ==================================================================== */}
      {/* 2. BLUE UNDERLINED WORD LETTERS (Matching user sketch: W O R D !)    */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-6 max-w-2xl">
        {targetWord.split('').map((letter, idx) => {
          if (letter === ' ') {
            return <div key={idx} className="w-5 sm:w-6" />;
          }

          const isRevealed = guessedLetters.has(letter) || isLost;
          const isWronglyRevealed = isLost && !guessedLetters.has(letter);

          return (
            <div key={idx} className="flex flex-col items-center select-none">
              <span
                className={`h-11 sm:h-14 flex items-center justify-center font-black text-3xl sm:text-4xl transition transform ${
                  isRevealed
                    ? isWronglyRevealed
                      ? 'text-red-500 animate-pulse font-mono'
                      : 'text-blue-600 animate-bounce-short scale-105'
                    : 'text-transparent'
                }`}
                style={{
                  fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Montserrat', Arial, sans-serif"
                }}
              >
                {isRevealed ? letter : ''}
              </span>
              {/* Thick blue underline bar matching user's sketch! */}
              <div
                className={`w-8 sm:w-11 h-1.5 rounded-full shadow-sm transition ${
                  isWronglyRevealed ? 'bg-red-500' : 'bg-blue-600'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Result Status Banner */}
      {isWon && (
        <div className="mb-6 p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-500 rounded-3xl text-center max-w-md w-full animate-bounce-short shadow-md">
          <span className="text-emerald-900 font-black text-base sm:text-lg block">
            🎉 XUẤT SẮC! ĐÃ CỨU SỐNG NGƯỜI QUE!
          </span>
          <p className="text-xs text-emerald-800 mt-1">
            Từ vựng chính xác là: <strong className="text-emerald-950 font-black text-sm">{targetWord}</strong>
          </p>
          <button
            type="button"
            onClick={() => speech.speak(targetWord)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe Phát Âm Tiếng Anh: {targetWord}</span>
          </button>
        </div>
      )}

      {isLost && (
        <div className="mb-6 p-4 sm:p-5 bg-rose-50 border-2 border-rose-500 rounded-3xl text-center max-w-md w-full animate-shake shadow-md">
          <span className="text-rose-900 font-black text-base sm:text-lg block">
            💀 ÔI KHÔNG! NGƯỜI QUE ĐÃ BỊ DIE (TREO CỔ)!
          </span>
          <p className="text-xs text-rose-800 mt-1">
            Đoán sai 6 lần rồi! Đáp án chính xác là: <strong className="text-rose-950 font-black text-sm">{targetWord}</strong>
          </p>
          <button
            type="button"
            onClick={() => speech.speak(targetWord)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe Phát Âm Từ: {targetWord}</span>
          </button>
        </div>
      )}

      {/* Interactive A-Z Keyboard */}
      <div className="w-full max-w-2xl bg-stone-200/70 p-4 rounded-3xl border border-stone-300 shadow-sm mb-6">
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = isGuessed && targetWord.includes(letter);
            const isWrong = isGuessed && !targetWord.includes(letter);

            return (
              <button
                key={letter}
                type="button"
                disabled={isGuessed || isWon || isLost}
                onClick={() => handleGuess(letter)}
                className={`h-11 sm:h-12 rounded-xl font-black text-sm sm:text-base border transition ${
                  isCorrect
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                    : isWrong
                    ? 'bg-stone-300 border-stone-300 text-stone-400 opacity-40 cursor-not-allowed'
                    : 'bg-white hover:bg-[#FFFDF6] hover:border-[#FFC600] border-stone-300 text-[#1F2421] active:scale-95 shadow-sm'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {(isWon || isLost) && (
          <button
            type="button"
            onClick={handleNextWord}
            className="px-6 py-3 rounded-2xl bg-[#1F2421] hover:bg-black text-[#FFC600] font-black text-xs shadow-xl active:translate-y-1 transition flex items-center gap-2"
          >
            <span>TỪ VỰNG TIẾP THEO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleResetGame}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs flex items-center gap-2 transition shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#A67C1E]" />
          <span>Chơi Lại Từ Đầu</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VOCABULARY CONTENT MANAGER MODAL (Requested by User)           */}
      {/* ============================================================== */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-hidden">
          <div className="bg-[#1C2024] border-2 border-vhouse-gold/70 rounded-3xl w-full max-w-3xl h-[88vh] shadow-2xl flex flex-col text-white overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-800 bg-[#14171A] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-vhouse-gold text-vhouse-dark rounded-xl flex items-center justify-center font-black shadow-duo-yellow">
                  <Layers className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-vhouse-gold font-display">
                    QUẢN LÝ & TẠO NỘI DUNG TỪ VỰNG HANGMAN
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dùng AI tạo từ mới, tự nhập từ vựng thủ công, hoặc lấy từ các bộ đề thi đã có
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="p-1.5 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/90 border-b border-gray-800 flex-shrink-0 overflow-x-auto">
              {[
                { id: 'ai', label: '✨ AI Tạo Từ Vựng', icon: Wand2 },
                { id: 'manual', label: '✍️ Thêm / Sửa Từ Thủ Công', icon: Plus },
                { id: 'quizzes', label: '📚 Lấy Từ Bộ Đề Đã Có', icon: BookOpen },
                { id: 'presets', label: '🌟 Gói Từ Vựng Có Sẵn', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = managerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setManagerTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow'
                        : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* TAB 1: AI GENERATOR */}
              {managerTab === 'ai' && (
                <div className="space-y-4 max-w-xl mx-auto py-2">
                  <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                    <label className="block text-xs font-black uppercase text-vhouse-gold mb-1">
                      Nhập chủ đề bạn muốn AI tạo từ vựng:
                    </label>
                    <p className="text-[11px] text-gray-400 mb-2">
                      Ví dụ: <em>Chiến tranh và hòa bình</em>, <em>IELTS band 7.0</em>, <em>Trí tuệ nhân tạo</em>, <em>Thể thao</em>, <em>Động vật cho trẻ em</em>...
                    </p>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Nhập chủ đề từ vựng..."
                      className="w-full bg-[#1C2024] border border-gray-700 focus:border-vhouse-gold rounded-xl px-4 py-2.5 text-sm font-bold text-white outline-none"
                    />

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[
                        'Chiến tranh & Hòa bình thế giới',
                        'Từ vựng IELTS Academic Band 7.5',
                        'Trí tuệ nhân tạo & Robot',
                        'Môi trường & Biến đổi khí hậu',
                        'Du lịch & Khách sạn quốc tế',
                      ].map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => setAiPrompt(sugg)}
                          className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-[11px] text-gray-300 hover:text-vhouse-gold rounded-lg border border-gray-700 transition"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={isAIGenerating || !aiPrompt.trim()}
                      onClick={handleGenerateAIWords}
                      className="px-8 py-3.5 bg-gradient-to-r from-vhouse-gold to-amber-500 text-vhouse-dark font-black text-sm rounded-2xl shadow-duo-yellow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                      <Wand2 className="w-4 h-4 fill-current" />
                      <span>{isAIGenerating ? 'Đang Tạo Từ Vựng Bằng AI...' : 'TẠO GÓI TỪ VỰNG & NẠP VÀO GAME NGAY'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: MANUAL WORD INPUT & CURRENT WORD LIST */}
              {managerTab === 'manual' && (
                <div className="space-y-5">
                  {/* Form to add single word */}
                  <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-3">
                    <span className="text-xs font-black uppercase text-vhouse-gold block">
                      ➕ Thêm Một Từ Vựng Mới Vào Game:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">
                          Từ tiếng Anh (3-15 ký tự):
                        </label>
                        <input
                          type="text"
                          value={newWord}
                          onChange={(e) => setNewWord(e.target.value)}
                          placeholder="VD: SUSTAINABLE"
                          className="w-full bg-[#1C2024] border border-gray-700 focus:border-vhouse-gold rounded-xl px-3 py-2 text-xs font-black text-white outline-none uppercase font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">
                          Gợi ý tiếng Việt cho học sinh:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newHint}
                            onChange={(e) => setNewHint(e.target.value)}
                            placeholder="VD: Có tính bền vững, bảo vệ môi trường..."
                            className="flex-1 bg-[#1C2024] border border-gray-700 focus:border-vhouse-gold rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddManualWord}
                            className="px-4 py-2 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 transition flex-shrink-0"
                          >
                            Thêm Từ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bulk text input */}
                  <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
                    <span className="text-xs font-black uppercase text-vhouse-gold block">
                      📋 Hoặc Dán Danh Sách Hàng Loạt (Dạng "TỪ: GỢI Ý"):
                    </span>
                    <textarea
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={`DIPLOMACY: Đàm phán ngoại giao hòa bình\nCEASEFIRE: Lệnh ngừng bắn trong chiến sự\nAUTONOMOUS: Xe tự hành thông minh`}
                      rows={3}
                      className="w-full bg-[#1C2024] border border-gray-700 focus:border-vhouse-gold rounded-xl p-3 text-xs text-white outline-none font-mono"
                    />
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleAddBulkWords}
                        disabled={!bulkText.trim()}
                        className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-vhouse-gold border border-vhouse-gold/40 rounded-xl font-bold text-xs transition disabled:opacity-50"
                      >
                        Thêm Hàng Loạt Vào Danh Sách
                      </button>
                    </div>
                  </div>

                  {/* Current Words in Game */}
                  <div>
                    <span className="text-xs font-black uppercase text-gray-400 block mb-2 px-1">
                      Danh Sách Các Từ Hiện Có Trong Game ({vocabList.length} từ):
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {vocabList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-vhouse-gold text-sm w-28 sm:w-36 truncate">
                              {idx + 1}. {item.word}
                            </span>
                            <span className="text-gray-300 font-medium line-clamp-1">
                              "{item.hint}"
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveWord(idx)}
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition flex-shrink-0"
                            title="Xóa từ này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXTRACT FROM QUIZZES */}
              {managerTab === 'quizzes' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-300">
                    Chọn một bộ đề thi bất kỳ trong thư viện của bạn. Hệ thống sẽ tự động bóc tách các từ vựng chính xác kèm theo câu hỏi để làm dữ liệu chơi Hangman:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizzes.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => handleLoadFromQuiz(q)}
                        className="p-4 bg-gray-900 hover:bg-vhouse-gold/15 border-2 border-gray-800 hover:border-vhouse-gold rounded-2xl cursor-pointer transition"
                      >
                        <h4 className="text-sm font-black text-white">{q.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{q.description}</p>
                        <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between text-xs text-vhouse-gold font-bold">
                          <span>{q.questions?.length || 0} câu hỏi</span>
                          <span className="flex items-center gap-1">
                            <span>Bấm để nạp từ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PRESET PACKS */}
              {managerTab === 'presets' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {Object.entries(PRESET_PACKS).map(([key, pack]) => (
                    <div
                      key={key}
                      onClick={() => handleSelectPreset(key)}
                      className="p-4 bg-gray-900 hover:bg-vhouse-gold/15 border-2 border-gray-800 hover:border-vhouse-gold rounded-2xl cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-black text-vhouse-gold mb-1">{pack.name}</h4>
                        <div className="flex flex-wrap gap-1 my-2">
                          {pack.words.map((w, i) => (
                            <span key={i} className="px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono text-gray-300">
                              {w.word}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="mt-3 w-full py-2 bg-gray-800 hover:bg-vhouse-gold text-gray-200 hover:text-vhouse-dark font-black text-xs rounded-xl transition"
                      >
                        Nạp Gói Này ({pack.words.length} từ)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-800 bg-[#14171A] flex justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="px-6 py-2 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 transition"
              >
                Đóng & Bắt Đầu Chơi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
