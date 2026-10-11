import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, Users, Bot, Trophy, ArrowRight, RotateCcw, Copy, Check, Clock, Flame, Award, Volume2, Sparkles, BookOpen, Wand2, Edit3, Image as ImageIcon, Palette, ChevronDown } from 'lucide-react';
import { KAHOOT_COLORS, ANSWER_THEMES } from '../data/defaultQuizzes';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

export default function HostView({
  socket,
  quizzes,
  selectedQuiz,
  setSelectedQuiz,
  externalPin,
  onOpenAIModal,
  onEditQuiz,
  answerThemeKey = 'vhouse',
  onSelectAnswerTheme,
}) {
  const [pin, setPin] = useState(externalPin || null);
  const [roomState, setRoomState] = useState('INIT'); // INIT, LOBBY, QUESTION, REVEAL, LEADERBOARD, PODIUM
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [revealData, setRevealData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [podium, setPodium] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const currentTheme = ANSWER_THEMES[answerThemeKey] || ANSWER_THEMES.vhouse;
  const themeColors = currentTheme.colors;

  // Host lifecycle socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room:players_updated', ({ players }) => {
      setPlayers(players);
    });

    socket.on('game:question_start', (data) => {
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setTimeRemaining(data.question.timeLimit);
      setAnsweredCount(0);
      setRoomState('QUESTION');
      sound.stopLobbyMusic();
    });

    socket.on('game:timer_tick', ({ timeRemaining }) => {
      setTimeRemaining(timeRemaining);
      if (timeRemaining <= 5 && timeRemaining > 0) {
        sound.playUrgentTick();
      } else if (timeRemaining > 0) {
        sound.playTick();
      }
    });

    socket.on('host:answer_update', ({ answeredCount }) => {
      setAnsweredCount(answeredCount);
      sound.playClick();
    });

    socket.on('game:question_reveal', (data) => {
      setRevealData(data);
      setRoomState('REVEAL');
    });

    socket.on('game:leaderboard', ({ leaderboard }) => {
      setLeaderboard(leaderboard);
      setRoomState('LEADERBOARD');
    });

    socket.on('game:podium', ({ podium }) => {
      setPodium(podium);
      setRoomState('PODIUM');
      sound.playFanfare();
      triggerConfetti();
    });

    return () => {
      socket.off('room:players_updated');
      socket.off('game:question_start');
      socket.off('game:timer_tick');
      socket.off('host:answer_update');
      socket.off('game:question_reveal');
      socket.off('game:leaderboard');
      socket.off('game:podium');
    };
  }, [socket]);

  const triggerConfetti = () => {
    const end = Date.now() + 4 * 1000;
    const colors = ['#ffc600', '#d9531e', '#1368ce', '#26890c', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleCreateRoom = () => {
    if (!socket) return;
    sound.playClick();
    socket.emit('host:create_room', { quiz: selectedQuiz }, ({ success, pin }) => {
      if (success) {
        setPin(pin);
        setRoomState('LOBBY');
        sound.startLobbyMusic();
      }
    });
  };

  const handleAddBots = (count = 3) => {
    if (!socket || !pin) return;
    sound.playClick();
    socket.emit('host:add_bots', { pin, count });
  };

  const handleStartGame = () => {
    if (!socket || !pin) return;
    sound.playClick();
    socket.emit('host:start_game', { pin });
  };

  const handleNext = () => {
    if (!socket || !pin) return;
    sound.playClick();
    socket.emit('host:next', { pin });
  };

  const handleCopyPin = () => {
    if (!pin) return;
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Initial State: Choose Quiz & Create Room
  if (roomState === 'INIT') {
    return (
      <div className="max-w-4xl mx-auto p-2 sm:p-4 text-[#1F2421]">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-[#FFC600]/20 rounded-2xl border-2 border-[#FFC600] mb-3 shadow-sm">
            <Trophy className="w-9 h-9 text-[#1F2421] mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] tracking-tight font-brand">
            TẠO PHÒNG ĐẤU TRƯỜNG TRẮC NGHIỆM
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Chọn bộ câu hỏi của V English House hoặc dùng AI tạo đề tự động trong 5 giây
          </p>
        </div>

        {/* AI Quick Generator Banner */}
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-[#FFC600] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFC600] text-[#1F2421] flex items-center justify-center font-black shadow-duo-yellow flex-shrink-0">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-[#1F2421] font-brand">
                Không muốn nhập câu hỏi thủ công?
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Chỉ cần gõ 1 câu lệnh hoặc dán giáo án – AI V English House sẽ tự động sinh đề thi ngay!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAIModal}
            className="w-full sm:w-auto px-6 py-3 bg-[#FFC600] hover:brightness-105 text-[#1F2421] font-black text-xs rounded-xl shadow-duo-yellow active:scale-95 transition flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Wand2 className="w-4 h-4 fill-current" />
            <span>AI Soạn Đề Tự Động (1 Chạm)</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition transform hover:-translate-y-0.5 ${
                selectedQuiz.id === quiz.id
                  ? 'bg-[#FFFDF6] border-[#FFC600] shadow-md ring-2 ring-[#FFC600]/30'
                  : 'bg-white border-stone-200 text-[#1F2421] hover:border-[#FFC600] shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1F2421]">{quiz.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{quiz.description}</p>
                </div>
                {selectedQuiz.id === quiz.id && (
                  <span className="bg-[#FFC600] text-[#1F2421] text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex-shrink-0 ml-2">
                    ĐÃ CHỌN
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Số câu hỏi: <strong className="text-[#1F2421] font-mono">{quiz.questions.length}</strong></span>
                <div className="flex items-center gap-2">
                  {onEditQuiz && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onEditQuiz(quiz);
                      }}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-[#FFC600]/20 text-[#1F2421] border border-stone-300 hover:border-[#FFC600] rounded-lg font-bold text-xs flex items-center gap-1 transition"
                      title="Chỉnh sửa bộ đề này"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Sửa Đề</span>
                    </button>
                  )}
                  <span className="text-[11px] text-stone-400">{quiz.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleCreateRoom}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#1F2421] hover:bg-black text-white font-black text-lg shadow-xl hover:scale-102 transition transform active:scale-95 flex items-center justify-center gap-3 mx-auto"
          >
            <Play className="w-6 h-6 fill-[#FFC600] text-[#FFC600]" />
            <span>MỞ PHÒNG CHƠI TRÊN MÁY CHIẾU</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. LOBBY State
  if (roomState === 'LOBBY') {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Top Banner with Game PIN */}
        <div className="bg-white border-2 border-[#FFC600] rounded-3xl p-6 shadow-md text-center relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFC600]"></div>

          <p className="text-xs font-black uppercase tracking-widest text-[#A67C1E]">MÃ PIN VÀO PHÒNG TRỰC TIẾP</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-5xl md:text-7xl font-black text-[#1F2421] tracking-wider drop-shadow-sm select-all font-mono">
              {pin}
            </span>
            <button
              type="button"
              onClick={handleCopyPin}
              className="p-3 bg-stone-100 hover:bg-stone-200 text-[#1F2421] rounded-xl transition border border-stone-300"
              title="Sao chép PIN"
            >
              {copied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6 text-[#1F2421]" />}
            </button>
          </div>
          <p className="text-sm text-stone-600 mt-2 font-medium">
            Học viên mở điện thoại hoặc tab khác nhập mã PIN <strong className="text-[#1F2421] font-bold">{pin}</strong> ở trên!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-stone-200">
            <button
              type="button"
              onClick={() => handleAddBots(1)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F2421] rounded-xl text-xs font-bold border border-stone-300 transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#A67C1E]" />
              <span>+1 Bot</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBots(4)}
              className="px-4 py-2 bg-[#FFFDF6] hover:bg-[#FFF9E6] text-[#A67C1E] rounded-xl text-xs font-black border border-[#FFC600] transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#A67C1E]" />
              <span>+4 Bots (Test nhanh)</span>
            </button>
          </div>
        </div>

        {/* Players Waiting Area */}
        <div className="bg-white/80 border border-stone-200/90 rounded-3xl p-6 mb-8 shadow-sm min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A67C1E]" />
              <h3 className="font-bold text-[#1F2421] text-base">
                Học viên đã sẵn sàng ({players.length})
              </h3>
            </div>
            {players.length === 0 && (
              <span className="text-xs text-[#A67C1E] italic animate-pulse font-medium">
                Đang chờ học viên vào phòng...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {players.map((p) => (
              <div
                key={p.id}
                className="bg-stone-50 border border-stone-200 hover:border-[#FFC600] rounded-2xl p-3 flex items-center gap-2.5 animate-bounce-short shadow-sm transition"
              >
                <span className="text-2xl">{p.avatar}</span>
                <div className="overflow-hidden">
                  <p className="font-black text-sm text-[#1F2421] truncate">{p.name}</p>
                  {p.isBot && <span className="text-[10px] text-[#A67C1E] font-black">BOT</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleStartGame}
            disabled={players.length === 0}
            className={`px-12 py-4 rounded-2xl font-black text-xl transition transform active:scale-95 flex items-center justify-center gap-3 mx-auto shadow-xl ${
              players.length > 0
                ? 'bg-[#1F2421] hover:bg-black text-[#FFC600] cursor-pointer ring-2 ring-[#FFC600]/40'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className="w-7 h-7 fill-[#FFC600] text-[#FFC600]" />
            <span>BẮT ĐẦU TRẬN ĐẤU ({players.length} người)</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. QUESTION & REVEAL Screens (Kahoot Projector Layout matching Image 1)
  if (roomState === 'QUESTION' || roomState === 'REVEAL') {
    const isReveal = roomState === 'REVEAL';
    const totalVotes = revealData?.answerStats.reduce((a, b) => a + b, 0) || 1;

    return (
      <div className="max-w-[1400px] mx-auto p-2 sm:p-4 md:p-6 flex flex-col min-h-[calc(100vh-80px)] justify-between select-none">
        {/* Top Header: Floating Question Card (Image 1) */}
        <div className="relative mb-3">
          <div className="bg-white text-gray-900 rounded-3xl p-5 md:p-7 text-center shadow-2xl border-4 border-vhouse-gold/50 relative max-w-4xl mx-auto">
            {/* Top Question Tracker & Type Badge & Theme Selector */}
            <div className="flex flex-wrap items-center justify-between text-xs font-black uppercase text-gray-500 mb-2 border-b border-gray-100 pb-2 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span>CÂU HỎI {questionIndex + 1} / {totalQuestions}</span>
                {currentQuestion?.type === 'blank' && (
                  <span className="bg-cyan-100 text-cyan-800 border border-cyan-300 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    ✍️ ĐIỀN TỪ (TYPE IN)
                  </span>
                )}
                {currentQuestion?.type === 'true_false' && (
                  <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    ⚖️ ĐÚNG / SAI (TRUE/FALSE)
                  </span>
                )}
                {currentQuestion?.type === 'scramble' && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    🧩 SẮP XẾP TỪ (SCRAMBLE)
                  </span>
                )}
                {(!currentQuestion?.type || currentQuestion?.type === 'choice') && (
                  <span className="bg-stone-100 text-[#1F2421] border border-stone-300 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    🔘 TRẮC NGHIỆM
                  </span>
                )}

                {/* Theme Selector Pill */}
                {(!currentQuestion?.type || currentQuestion?.type === 'choice') && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowThemeMenu(!showThemeMenu)}
                      className="px-2.5 py-0.5 bg-[#FFFDF6] hover:bg-[#FFF9E6] text-[#A67C1E] border border-[#FFC600] rounded-full font-bold text-[10px] flex items-center gap-1 transition shadow-xs"
                      title="Đổi bộ màu 4 ô trả lời"
                    >
                      <Palette className="w-3 h-3 text-[#A67C1E]" />
                      <span>{currentTheme.shortName}</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    {showThemeMenu && (
                      <div className="absolute left-0 top-full mt-1.5 bg-white border border-stone-200 rounded-2xl p-2 shadow-2xl z-50 w-72 text-left">
                        <span className="text-[10px] font-black uppercase text-stone-400 block px-2 py-1">
                          ĐỔI BỘ MÀU 4 Ô TRẢ LỜI
                        </span>
                        <div className="space-y-1">
                          {Object.values(ANSWER_THEMES).map((th) => (
                            <button
                              key={th.id}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                if (onSelectAnswerTheme) onSelectAnswerTheme(th.id);
                                setShowThemeMenu(false);
                              }}
                              className={`w-full p-2 rounded-xl text-xs flex items-center justify-between transition ${
                                th.id === currentTheme.id
                                  ? 'bg-[#FFFDF6] border border-[#FFC600] text-[#1F2421] font-black'
                                  : 'hover:bg-stone-50 text-stone-700'
                              }`}
                            >
                              <div>
                                <div className="font-bold flex items-center gap-1.5 text-xs text-[#1F2421]">
                                  <span>{th.name}</span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {th.colors.map((c, i) => (
                                    <div
                                      key={i}
                                      className={`w-4 h-4 rounded-md ${c.bg} ${c.text || 'text-white'} flex items-center justify-center font-black text-[9px] border border-black/10`}
                                    >
                                      {c.shape}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {th.id === currentTheme.id && <Check className="w-4 h-4 text-[#A67C1E] stroke-[3]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-vhouse-gold" />
                <span className="text-gray-700">Đã trả lời: <strong className="text-vhouse-dark">{answeredCount}</strong> / {players.length}</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-snug font-brand text-gray-900 max-h-48 overflow-y-auto px-2">
              {currentQuestion?.text && currentQuestion.text.includes('___') ? (
                <span>
                  {currentQuestion.text.split(/_{3,}/).map((part, idx, arr) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < arr.length - 1 && (
                        isReveal ? (
                          <span className="inline-block px-4 py-1 mx-1.5 bg-emerald-500 text-white rounded-xl font-mono text-lg sm:text-2xl font-black shadow-md border-2 border-emerald-400 animate-bounce-short">
                            ✨ {revealData?.correctAnswer || currentQuestion?.options?.find(o => o.isCorrect)?.text} ✨
                          </span>
                        ) : (
                          <span className="inline-block px-4 py-1 mx-1.5 bg-amber-500/20 border-2 border-dashed border-amber-500 text-amber-700 rounded-xl font-mono text-base sm:text-xl font-black animate-pulse shadow-inner">
                            [ ????? ]
                          </span>
                        )
                      )}
                    </React.Fragment>
                  ))}
                </span>
              ) : (
                currentQuestion?.text
              )}
            </h2>

            {/* Pronunciation Voice Button */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => speech.speak(currentQuestion?.originalSentence || currentQuestion?.text)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-vhouse-gold/20 text-gray-800 rounded-full font-bold text-xs flex items-center gap-1.5 transition border border-gray-300 shadow-sm active:scale-95"
                title="Nghe phát âm Google Voice"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Phát âm (Google Voice)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Middle Stage (Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch my-2">
          {/* LEFT COLUMN: Join Box with QR Code (Image 1) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-between bg-white border border-stone-200/90 rounded-3xl p-4 shadow-sm text-center">
            <span className="text-xs font-black uppercase tracking-widest text-stone-500">Tham Gia</span>

            {/* High-Contrast QR Code Graphic */}
            <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 w-32 h-32 flex items-center justify-center my-3 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" />
                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" />
                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" />
                <rect x="40" y="10" width="20" height="10" />
                <rect x="40" y="30" width="10" height="20" />
                <rect x="60" y="40" width="20" height="10" />
                <rect x="35" y="65" width="15" height="15" />
                <rect x="65" y="65" width="25" height="10" />
                <rect x="75" y="80" width="15" height="15" />
              </svg>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Game PIN</span>
              <span className="text-2xl font-black text-[#1F2421] font-mono tracking-wider">
                {pin || '815 493'}
              </span>
              <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                Vào qua localhost:3000 hoặc quét mã QR
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Live Bar Chart / Timer + 4 Kahoot Options (Image 1) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            {/* When QUESTION is running: Circular countdown timer + Illustration Image */}
            {!isReveal && (
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 py-4">
                {currentQuestion?.image && (
                  <div className="relative max-h-52 rounded-2xl overflow-hidden border-2 border-vhouse-gold/40 shadow-2xl bg-black/50 flex justify-center">
                    <img
                      src={currentQuestion.image}
                      alt="Minh họa câu hỏi"
                      className="max-h-44 md:max-h-52 object-contain rounded-2xl"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-black/75 backdrop-blur-sm rounded-full text-[10px] text-vhouse-gold font-bold border border-vhouse-gold/30">
                      🎨 Minh họa AI
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-vhouse-gold to-amber-500 border-4 border-[#1C2024] shadow-2xl flex items-center justify-center transform hover:scale-105 transition">
                    <span className={`font-black text-4xl sm:text-5xl text-vhouse-dark ${timeRemaining <= 5 ? 'text-red-700 animate-ping' : ''}`}>
                      {timeRemaining}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">
                    {timeRemaining}s còn lại
                  </span>
                </div>
              </div>
            )}

            {/* When REVEAL is active: Vertical 3D Bar Charts (Image 1) */}
            {isReveal && (
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-2">
                {currentQuestion?.image && (
                  <div className="hidden md:block relative max-h-48 rounded-2xl overflow-hidden border border-vhouse-gold/30 shadow-lg bg-black/40">
                    <img
                      src={currentQuestion.image}
                      alt="Minh họa câu hỏi"
                      className="max-h-40 object-contain rounded-xl"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div className="flex items-end justify-center gap-4 sm:gap-8 h-48 sm:h-56 px-4 pb-2 border-b-2 border-gray-800">
                  {currentQuestion?.options.map((opt, idx) => {
                    const color = themeColors[idx] || KAHOOT_COLORS[idx];
                    const voteCount = revealData?.answerStats[idx] || 0;
                    const percent = Math.round((voteCount / totalVotes) * 100);
                    const isCorrect = idx === revealData?.correctOptionIndex;
                    const barHeight = Math.max(28, Math.round((percent / 100) * 160));

                    return (
                      <div key={idx} className="flex flex-col items-center w-16 sm:w-24 transition-all duration-700">
                        {/* Vote count on top of bar */}
                        <span className="text-base sm:text-lg font-black text-[#1F2421] mb-1.5 animate-bounce-short">
                          {voteCount}
                        </span>

                        {/* Animated Vertical Column */}
                        <div
                          className={`w-full rounded-t-2xl flex flex-col justify-between items-center p-2 shadow-2xl transition-all duration-1000 relative border-t-2 border-white/40 ${color.bg}`}
                          style={{ height: `${barHeight}px` }}
                        >
                          {isCorrect && (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black shadow-lg -mt-4 animate-pulse border-2 border-emerald-500">
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                          )}
                          <div className="mt-auto flex flex-col items-center text-white/90">
                            <span className="text-lg sm:text-xl font-black">{color.shape}</span>
                            {color.house && (
                              <span className="text-[8px] font-black uppercase tracking-wider opacity-90">{color.house}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FORMAT 1: FILL IN THE BLANK (TYPE IN) */}
            {currentQuestion?.type === 'blank' && (
              <div className="space-y-3">
                {!isReveal ? (
                  <div className="bg-[#1C2024] border-2 border-cyan-500/50 rounded-2xl p-6 text-center shadow-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/60 border border-cyan-500/40 rounded-full text-cyan-300 font-black text-xs uppercase tracking-wider mb-3">
                      <span>✍️ Dạng Bài: Điền Từ Vào Chỗ Trống</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Học viên đang gõ đáp án vào ô trống trên thiết bị của mình...
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Đã nộp bài: <strong className="text-cyan-400 text-sm">{answeredCount}</strong> / {players.length} bạn
                    </p>
                    <div className="mt-4 flex justify-center items-center gap-2">
                      <span className="text-xs text-gray-500 font-bold">Gợi ý độ dài:</span>
                      <span className="font-mono text-xs px-2.5 py-1 bg-black/60 border border-gray-700 rounded-lg text-vhouse-gold font-bold">
                        {(currentQuestion.correctAnswer || currentQuestion.options?.find(o => o.isCorrect)?.text || '').length} ký tự
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-emerald-950/80 via-[#1C2024] to-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-6 text-center shadow-2xl animate-fade-in">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block mb-1">
                      ĐÁP ÁN CHÍNH XÁC
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-center justify-center gap-2 my-2">
                      <span className="px-5 py-2 bg-emerald-600 rounded-xl shadow-lg border-2 border-emerald-400">
                        {revealData?.correctAnswer || currentQuestion.options?.find(o => o.isCorrect)?.text}
                      </span>
                    </div>
                    {revealData?.acceptableAnswers && revealData.acceptableAnswers.length > 1 && (
                      <p className="text-xs text-emerald-300/80 mt-2 font-medium">
                        (Chấp nhận các biến thể hợp lệ: <code className="bg-black/40 px-2 py-0.5 rounded">{revealData.acceptableAnswers.join(', ')}</code>)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* FORMAT 2: TRUE / FALSE */}
            {currentQuestion?.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { text: 'ĐÚNG (True)', bg: 'bg-[#1368ce]', border: 'border-blue-700', shape: '✔', isTrue: true },
                  { text: 'SAI (False)', bg: 'bg-[#e21b3c]', border: 'border-red-700', shape: '✖', isTrue: false },
                ].map((tf, idx) => {
                  const isCorrect = isReveal && currentQuestion.options[idx]?.isCorrect;
                  const isDimmed = isReveal && !isCorrect;
                  return (
                    <div
                      key={idx}
                      className={`${tf.bg} text-white p-5 rounded-2xl flex items-center justify-between shadow-xl border-b-4 ${tf.border} transition ${
                        isCorrect ? 'ring-4 ring-emerald-400 scale-102 border-white' : isDimmed ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">{tf.shape}</span>
                        <span className="text-lg sm:text-xl font-black">{tf.text}</span>
                      </div>
                      {isCorrect && (
                        <span className="bg-white text-emerald-700 text-xs font-black px-3 py-1 rounded-full shadow flex items-center gap-1">
                          <Check className="w-4 h-4 stroke-[3]" /> ĐÚNG
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* FORMAT 3: SENTENCE SCRAMBLE */}
            {currentQuestion?.type === 'scramble' && (
              <div className="bg-[#1C2024] border-2 border-amber-500/50 rounded-2xl p-6 text-center shadow-xl">
                {!isReveal ? (
                  <div>
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider block mb-2">
                      🧩 CÁC TỪ CẦN SẮP XẾP LẠI THÀNH CÂU:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 my-3">
                      {(currentQuestion.scrambledWords || []).map((w, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-xl font-bold text-white text-sm shadow">
                          {w}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Học viên đang chạm các từ để ghép thành câu đúng trên thiết bị...
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block mb-1">
                      CÂU HOÀN CHỈNH CHÍNH XÁC:
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-white font-brand my-2">
                      "{currentQuestion.originalSentence || currentQuestion.text}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FORMAT 4: MULTIPLE CHOICE (V ENGLISH HOUSE 4 HOUSES / KAHOOT CARDS) */}
            {(!currentQuestion?.type || currentQuestion?.type === 'choice') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion?.options.map((opt, idx) => {
                  const color = themeColors[idx] || KAHOOT_COLORS[idx];
                  const isCorrect = isReveal && idx === revealData?.correctOptionIndex;
                  const isDimmed = isReveal && !isCorrect;

                  return (
                    <div
                      key={idx}
                      className={`${color.bg} ${color.text || 'text-white'} p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl border-b-4 ${color.border} transition transform ${
                        isCorrect
                          ? 'ring-4 ring-emerald-400 scale-102 border-white'
                          : isDimmed
                          ? 'opacity-40'
                          : 'hover:brightness-105'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-black/20 flex flex-col items-center justify-center font-black flex-shrink-0 shadow-inner">
                          <span className="text-xl leading-none">{color.shape}</span>
                          {color.house && (
                            <span className="text-[8px] font-black uppercase tracking-wider opacity-90 mt-0.5">
                              {color.house}
                            </span>
                          )}
                        </div>
                        <div>
                          {color.house && (
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-80 block">
                              NHÀ {color.house}
                            </span>
                          )}
                          <span className="text-base sm:text-lg font-bold tracking-tight">
                            {opt.text}
                          </span>
                        </div>
                      </div>

                      {isCorrect && (
                        <span className="bg-white text-emerald-700 text-xs font-black px-3 py-1 rounded-full shadow flex items-center gap-1 flex-shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" /> ĐÚNG
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Teaching Notes on Reveal */}
            {isReveal && revealData?.explanation && (
              <div className="p-4 bg-[#FFFDF6] border-2 border-[#FFC600] rounded-2xl shadow-sm text-left animate-fade-in">
                <div className="flex items-center gap-2 mb-1 text-[#A67C1E] font-black text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Ghi Chú Sư Phạm & Ngữ Pháp (V English House)</span>
                </div>
                <p className="text-stone-800 text-xs sm:text-sm font-medium leading-relaxed">
                  {revealData.explanation}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Participants Live Sidebar (Image 1) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col bg-white border border-stone-200/90 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-stone-150 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500">Học Viên</span>
              <span className="text-xs font-black text-[#A67C1E]">({players.length})</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1 flex-1">
              {players.length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-400">Chưa có người chơi</div>
              ) : (
                players
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 10)
                  .map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                          idx === 0 ? 'bg-[#FFC600] text-[#1F2421]' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-[#1F2421] font-bold truncate max-w-[85px]">{p.name}</span>
                      </div>
                      <span className="text-[#A67C1E] font-mono font-black">{p.score}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar Controls */}
        {isReveal && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={handleNext}
              className="px-10 py-3.5 rounded-2xl bg-vhouse-gold hover:brightness-110 text-vhouse-dark font-black text-base shadow-duo-yellow transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <span>{questionIndex < totalQuestions - 1 ? 'CÂU TIẾP THEO' : 'XEM BẢNG XẾP HẠNG CHUNG CUỘC'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 5. LEADERBOARD Screen
  if (roomState === 'LEADERBOARD') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-80px)] justify-between select-none">
        <div className="text-center mb-6">
          <div className="inline-block p-2 bg-[#FFFDF6] rounded-xl mb-2 border border-[#FFC600]">
            <Trophy className="w-8 h-8 text-[#A67C1E] mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1F2421] tracking-tight font-brand">
            BẢNG XẾP HẠNG TẠM THỜI
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Sau câu hỏi {questionIndex + 1}/{totalQuestions}
          </p>
        </div>

        {/* Top 5 Leaderboard List */}
        <div className="space-y-3 my-auto max-w-2xl mx-auto w-full">
          {leaderboard.slice(0, 5).map((player, rank) => (
            <div
              key={player.id}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-500 shadow-sm border-2 ${
                rank === 0
                  ? 'bg-[#FFFDF6] border-[#FFC600] shadow-md ring-2 ring-[#FFC600]/20'
                  : rank === 1
                  ? 'bg-white border-slate-300'
                  : rank === 2
                  ? 'bg-white border-amber-300'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                  rank === 0 ? 'bg-[#FFC600] text-[#1F2421]' : 'bg-stone-100 text-stone-700'
                }`}>
                  #{rank + 1}
                </span>
                <span className="text-2xl">{player.avatar}</span>
                <div>
                  <h4 className="font-black text-[#1F2421] text-base flex items-center gap-2">
                    {player.name}
                    {player.streak > 1 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-white" /> {player.streak}
                      </span>
                    )}
                  </h4>
                  {player.isBot && <span className="text-[10px] text-[#A67C1E] font-black">BOT</span>}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-[#A67C1E] font-mono">
                  {player.score.toLocaleString()}
                </span>
                <span className="text-[10px] block text-stone-400 uppercase font-bold">Điểm</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            type="button"
            onClick={handleNext}
            className="px-10 py-4 rounded-2xl bg-[#1F2421] hover:bg-black text-[#FFC600] font-black text-lg shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <span>{questionIndex < totalQuestions - 1 ? 'CÂU TIẾP THEO' : 'XEM KẾT QUẢ CHUNG CUỘC'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 6. PODIUM Screen (3D Olympic Podium matching Image 2)
  if (roomState === 'PODIUM') {
    const first = podium[0];
    const second = podium[1];
    const third = podium[2];

    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-80px)] justify-between select-none">
        {/* Kahoot-Style Space Theme Banner (Image 2) */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#1F2421] border border-stone-200 font-black text-xs sm:text-sm shadow-sm mb-3">
            <span>🚀 V English House - Vinh Danh Chiến Binh Xuất Sắc</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2421] tracking-tight drop-shadow-sm font-display">
            🎉 BỤC VINH DANH QUÁN QUÂN 🎉
          </h2>
          <p className="text-stone-600 mt-1 font-medium text-xs sm:text-sm">
            Chúc mừng các chiến binh xuất sắc nhất! Pháo hoa giấy bùng nổ chúc mừng!
          </p>
        </div>

        {/* 3D Olympic Podium Blocks (Image 2) */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 my-auto max-w-2xl mx-auto w-full pt-16">
          {/* 2nd Place (Left) */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <div className="text-center mb-2">
                <span className="text-4xl block animate-bounce-short">🎧 {second.avatar}</span>
                <p className="font-black text-sm text-[#1F2421] truncate max-w-[100px] mt-1">{second.name}</p>
                <p className="text-xs text-[#A67C1E] font-black font-mono">{second.score.toLocaleString()} đ</p>
              </div>
              {/* Podium Block 2 */}
              <div className="w-full bg-gradient-to-b from-stone-100 to-stone-200 h-36 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-slate-400 shadow-md relative">
                {/* Pentagon Badge 2 (Image 2) */}
                <div className="w-10 h-10 bg-slate-500 text-white font-black rounded-xl flex items-center justify-center text-xl shadow-md mb-1 border-2 border-white">
                  2
                </div>
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">HẠNG NHÌ</span>
              </div>
            </div>
          )}

          {/* 1st Place (Center & Tallest - Image 2) */}
          {first && (
            <div className="flex-1 flex flex-col items-center -mt-10">
              <div className="text-center mb-2">
                <div className="relative inline-block">
                  <Award className="w-9 h-9 text-[#A67C1E] absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce" />
                  <span className="text-6xl block">🐯 {first.avatar}</span>
                </div>
                <p className="font-black text-base text-[#1F2421] truncate max-w-[130px] mt-1">
                  {first.name}
                </p>
                <p className="text-sm text-[#A67C1E] font-black font-mono">{first.score.toLocaleString()} đ</p>
              </div>
              {/* Podium Block 1 */}
              <div className="w-full bg-gradient-to-b from-[#FFFDF6] to-[#FFF3C2] h-56 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-[#FFC600] shadow-xl relative ring-2 ring-[#FFC600]/40">
                {/* Pentagon Badge 1 (Image 2) */}
                <div className="w-12 h-12 bg-[#FFC600] text-[#1F2421] font-black rounded-xl flex items-center justify-center text-2xl shadow-xl mb-1 border-2 border-yellow-200">
                  1
                </div>
                <span className="text-xs font-black text-[#A67C1E] uppercase tracking-widest">QUÁN QUÂN</span>
              </div>
            </div>
          )}

          {/* 3rd Place (Right) */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <div className="text-center mb-2">
                <span className="text-4xl block">🦊 {third.avatar}</span>
                <p className="font-black text-sm text-[#1F2421] truncate max-w-[100px] mt-1">{third.name}</p>
                <p className="text-xs text-[#A67C1E] font-black font-mono">{third.score.toLocaleString()} đ</p>
              </div>
              {/* Podium Block 3 */}
              <div className="w-full bg-gradient-to-b from-amber-50 to-amber-100 h-28 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-amber-600 shadow-md relative">
                {/* Pentagon Badge 3 (Image 2) */}
                <div className="w-10 h-10 bg-amber-600 text-white font-black rounded-xl flex items-center justify-center text-xl shadow-md mb-1 border-2 border-amber-300">
                  3
                </div>
                <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">HẠNG BA</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Restart */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setRoomState('INIT');
              sound.playClick();
            }}
            className="px-10 py-4 rounded-2xl bg-[#1F2421] hover:bg-black text-[#FFC600] font-black text-base shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5 text-[#FFC600]" />
            <span>MỞ VÒNG CHƠI MỚI</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
