import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Volume2, Sparkles, Check, X as XIcon, HelpCircle, Shield, Award, Edit3, Image as ImageIcon, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

export default function TicTacGame({ quiz, quizzes = [], onSelectQuiz, onOpenAIModal, onEditQuiz }) {
  const [board, setBoard] = useState(Array(9).fill(null)); // 'X', 'O', or null
  const [currentTurn, setCurrentTurn] = useState('X'); // 'X' | 'O'
  const [teamScores, setTeamScores] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null); // 'X', 'O', 'DRAW', or null
  const [activeCell, setActiveCell] = useState(null); // index of cell being challenged
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const questions = quiz?.questions || [];

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return 'DRAW';
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winner || activeCell !== null) return;
    sound.playClick();

    const q = questions[index % (questions.length || 1)] || {
      text: 'What is the past tense of "go"?',
      options: [
        { text: 'went', isCorrect: true },
        { text: 'gone', isCorrect: false },
        { text: 'goed', isCorrect: false },
        { text: 'going', isCorrect: false },
      ],
      explanation: '💡 Quá khứ đơn của go là went.',
    };

    setActiveCell(index);
    setActiveQuestion(q);
    setSelectedOption(null);
    setAnswerRevealed(false);
  };

  const handleAnswer = (optIndex) => {
    if (answerRevealed) return;
    setSelectedOption(optIndex);
    setAnswerRevealed(true);

    const isCorrect = activeQuestion.options[optIndex]?.isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      const newBoard = [...board];
      newBoard[activeCell] = currentTurn;
      setBoard(newBoard);

      const w = checkWinner(newBoard);
      if (w) {
        setWinner(w);
        sound.playFanfare();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        if (w !== 'DRAW') {
          setTeamScores((prev) => ({ ...prev, [w]: prev[w] + 1 }));
        }
      } else {
        setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
      }
    } else {
      sound.playWrong();
      // Missed turn: passes to opponent
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    }

    setTimeout(() => {
      setActiveCell(null);
      setActiveQuestion(null);
    }, 2200);
  };

  const handleResetGame = () => {
    sound.playClick();
    setBoard(Array(9).fill(null));
    setWinner(null);
    setActiveCell(null);
    setActiveQuestion(null);
    setCurrentTurn('X');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-[#1F2421] flex flex-col items-center">
      {/* Title & Style Tag */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black uppercase tracking-wider mb-2">
          <span>❌⭕ TriviaMaker Style: TicTac Board Game</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1F2421] font-display">
          CỜ CA-RÔ CHIẾN THUẬT 2 ĐỘI
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
          Hai đội thi đấu trả lời câu hỏi tiếng Anh để chiếm ô trên lưới 3x3. Đội nào giành được 3 ô thẳng hàng đầu tiên sẽ chiến thắng!
        </p>
      </div>

      {/* TOP CONTENT CONTROLLER: Select Quiz, AI Generate, or Edit */}
      <div className="w-full max-w-2xl bg-white border border-stone-200/90 rounded-3xl p-3.5 sm:p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <BookOpen className="w-4 h-4 text-[#A67C1E] flex-shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase text-stone-500 block tracking-wider">
              Nội Dung Bộ Câu Hỏi Đang Chơi:
            </span>
            <select
              value={quiz?.id || ''}
              onChange={(e) => {
                const found = quizzes.find((q) => q.id === e.target.value);
                if (found && onSelectQuiz) {
                  onSelectQuiz(found);
                  handleResetGame();
                }
              }}
              className="w-full bg-stone-50 border border-stone-200 text-[#1F2421] text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none focus:border-[#FFC600]"
            >
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.questions?.length || 0} câu)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIModal && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAIModal();
              }}
              className="px-3.5 py-2 bg-[#FFC600] text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex items-center gap-1.5"
              title="Dùng AI tạo bộ đề 9 ô mới cho TicTac"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>AI Tạo Đề 9 Ô</span>
            </button>
          )}

          {onEditQuiz && quiz && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onEditQuiz(quiz);
              }}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F2421] border border-stone-300 font-black text-xs rounded-xl transition flex items-center gap-1.5"
              title="Chỉnh sửa câu hỏi trong bộ đề hiện tại"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#A67C1E]" />
              <span>Sửa Đề</span>
            </button>
          )}
        </div>
      </div>

      {/* Scoreboard & Turn Indicator */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-6">
        {/* Team X */}
        <div
          className={`p-4 rounded-2xl border-2 transition text-center ${
            currentTurn === 'X' && !winner
              ? 'bg-[#FFFDF6] border-[#FFC600] shadow-md scale-102 ring-2 ring-[#FFC600]/30'
              : 'bg-white border-stone-200 opacity-80'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-black">❌</span>
            <span className="text-xs font-black uppercase text-[#A67C1E]">ĐỘI VÀNG (Team X)</span>
          </div>
          <div className="text-2xl font-black text-[#1F2421]">{teamScores.X} Thắng</div>
          {currentTurn === 'X' && !winner && (
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider animate-pulse block mt-1">
              👉 Đang đến lượt!
            </span>
          )}
        </div>

        {/* Team O */}
        <div
          className={`p-4 rounded-2xl border-2 transition text-center ${
            currentTurn === 'O' && !winner
              ? 'bg-cyan-50 border-cyan-500 shadow-md scale-102 ring-2 ring-cyan-500/30'
              : 'bg-white border-stone-200 opacity-80'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-black text-cyan-600">⭕</span>
            <span className="text-xs font-black uppercase text-cyan-700">ĐỘI XANH (Team O)</span>
          </div>
          <div className="text-2xl font-black text-[#1F2421]">{teamScores.O} Thắng</div>
          {currentTurn === 'O' && !winner && (
            <span className="text-[10px] text-cyan-700 font-bold uppercase tracking-wider animate-pulse block mt-1">
              👉 Đang đến lượt!
            </span>
          )}
        </div>
      </div>

      {/* Winner Announcement Banner */}
      {winner && (
        <div className="mb-6 p-4 bg-[#FFFDF6] border-2 border-[#FFC600] rounded-3xl text-center w-full max-w-md shadow-md animate-bounce-short">
          <Trophy className="w-8 h-8 text-[#A67C1E] mx-auto mb-1 animate-spin" />
          <h3 className="text-xl font-black text-[#1F2421]">
            {winner === 'DRAW' ? 'HÒA CỜ! CẢ 2 ĐỘI ĐỀU XUẤT SẮC' : `🎉 ${winner === 'X' ? 'ĐỘI VÀNG (Team X)' : 'ĐỘI XANH (Team O)'} CHIẾN THẮNG!`}
          </h3>
          <p className="text-xs text-stone-600 mt-1">Đã nối thành công 3 ô thẳng hàng!</p>
        </div>
      )}

      {/* 3x3 TicTac Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md bg-stone-200/70 p-4 rounded-3xl border border-stone-300 shadow-sm">
        {board.map((cell, idx) => {
          const isAvailable = cell === null && !winner;
          return (
            <button
              key={idx}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleCellClick(idx)}
              className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center font-black text-4xl sm:text-5xl transition transform active:scale-95 border-2 ${
                cell === 'X'
                  ? 'bg-[#FFFDF6] border-[#FFC600] text-[#A67C1E] shadow-sm'
                  : cell === 'O'
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-600 shadow-sm'
                  : isAvailable
                  ? 'bg-white border-stone-200 hover:border-[#FFC600] hover:bg-[#FFFDF6] cursor-pointer text-stone-400 shadow-sm'
                  : 'bg-stone-100 border-stone-200 text-stone-400 opacity-50 cursor-not-allowed'
              }`}
            >
              {cell === 'X' ? (
                '❌'
              ) : cell === 'O' ? (
                '⭕'
              ) : (
                <div className="flex flex-col items-center text-stone-400">
                  <span className="text-xs font-black uppercase text-stone-500 mb-1">Ô {idx + 1}</span>
                  <HelpCircle className="w-6 h-6 opacity-40 hover:opacity-100 text-[#FFC600] transition" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset Round Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleResetGame}
          className="px-6 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs flex items-center gap-2 transition shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#A67C1E]" />
          <span>Chơi Lại Ván Mới</span>
        </button>
      </div>

      {/* Pop-up Question Challenge Modal */}
      {activeCell !== null && activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white border-2 border-[#FFC600] rounded-3xl p-5 sm:p-6 max-w-lg w-full text-[#1F2421] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
              <span className="text-xs font-black text-[#A67C1E] uppercase tracking-wider">
                Thử Thách Ô Số {activeCell + 1} - Lượt Đội {currentTurn === 'X' ? 'Vàng (❌)' : 'Xanh (⭕)'}
              </span>
              <button
                type="button"
                onClick={() => speech.speak(activeQuestion.text)}
                className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition"
                title="Phát âm Google Voice"
              >
                <Volume2 className="w-4 h-4 text-[#A67C1E]" />
              </button>
            </div>

            {/* Illustration Image if question has one */}
            {activeQuestion.image && (
              <div className="mb-3 max-h-40 rounded-xl overflow-hidden border border-[#FFC600]/40 bg-stone-100 flex justify-center">
                <img
                  src={activeQuestion.image}
                  alt="Minh họa câu hỏi"
                  className="max-h-40 object-contain rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}

            <h3 className="text-base sm:text-lg font-black mb-4 text-center leading-snug text-[#1F2421]">
              {activeQuestion.text}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {activeQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = opt.isCorrect;

                let btnStyle = 'bg-stone-50 border-stone-200 hover:border-[#FFC600] text-[#1F2421]';
                if (answerRevealed) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 border-emerald-500 text-white font-black scale-102';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-600 border-red-500 text-white opacity-80';
                  } else {
                    btnStyle = 'bg-stone-100 border-stone-200 text-stone-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={answerRevealed}
                    onClick={() => handleAnswer(optIdx)}
                    className={`p-3 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {answerRevealed && isCorrect && <Check className="w-4 h-4" />}
                    {answerRevealed && isSelected && !isCorrect && <XIcon className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation on reveal */}
            {answerRevealed && (
              <div className="p-3 bg-[#FFFDF6] rounded-xl border border-[#FFC600] text-xs text-stone-700 text-center animate-fade-in font-medium">
                {activeQuestion.explanation || '💡 Trả lời đúng để chiếm ô này!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
