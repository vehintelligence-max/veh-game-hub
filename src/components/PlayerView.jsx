import React, { useState, useEffect } from 'react';
import { Smartphone, Check, X, Flame, Sparkles, Send, ArrowRight } from 'lucide-react';
import { KAHOOT_COLORS, ANSWER_THEMES, AVATARS } from '../data/defaultQuizzes';
import { sound } from '../utils/sound';

export default function PlayerView({ socket, initialPin = '', answerThemeKey = 'vhouse' }) {
  const currentTheme = ANSWER_THEMES[answerThemeKey] || ANSWER_THEMES.vhouse;
  const themeColors = currentTheme.colors;
  const [pin, setPin] = useState(initialPin);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [playerState, setPlayerState] = useState('JOIN'); // JOIN, LOBBY, QUESTION, ANSWERED, RESULT, FINAL
  const [playerData, setPlayerData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [scramblePicks, setScramblePicks] = useState([]);
  const [submittedValue, setSubmittedValue] = useState(null);
  const [revealData, setRevealData] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync PIN if updated externally (like in split view)
  useEffect(() => {
    if (initialPin && !pin) {
      setPin(initialPin);
    }
  }, [initialPin]);

  useEffect(() => {
    if (!socket) return;

    socket.on('game:question_start', (data) => {
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setSelectedOption(null);
      setTextInput('');
      setScramblePicks([]);
      setSubmittedValue(null);
      setAnswerResult(null);
      setRevealData(null);
      setPlayerState('QUESTION');
    });

    socket.on('player:answer_result', (data) => {
      setAnswerResult(data);
      if (data.isCorrect) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    });

    socket.on('game:question_reveal', (data) => {
      setRevealData(data);
      setPlayerState('RESULT');
    });

    socket.on('game:leaderboard', () => {
      // Keep result screen or wait for next question
    });

    socket.on('game:podium', () => {
      setPlayerState('FINAL');
    });

    socket.on('room:closed', ({ message }) => {
      alert(message || 'Phòng chơi đã đóng.');
      setPlayerState('JOIN');
    });

    return () => {
      socket.off('game:question_start');
      socket.off('player:answer_result');
      socket.off('game:question_reveal');
      socket.off('game:leaderboard');
      socket.off('game:podium');
      socket.off('room:closed');
    };
  }, [socket]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!socket || !pin || !name.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ PIN và Tên hiển thị!');
      return;
    }

    sound.playClick();
    setErrorMsg('');

    socket.emit('player:join', { pin: pin.trim(), name: name.trim(), avatar }, ({ success, player, error }) => {
      if (success) {
        setPlayerData(player);
        setPlayerState('LOBBY');
      } else {
        setErrorMsg(error || 'Không thể vào phòng!');
      }
    });
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null || !socket) return;
    sound.playClick();
    setSelectedOption(optionIndex);
    setSubmittedValue(currentQuestion?.options[optionIndex]?.text);
    setPlayerState('ANSWERED');
    socket.emit('player:answer', { pin, optionIndex });
  };

  const handleTextSubmit = (e) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || !socket) return;
    sound.playClick();
    setSubmittedValue(textInput.trim());
    setPlayerState('ANSWERED');
    socket.emit('player:answer', { pin, textAnswer: textInput.trim() });
  };

  const handleTrueFalse = (idx) => {
    if (!socket) return;
    sound.playClick();
    setSelectedOption(idx);
    setSubmittedValue(idx === 0 ? 'ĐÚNG (True)' : 'SAI (False)');
    setPlayerState('ANSWERED');
    socket.emit('player:answer', { pin, optionIndex: idx });
  };

  const handleScramblePick = (word, wordIdx) => {
    sound.playClick();
    setScramblePicks([...scramblePicks, word]);
  };

  const handleScrambleUndo = () => {
    sound.playClick();
    setScramblePicks(scramblePicks.slice(0, -1));
  };

  const handleScrambleSubmit = () => {
    if (scramblePicks.length === 0 || !socket) return;
    sound.playClick();
    const sentence = scramblePicks.join(' ');
    setSubmittedValue(sentence);
    setPlayerState('ANSWERED');
    socket.emit('player:answer', { pin, scrambleAnswer: scramblePicks });
  };

  // 1. JOIN Screen
  if (playerState === 'JOIN') {
    return (
      <div className="max-w-md mx-auto p-4 flex flex-col justify-center min-h-[calc(100vh-100px)]">
        <div className="bg-[#1C2024] border-2 border-veh-gold/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-veh-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-duo-yellow text-veh-ink">
              <Smartphone className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-white font-brand">THAM GIA TRẬN ĐẤU</h2>
            <p className="text-xs text-gray-300 mt-1">Nhập Game PIN trên màn hình chiếu để vào chơi</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-veh-gold mb-1">
                MÃ GAME PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ví dụ: 123456"
                className="w-full bg-gray-900 border-2 border-veh-gold/50 rounded-xl px-4 py-3 text-center text-xl font-black text-veh-gold tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-veh-gold focus:ring-2 focus:ring-veh-gold/20"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-veh-gold mb-1">
                TÊN HỌC VIÊN (NICKNAME)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full bg-gray-900 border-2 border-gray-700 focus:border-veh-gold rounded-xl px-4 py-3 text-white font-bold placeholder:text-gray-600 focus:outline-none"
                maxLength={16}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-veh-gold mb-2">
                CHỌN LINH VẬT (AVATAR)
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setAvatar(av);
                      sound.playClick();
                    }}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition border ${
                      avatar === av
                        ? 'bg-veh-gold/20 border-veh-gold scale-110 shadow-sm'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-veh-gold to-amber-500 text-veh-ink font-black text-base shadow-duo-yellow hover:brightness-110 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>VÀO PHÒNG NGAY</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. PLAYER LOBBY
  if (playerState === 'LOBBY') {
    return (
      <div className="max-w-md mx-auto p-4 flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center">
        <div className="bg-[#1C2024] border-2 border-veh-gold/70 rounded-3xl p-8 shadow-2xl w-full">
          <div className="text-7xl mb-4 animate-bounce">{avatar}</div>
          <h2 className="text-2xl font-black text-white">{name}</h2>
          <p className="text-xs text-veh-gold font-bold uppercase tracking-wider mt-1">ĐÃ VÀO PHÒNG {pin}</p>

          <div className="my-8 p-4 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-sm text-gray-200 font-medium">
              Bạn thấy tên mình trên màn hình Host chưa?
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Hãy sẵn sàng, trò chơi sắp bắt đầu!
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-veh-gold font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-veh-gold animate-ping" />
            <span>Đang chờ Host bắt đầu trận đấu...</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. IN-GAME QUESTION - Supports Multiple Formats (blank, true_false, scramble, choice)
  if (playerState === 'QUESTION') {
    const qType = currentQuestion?.type || 'choice';

    return (
      <div className="max-w-md mx-auto p-2 sm:p-3 flex flex-col justify-between h-full min-h-full">
        {/* Full Question prompt card for player convenience */}
        <div className="bg-[#1C2024] border-2 border-veh-gold/40 rounded-2xl p-3 sm:p-4 text-center shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase font-black tracking-wider mb-1.5 pb-1 border-b border-gray-800">
            <span className="text-veh-gold font-black flex items-center gap-1">
              <span>🎯 CÂU {questionIndex + 1}</span>
            </span>
            {qType === 'blank' && <span className="text-cyan-400 font-bold">✍️ Điền từ vào chỗ trống</span>}
            {qType === 'true_false' && <span className="text-purple-400 font-bold">⚖️ Đúng hay Sai</span>}
            {qType === 'scramble' && <span className="text-amber-400 font-bold">🧩 Sắp xếp câu</span>}
            {qType === 'choice' && <span className="text-gray-400 font-bold">🔘 Trắc nghiệm</span>}
          </div>
          <div className="text-sm sm:text-base font-bold text-white leading-relaxed break-words max-h-36 overflow-y-auto px-1">
            {currentQuestion?.text?.includes('___') ? (
              <span>
                {currentQuestion.text.split(/_{3,}/).map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    {part}
                    {idx < arr.length - 1 && (
                      <span className="inline-block px-2.5 py-0.5 mx-1 bg-amber-500/20 border border-amber-400 text-veh-gold rounded-lg font-mono font-black text-xs animate-pulse">
                        _______
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            ) : (
              currentQuestion?.text
            )}
          </div>
        </div>

        {/* Compact Illustration Banner for mobile players */}
        {currentQuestion?.image && (
          <div className="my-2 rounded-xl overflow-hidden border border-gray-700 bg-black/40 max-h-28 flex justify-center flex-shrink-0">
            <img
              src={currentQuestion.image}
              alt="Minh họa câu hỏi"
              className="max-h-28 object-contain rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        {/* FORMAT A: FILL IN THE BLANK (TYPE IN) */}
        {qType === 'blank' && (
          <form onSubmit={handleTextSubmit} className="my-auto space-y-3 flex-1 flex flex-col justify-center">
            <div className="bg-[#1C2024] border-2 border-cyan-500/70 rounded-2xl p-4 sm:p-5 shadow-2xl text-center">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block mb-2">
                NHẬP TỪ HOẶC CỤM TỪ CẦN ĐIỀN:
              </span>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Gõ đáp án của bạn..."
                autoFocus
                className="w-full bg-gray-900 border-2 border-cyan-500/50 focus:border-cyan-400 rounded-xl px-4 py-3 text-center text-lg sm:text-xl font-black text-white placeholder:text-gray-600 outline-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!textInput.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5 fill-current" />
              <span>GỬI ĐÁP ÁN (SUBMIT)</span>
            </button>
          </form>
        )}

        {/* FORMAT B: TRUE / FALSE */}
        {qType === 'true_false' && (
          <div className="grid grid-cols-1 gap-3 my-auto flex-1 flex flex-col justify-center">
            <button
              onClick={() => handleTrueFalse(0)}
              className="bg-[#1368ce] hover:brightness-110 active:scale-95 text-white font-black text-xl sm:text-2xl py-6 sm:py-7 rounded-2xl shadow-xl border-b-4 border-blue-800 flex items-center justify-center gap-3 transition"
            >
              <span className="text-3xl">✔</span>
              <span>ĐÚNG (TRUE)</span>
            </button>
            <button
              onClick={() => handleTrueFalse(1)}
              className="bg-[#e21b3c] hover:brightness-110 active:scale-95 text-white font-black text-xl sm:text-2xl py-6 sm:py-7 rounded-2xl shadow-xl border-b-4 border-red-800 flex items-center justify-center gap-3 transition"
            >
              <span className="text-3xl">✖</span>
              <span>SAI (FALSE)</span>
            </button>
          </div>
        )}

        {/* FORMAT C: SENTENCE SCRAMBLE */}
        {qType === 'scramble' && (
          <div className="my-auto space-y-3 flex-1 flex flex-col justify-center">
            {/* Target Constructed Sentence Slot */}
            <div className="bg-[#1C2024] border-2 border-amber-500/60 rounded-2xl p-3.5 shadow-xl min-h-[80px] flex flex-wrap items-center justify-center gap-1.5">
              {scramblePicks.length === 0 ? (
                <span className="text-xs text-gray-500 font-bold italic">
                  Chạm các từ bên dưới để ghép thành câu...
                </span>
              ) : (
                scramblePicks.map((w, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-500 text-vhouse-dark font-black text-xs sm:text-sm rounded-lg shadow animate-bounce-short">
                    {w}
                  </span>
                ))
              )}
            </div>

            {/* Available Word Chips to Pick */}
            <div className="flex flex-wrap justify-center gap-1.5 p-2.5 bg-gray-900 border border-gray-800 rounded-xl max-h-36 overflow-y-auto">
              {(currentQuestion?.scrambledWords || []).map((w, idx) => {
                const pickedCount = scramblePicks.filter((p) => p === w).length;
                const totalInWords = (currentQuestion?.scrambledWords || []).filter((p) => p === w).length;
                const isExhausted = pickedCount >= totalInWords;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isExhausted}
                    onClick={() => handleScramblePick(w, idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition ${
                      isExhausted
                        ? 'opacity-30 bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 active:scale-95 shadow'
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleScrambleUndo}
                disabled={scramblePicks.length === 0}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl border border-gray-700 transition disabled:opacity-40"
              >
                Hoàn tác
              </button>
              <button
                type="button"
                onClick={handleScrambleSubmit}
                disabled={scramblePicks.length === 0}
                className="flex-1 py-2.5 bg-vhouse-gold hover:brightness-110 active:scale-95 text-vhouse-dark font-black text-xs sm:text-sm rounded-xl shadow-duo-yellow transition"
              >
                GỬI CÂU (SUBMIT)
              </button>
            </div>
          </div>
        )}

        {/* FORMAT D: 4 V ENGLISH HOUSE / KAHOOT BUTTONS */}
        {qType === 'choice' && (
          <div className="grid grid-cols-2 gap-2.5 my-2 flex-1 min-h-[220px] max-h-[380px]">
            {themeColors.map((col, idx) => {
              const opt = currentQuestion?.options[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`${col.bg} ${col.shadow} ${col.hover} rounded-2xl p-3 sm:p-4 ${col.text || 'text-white'} flex flex-col items-center justify-center transition border-b-4 ${col.border} active:scale-95 group relative overflow-hidden`}
                >
                  {col.house && (
                    <span className="absolute top-2 left-2 text-[8.5px] font-black uppercase tracking-wider bg-black/25 backdrop-blur-xs px-1.5 py-0.5 rounded">
                      {col.house}
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl font-black drop-shadow mb-1.5 transform group-hover:scale-110 transition">
                    {col.shape}
                  </span>
                  {opt && (
                    <span className="text-xs sm:text-sm font-black text-center line-clamp-2 drop-shadow">
                      {opt.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <p className="text-center text-[11px] text-veh-gold font-bold py-1 flex-shrink-0">
          Bấm nhanh để nhận thêm điểm tốc độ! ⚡
        </p>
      </div>
    );
  }

  // 4. ANSWERED WAITING SCREEN
  if (playerState === 'ANSWERED') {
    const chosenColor = selectedOption !== null ? themeColors[selectedOption] : null;

    return (
      <div className="max-w-md mx-auto p-4 flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center">
        <div className="bg-[#1C2024] border-2 border-veh-gold/70 rounded-3xl p-8 shadow-2xl w-full">
          {chosenColor ? (
            <div className={`w-20 h-20 rounded-2xl ${chosenColor.bg} flex flex-col items-center justify-center mx-auto mb-4 text-3xl shadow-xl ${chosenColor.text || 'text-white'} border-b-4 ${chosenColor.border}`}>
              <span>{chosenColor.shape}</span>
              {chosenColor.house && (
                <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 opacity-90">
                  {chosenColor.house}
                </span>
              )}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-4 text-3xl shadow-xl text-cyan-300">
              ✍️
            </div>
          )}

          <h3 className="text-xl font-black text-white">ĐÃ GỬI ĐÁP ÁN!</h3>
          {submittedValue && (
            <p className="text-sm font-bold text-veh-gold mt-2 bg-black/40 py-2 px-3 rounded-xl border border-gray-800">
              Bạn đã chọn: <span className="text-white">"{submittedValue}"</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Hãy nhìn lên màn hình chiếu để xem kết quả khi hết thời gian...
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-veh-gold animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-veh-gold animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-veh-gold animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // 5. RESULT SCREEN (Green Correct / Red Wrong)
  if (playerState === 'RESULT') {
    const isCorrect = answerResult?.isCorrect;

    return (
      <div className={`max-w-md mx-auto p-4 flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center transition-colors duration-500`}>
        <div className={`w-full rounded-3xl p-8 shadow-2xl border-4 ${
          isCorrect ? 'bg-[#26890c] border-green-300' : 'bg-[#e21b3c] border-red-300'
        }`}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            {isCorrect ? (
              <Check className="w-12 h-12 text-white stroke-[4]" />
            ) : (
              <X className="w-12 h-12 text-white stroke-[4]" />
            )}
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {isCorrect ? 'CHÍNH XÁC!' : 'RẤT TIẾC!'}
          </h2>

          {/* Detailed text submission feedback */}
          {submittedValue && (
            <div className="mt-3 p-3 bg-black/30 rounded-xl text-xs text-white">
              <span className="text-white/80">Bạn đã điền: </span>
              <strong className="underline text-yellow-300">"{submittedValue}"</strong>
              {!isCorrect && revealData?.correctAnswer && (
                <div className="mt-1 text-emerald-200 font-bold">
                  ➔ Đáp án đúng là: <strong>"{revealData.correctAnswer}"</strong>
                </div>
              )}
            </div>
          )}

          {isCorrect && (
            <div className="mt-4 bg-black/20 rounded-2xl p-4 inline-block">
              <span className="text-3xl font-black text-yellow-300 block">
                +{answerResult?.pointsAwarded}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                ĐIỂM THƯỞNG
              </span>
            </div>
          )}

          {answerResult?.streak > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5 text-yellow-300 font-black text-sm">
              <Flame className="w-5 h-5 fill-yellow-400" />
              <span>CHUỖI THẮNG {answerResult.streak} CÂU LIÊN TIẾP!</span>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between text-white text-sm font-bold">
            <span>Tổng điểm hiện tại:</span>
            <span className="text-yellow-300 font-black text-lg">
              {answerResult?.totalScore?.toLocaleString() || 0} đ
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 6. FINAL SCREEN
  if (playerState === 'FINAL') {
    return (
      <div className="max-w-md mx-auto p-4 flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center">
        <div className="bg-[#1C2024] border-2 border-veh-gold rounded-3xl p-8 shadow-2xl w-full">
          <span className="text-6xl mb-3 block animate-bounce">🏆</span>
          <h2 className="text-3xl font-black text-veh-gold">TRẬN ĐẤU KẾT THÚC!</h2>
          <p className="text-sm text-gray-200 mt-2 font-medium">
            Hãy nhìn lên màn hình chiếu để xem bạn có đứng trên bục vinh danh không nhé!
          </p>

          <button
            onClick={() => setPlayerState('JOIN')}
            className="w-full mt-6 py-4 rounded-xl bg-veh-gold text-veh-ink font-black text-base shadow-duo-yellow hover:brightness-110 transition"
          >
            Chơi Vòng Mới
          </button>
        </div>
      </div>
    );
  }

  return null;
}
