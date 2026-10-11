import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Zap, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

export default function DuolingoPracticeView({ quiz, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [blankInput, setBlankInput] = useState('');
  const [wordBank, setWordBank] = useState([]);
  const [assembledWords, setAssembledWords] = useState([]);
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'CHECKED_CORRECT', 'CHECKED_WRONG', 'GAME_OVER', 'COMPLETED'
  const [shake, setShake] = useState(false);

  const question = quiz?.questions[currentIdx] || null;

  // Initialize word bank if current question is a scramble
  useEffect(() => {
    if (!question) return;

    setSelectedOption(null);
    setBlankInput('');
    setStatus('IDLE');

    if (question.type === 'scramble' && question.scrambledWords) {
      setWordBank([...question.scrambledWords]);
      setAssembledWords([]);
    } else if (question.scrambledWords && question.scrambledWords.length > 2) {
      // Provide word scramble for any question with words
      setWordBank([...question.scrambledWords]);
      setAssembledWords([]);
    }

    // Auto pronounce English sentence (respects teacher's voice settings)
    if (speech.isAutoReadEnabled() && (question.originalSentence || question.text)) {
      const sentenceToRead = question.originalSentence || question.text;
      speech.speak(sentenceToRead);
    }
  }, [currentIdx, quiz]);

  if (!question) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-[#1F2421]">
        <p>Không có câu hỏi luyện tập.</p>
      </div>
    );
  }

  const handleSelectWord = (word, index) => {
    if (status !== 'IDLE') return;
    sound.playClick();
    setAssembledWords([...assembledWords, word]);
    const updatedBank = [...wordBank];
    updatedBank.splice(index, 1);
    setWordBank(updatedBank);
  };

  const handleRemoveWord = (word, index) => {
    if (status !== 'IDLE') return;
    sound.playClick();
    setWordBank([...wordBank, word]);
    const updatedAssembled = [...assembledWords];
    updatedAssembled.splice(index, 1);
    setAssembledWords(updatedAssembled);
  };

  const handleCheck = () => {
    let isCorrect = false;

    if (question.type === 'blank') {
      if (!blankInput.trim()) return;
      const userText = blankInput.trim().toLowerCase();
      const targetText = String(question.correctAnswer || question.options?.find((o) => o.isCorrect)?.text || '').trim().toLowerCase();
      const acceptable = (question.acceptableAnswers || []).map((a) => String(a).trim().toLowerCase());
      isCorrect = userText === targetText || acceptable.includes(userText);
    } else if (question.type === 'scramble' || assembledWords.length > 0) {
      const userSentence = assembledWords.join(' ').trim().toLowerCase();
      const targetSentence = (question.originalSentence || question.options?.find((o) => o.isCorrect)?.text || '')
        .trim()
        .toLowerCase()
        .replace(/[.?!,]/g, '');

      isCorrect = userSentence === targetSentence;
    } else {
      if (selectedOption === null) return;
      isCorrect = question.options[selectedOption]?.isCorrect || false;
    }

    if (isCorrect) {
      sound.playCorrect();
      setXp(xp + 15);
      setStatus('CHECKED_CORRECT');
    } else {
      sound.playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setStatus('GAME_OVER');
      } else {
        setStatus('CHECKED_WRONG');
      }
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < quiz.questions.length) {
      setCurrentIdx(currentIdx + 1);
      setStatus('IDLE');
    } else {
      setStatus('COMPLETED');
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const progressPercent = Math.round(((currentIdx) / quiz.questions.length) * 100);

  // 1. COMPLETED SCREEN
  if (status === 'COMPLETED') {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-[#1F2421] my-8">
        <div className="bg-white border-2 border-[#FFC600] rounded-3xl p-8 shadow-xl relative">
          <div className="w-20 h-20 bg-[#FFC600] text-[#1F2421] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-duo-yellow animate-bounce">
            🏆
          </div>
          <h2 className="text-2xl font-black text-[#1F2421] font-display">
            XUẤT SẮC HOÀN THÀNH!
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Bạn đã hoàn thành bài luyện tập tại V English House!
          </p>

          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-bold block">ĐIỂM KINH NGHIỆM</span>
              <span className="text-2xl font-black text-[#A67C1E] flex items-center justify-center gap-1 mt-1">
                <Zap className="w-5 h-5 fill-current" /> +{xp} XP
              </span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-bold block">SỐ TRÁI TIM CÒN</span>
              <span className="text-2xl font-black text-red-500 flex items-center justify-center gap-1 mt-1">
                <Heart className="w-5 h-5 fill-current" /> {hearts} / 5
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentIdx(0);
              setHearts(5);
              setXp(0);
              setStatus('IDLE');
            }}
            className="w-full py-4 rounded-2xl bg-[#FFC600] text-[#1F2421] font-black text-sm shadow-duo-yellow hover:brightness-105 active:translate-y-1 transition"
          >
            Luyện Tập Lại Lần Nữa
          </button>
        </div>
      </div>
    );
  }

  // 2. GAME OVER SCREEN
  if (status === 'GAME_OVER') {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-[#1F2421] my-8">
        <div className="bg-white border-2 border-red-400 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            💔
          </div>
          <h2 className="text-2xl font-black text-red-600 font-display">HẾT TRÁI TIM RỒI!</h2>
          <p className="text-xs text-stone-600 mt-2">
            Đừng nản lòng! Học tiếng Anh là một hành trình rèn luyện mỗi ngày. Hãy thử lại nhé!
          </p>

          <button
            onClick={() => {
              setCurrentIdx(0);
              setHearts(5);
              setStatus('IDLE');
            }}
            className="w-full mt-6 py-4 rounded-2xl bg-[#FFC600] text-[#1F2421] font-black text-sm shadow-duo-yellow hover:brightness-105 active:translate-y-1 transition"
          >
            Nạp Lại 5 Trái Tim & Chơi Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-100px)] flex flex-col justify-between ${shake ? 'animate-wiggle' : ''}`}>
      {/* Top Header: Progress Bar, Hearts, XP */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Progress bar */}
          <div className="flex-1 bg-stone-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-300">
            <div
              className="bg-gradient-to-r from-[#FFC600] to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* XP & Hearts counters */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 text-[#A67C1E] font-black text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-black text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{hearts}</span>
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="mt-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#A67C1E] block mb-1">
            {question.type === 'blank'
              ? '✍️ BÀI TẬP ĐIỀN TỪ VÀO CHỖ TRỐNG'
              : question.type === 'true_false'
              ? '⚖️ BÀI TẬP ĐÚNG HAY SAI (TRUE / FALSE)'
              : question.type === 'scramble'
              ? '🧩 BÀI TẬP GHÉP TỪ THÀNH CÂU'
              : '🎯 CHỌN ĐÁP ÁN ĐÚNG'}
          </span>

          <div className="flex items-start gap-3 bg-white p-5 rounded-3xl border-2 border-stone-200/90 shadow-sm">
            <button
              onClick={() => speech.speak(question.originalSentence || question.text)}
              className="p-2.5 bg-[#FFC600] text-[#1F2421] rounded-xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex-shrink-0"
              title="Nghe phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-[#1F2421] leading-snug">
                {question.text}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Lớp {quiz.gradeLevel || 'A01'} • V English House
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Content: Blank, Scramble, True/False, or Multiple Choice */}
        <div className="my-6">
          {question.type === 'blank' ? (
            /* Fill In The Blank Typing Box */
            <div className="bg-white border-2 border-[#FFC600] rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
              <label className="text-xs font-black uppercase text-[#A67C1E] flex items-center gap-1.5">
                <span>✍️ Gõ từ hoặc cụm từ thích hợp vào chỗ trống:</span>
              </label>
              <input
                type="text"
                value={blankInput}
                onChange={(e) => setBlankInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && blankInput.trim() && status === 'IDLE') {
                    handleCheck();
                  }
                }}
                disabled={status !== 'IDLE'}
                placeholder="Gõ đáp án của bạn vào đây (VD: were, switched, for...)..."
                className="w-full bg-stone-50 border-2 border-stone-300 focus:border-[#FFC600] focus:bg-white rounded-2xl px-4 py-3.5 text-lg font-bold text-[#1F2421] outline-none font-mono transition placeholder:text-stone-400"
                autoFocus
              />
              {status === 'CHECKED_WRONG' && (
                <div className="text-xs text-rose-800 font-bold bg-rose-50 p-3 rounded-2xl border border-rose-200">
                  Đáp án chính xác:{' '}
                  <span className="text-emerald-700 font-black">
                    {question.correctAnswer || question.options?.find((o) => o.isCorrect)?.text}
                  </span>
                </div>
              )}
            </div>
          ) : question.type === 'true_false' ? (
            /* True / False 2 Tactile Buttons */
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (status !== 'IDLE') return;
                    sound.playClick();
                    setSelectedOption(idx);
                  }}
                  className={`p-6 rounded-2xl text-center font-black text-lg sm:text-xl border-2 transition active:translate-y-1 ${
                    selectedOption === idx
                      ? 'bg-[#FFFDF6] border-[#FFC600] text-[#A67C1E] shadow-md ring-4 ring-[#FFC600]/20'
                      : 'bg-white border-stone-200 text-[#1F2421] hover:border-stone-300 shadow-sm'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : question.type === 'scramble' || (wordBank.length > 0 && assembledWords.length > 0) ? (
            <div>
              {/* Assembled Words Slot */}
              <div className="min-h-[72px] p-3.5 bg-stone-100/80 border-2 border-dashed border-stone-300 rounded-2xl flex flex-wrap items-center gap-2 mb-6">
                {assembledWords.length === 0 ? (
                  <span className="text-xs text-stone-400 italic mx-auto">
                    Bấm các từ bên dưới để xếp thành câu hoàn chỉnh...
                  </span>
                ) : (
                  assembledWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveWord(word, idx)}
                      className="px-4 py-2.5 bg-[#FFC600] text-[#1F2421] font-black text-sm rounded-xl shadow-duo-yellow hover:brightness-105 active:translate-y-1 transition transform animate-bounce-short"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank Pool */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {wordBank.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectWord(word, idx)}
                    className="px-4 py-2.5 bg-white hover:bg-stone-50 text-[#1F2421] font-bold text-sm rounded-xl border-2 border-stone-200 hover:border-stone-300 shadow-sm active:translate-y-1 transition"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Duolingo style 3D Multiple Choice Buttons */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (status !== 'IDLE') return;
                    sound.playClick();
                    setSelectedOption(idx);
                  }}
                  className={`p-4 rounded-2xl text-left font-bold text-sm sm:text-base border-2 transition active:translate-y-1 ${
                    selectedOption === idx
                      ? 'bg-[#FFFDF6] border-[#FFC600] text-[#A67C1E] shadow-md ring-4 ring-[#FFC600]/20 font-black'
                      : 'bg-white border-stone-200 text-[#1F2421] hover:border-stone-300 shadow-sm'
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded-lg bg-stone-100 text-center text-xs leading-6 mr-2 font-bold text-stone-600">
                    {idx + 1}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action / Feedback Sheet */}
      <div>
        {status === 'IDLE' && (
          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={handleCheck}
              disabled={
                question.type === 'blank'
                  ? !blankInput.trim()
                  : question.type === 'scramble' || assembledWords.length > 0
                  ? assembledWords.length === 0
                  : selectedOption === null
              }
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm transition ${
                (question.type === 'blank' && blankInput.trim()) ||
                (question.type !== 'blank' && (selectedOption !== null || assembledWords.length > 0))
                  ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-500 active:translate-y-1 cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              KIỂM TRA ĐÁP ÁN
            </button>
          </div>
        )}

        {status === 'CHECKED_CORRECT' && (
          <div className="p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-500 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-bounce-short shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-base font-black text-emerald-900">TUYỆT VỜI! CHÍNH XÁC!</h4>
                {question.explanation && (
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed font-medium">
                    {question.explanation}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>TIẾP TỤC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'CHECKED_WRONG' && (
          <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-500 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-bounce-short shadow-sm">
            <div className="flex items-start gap-3">
              <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="text-base font-black text-rose-900">RẤT TIẾC! CHƯA CHÍNH XÁC</h4>
                {question.explanation && (
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed font-medium">
                    {question.explanation}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>ĐÃ HIỂU</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
