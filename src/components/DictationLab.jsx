import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play, Pause, RotateCcw, Volume2, Mic, MicOff, Check, X,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Eye, EyeOff,
  Flame, Award, BookOpen, Sparkles, Layers, List, Repeat,
  HelpCircle, ExternalLink, RefreshCw, Video, VolumeX
} from 'lucide-react';
import {
  DOL_DICTATION_LESSONS,
  cleanForCompare,
  generateDolMaskedHint
} from '../data/dolDictationLessons';
import { speech } from '../utils/speech';
import { sound } from '../utils/sound';

export default function DictationLab({ currentQuiz }) {
  // Lessons state
  const [lessons, setLessons] = useState(DOL_DICTATION_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState('marching_band');
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // Difficulty & Settings
  const [difficultyMode, setDifficultyMode] = useState('EASY'); // 'EASY' | 'HARD'
  const [selectedHouse, setSelectedHouse] = useState('LEADER');

  // Input & Checking State
  const [userTypedText, setUserTypedText] = useState('');
  const [isCheckSubmitted, setIsCheckSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState(0);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 1.0, 0.75, 1.25, 0.5
  const [isLooping, setIsLooping] = useState(false);

  // Accordion Expand/Collapse States (Open by default matching screenshots)
  const [isScriptOpen, setIsScriptOpen] = useState(true);
  const [isVocabOpen, setIsVocabOpen] = useState(true);
  const [isSentenceListOpen, setIsSentenceListOpen] = useState(false);

  // Speech Recognition (Microphone) State
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);

  // House Power-Up Stats
  const [powerUpPoints, setPowerUpPoints] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  // Word tooltip audio state
  const [activeWordPlaying, setActiveWordPlaying] = useState(null);

  const textareaRef = useRef(null);
  const audioElementRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const activeSentence = activeLesson.sentences[sentenceIndex] || activeLesson.sentences[0];
  const totalSentences = activeLesson.sentences.length;

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechRecognitionSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');
          setUserTypedText(transcript);
        };

        recog.onerror = () => {
          setIsListeningMic(false);
        };

        recog.onend = () => {
          setIsListeningMic(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  // Reset state when sentence changes
  useEffect(() => {
    setUserTypedText('');
    setIsCheckSubmitted(false);
    setIsCorrect(false);
    setIsRevealed(false);
    setAudioCurrentTime(0);
    setIsPlaying(false);
    speech.stop();
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    if (textareaRef.current) textareaRef.current.focus();
  }, [activeLessonId, sentenceIndex]);

  // Audio Playback simulation / stream
  const handlePlayAudio = () => {
    sound.playClick();
    if (isPlaying) {
      handlePauseAudio();
      return;
    }

    setIsPlaying(true);
    speech.stop();

    // Use Studio pronunciation stream with specified playback speed
    speech.speak(activeSentence.text, 'en-US', playbackSpeed);

    // Audio timer animation
    const duration = activeSentence.audioDuration || 4.0;
    const intervalTime = 100;
    const increment = (intervalTime / 1000) * playbackSpeed;

    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);

    audioIntervalRef.current = setInterval(() => {
      setAudioCurrentTime((prev) => {
        const next = prev + increment;
        if (next >= duration) {
          if (isLooping) {
            speech.speak(activeSentence.text, 'en-US', playbackSpeed);
            return 0;
          }
          clearInterval(audioIntervalRef.current);
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, intervalTime);
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
    speech.stop();
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  };

  const handleRewindAudio = () => {
    sound.playClick();
    speech.stop();
    setAudioCurrentTime(0);
    setIsPlaying(false);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  };

  const handleSeekAudio = (e) => {
    const newTime = parseFloat(e.target.value);
    setAudioCurrentTime(newTime);
  };

  // Toggle Speech to Text
  const handleToggleMic = () => {
    if (!speechRecognitionSupported || !recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Hãy gõ phím vào ô nhập nhé!');
      return;
    }

    sound.playClick();
    if (isListeningMic) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListeningMic(true);
      } catch (err) {
        setIsListeningMic(false);
      }
    }
  };

  // Click on a single word in transcript to listen to its pronunciation
  const handleWordClick = (word) => {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '').trim();
    if (!cleanWord) return;
    setActiveWordPlaying(cleanWord);
    speech.speak(cleanWord, 'en-US', 0.9);
    setTimeout(() => setActiveWordPlaying(null), 1000);
  };

  // Check Accuracy Submission (Matching exact DOL English algorithm)
  const handleCheck = () => {
    sound.playClick();
    setIsCheckSubmitted(true);

    const userNormalized = cleanForCompare(userTypedText);
    const targetNormalized = cleanForCompare(activeSentence.text);

    const targetWords = targetNormalized.split(' ').filter(Boolean);
    const userWords = userNormalized.split(' ').filter(Boolean);

    let matches = 0;
    targetWords.forEach((tw, idx) => {
      if (userWords[idx] === tw) {
        matches++;
      }
    });

    const calculatedAccuracy = Math.round((matches / Math.max(1, targetWords.length)) * 100);
    setAccuracyScore(calculatedAccuracy);

    // Exact check condition
    const isAllMatch = userNormalized === targetNormalized || calculatedAccuracy === 100;

    if (isAllMatch) {
      setIsCorrect(true);
      sound.playFanfare();
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 }
      });
      setPowerUpPoints((p) => p + 15);
      setStreakCount((s) => s + 1);
    } else {
      setIsCorrect(false);
      sound.playWrong();
      setStreakCount(0);
    }
  };

  // Re-attempt button ("Làm lại")
  const handleRetry = () => {
    sound.playClick();
    setIsCheckSubmitted(false);
    setIsCorrect(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    sound.playClick();
    if (sentenceIndex < totalSentences - 1) {
      setSentenceIndex((prev) => prev + 1);
    } else {
      alert(`🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ ${totalSentences} câu chép chính tả của bài học này!`);
      setSentenceIndex(0);
    }
  };

  // Previous Question
  const handlePrevQuestion = () => {
    sound.playClick();
    if (sentenceIndex > 0) {
      setSentenceIndex((prev) => prev - 1);
    }
  };

  // Handle Enter Key Press in Textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isCheckSubmitted && isCorrect) {
        handleNextQuestion();
      } else if (!isCheckSubmitted) {
        handleCheck();
      } else {
        handleCheck();
      }
    }
  };

  // Format seconds to MM:SS
  const formatSeconds = (sec) => {
    const s = Math.floor(sec || 0);
    const mins = Math.floor(s / 60);
    const remSecs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  // Generate Masked Hint
  const maskedResult = generateDolMaskedHint(
    activeSentence.text,
    userTypedText,
    difficultyMode === 'EASY'
  );

  return (
    <div className="max-w-4xl mx-auto py-2 px-3 sm:px-6 select-none font-sans text-stone-800 space-y-4">
      {/* ==================================================================== */}
      {/* TOP HEADER: Breadcrumb, Title & Meta matching Screenshot 1 */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* DOL / V-House Brand Logo Pill */}
          <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
            DOL
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#1F2421] tracking-tight">
                {activeLesson.title}
              </h1>
              <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full border border-stone-200">
                {activeLesson.level}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
              <span>Audio · {totalSentences} câu</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">Chuẩn đề thi & Native voice</span>
            </div>
          </div>
        </div>

        {/* Right Menu Controls */}
        <div className="flex items-center gap-2">
          {/* Sentence List Drawer Button */}
          <button
            type="button"
            onClick={() => setIsSentenceListOpen(!isSentenceListOpen)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition"
            title="Danh sách câu trong bài"
          >
            <List className="w-3.5 h-3.5" />
            <span>Danh sách ({totalSentences})</span>
          </button>

          {/* House Power-Up Badge */}
          <div className="bg-[#FFFDF6] border border-[#FFC600] px-3 py-1.5 rounded-xl text-xs font-black text-[#A67C1E] flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>+{powerUpPoints} PU</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SENTENCE LIST MODAL / DRAWER (If student wants to jump to any sentence) */}
      {/* ==================================================================== */}
      {isSentenceListOpen && (
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-xl space-y-3 animate-slide-down">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-black uppercase text-stone-500">
              Chọn câu chép chính tả (1 - {totalSentences}):
            </span>
            <button
              type="button"
              onClick={() => setIsSentenceListOpen(false)}
              className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
            {activeLesson.sentences.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setSentenceIndex(idx);
                  setIsSentenceListOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition text-left border ${
                  sentenceIndex === idx
                    ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm font-black'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>Câu {idx + 1}</span>
                <span className="block text-[10px] opacity-80">{st.wordCount} từ</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN DICTATION CARD (Matching Screenshot 1 & Screenshot 3) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
        {/* Navigation Bar: Arrow Left, Câu X/Y, Arrow Right, Word Count, EASY/HARD */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={sentenceIndex === 0}
              className={`p-1.5 rounded-xl border transition ${
                sentenceIndex === 0
                  ? 'border-stone-100 text-stone-300 cursor-not-allowed'
                  : 'border-stone-200 text-stone-700 hover:bg-stone-100 active:scale-95'
              }`}
              title="Câu trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-black text-sm sm:text-base text-[#1F2421]">
              Câu {sentenceIndex + 1}/{totalSentences}
            </span>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={sentenceIndex === totalSentences - 1}
              className={`p-1.5 rounded-xl border transition ${
                sentenceIndex === totalSentences - 1
                  ? 'border-stone-100 text-stone-300 cursor-not-allowed'
                  : 'border-stone-200 text-stone-700 hover:bg-stone-100 active:scale-95'
              }`}
              title="Câu sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-stone-400">
              ➔ {activeSentence.wordCount} từ
            </span>
          </div>

          {/* Mode Pill: EASY | HARD matching screenshot */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setDifficultyMode('EASY');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                difficultyMode === 'EASY'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              EASY
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setDifficultyMode('HARD');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                difficultyMode === 'HARD'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              HARD
            </button>
          </div>
        </div>

        {/* AUDIO CONTROLLER BAR matching Screenshots */}
        <div className="flex items-center gap-3 sm:gap-4 py-1">
          {/* Big Red Circular Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayAudio}
            className="w-12 h-12 rounded-full bg-[#E11D48] hover:bg-rose-700 text-white flex items-center justify-center shadow-md active:scale-95 transition flex-shrink-0"
            title={isPlaying ? 'Tạm dừng audio' : 'Phát âm thanh câu này'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Rewind Button */}
          <button
            type="button"
            onClick={handleRewindAudio}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
            title="Nghe lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Scrubber Bar */}
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={activeSentence.audioDuration || 4.0}
              step="0.1"
              value={audioCurrentTime}
              onChange={handleSeekAudio}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
            />
            <span className="text-xs font-mono font-bold text-stone-400 whitespace-nowrap">
              {formatSeconds(audioCurrentTime)}/{formatSeconds(activeSentence.audioDuration || 4.0)}
            </span>
          </div>

          {/* Speed Multiplier Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const speeds = [1.0, 0.75, 1.25, 0.5];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
                sound.playClick();
              }}
              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 flex-shrink-0 transition"
              title="Tốc độ phát âm thanh"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Loop Button */}
          <button
            type="button"
            onClick={() => {
              setIsLooping(!isLooping);
              sound.playClick();
            }}
            className={`p-2 rounded-xl transition ${
              isLooping
                ? 'bg-rose-50 text-[#E11D48] border border-rose-200'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            title={isLooping ? 'Đang bật lặp lại tự động' : 'Bật lặp lại tự động'}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* INPUT BOX matching Screenshot 1 & 3 */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={4}
            value={userTypedText}
            onChange={(e) => setUserTypedText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Lắng nghe và gõ lại từng từ tiếng Anh vào đây..."
            className={`w-full rounded-2xl p-4 sm:p-5 text-sm sm:text-base font-bold outline-none leading-relaxed transition resize-none ${
              isCheckSubmitted
                ? isCorrect
                  ? 'bg-emerald-50/40 border-2 border-emerald-500 text-emerald-700'
                  : 'bg-rose-50/50 border-2 border-rose-400 text-rose-600'
                : 'bg-stone-50/50 border-2 border-stone-200 focus:border-blue-500 focus:bg-white text-stone-800'
            }`}
          />

          {/* Microphone Icon Button on Bottom Right */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`absolute bottom-3 right-3 p-2 rounded-xl transition ${
              isListeningMic
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            title="Đọc bằng giọng nói (Microphone speech-to-text)"
          >
            {isListeningMic ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>

        {/* ==================================================================== */}
        {/* CHECK & FEEDBACK AREA (THE CORE FEATURE requested by user) */}
        {/* ==================================================================== */}
        {/* CASE 1: INCORRECT STATE (Matching Screenshot 1) */}
        {isCheckSubmitted && !isCorrect && (
          <div className="space-y-3 animate-fade-in">
            {/* Red Alert Banner */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600">
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                ✕
              </span>
              <span>Chưa đúng! Bạn xem gợi ý để làm lại nhé!</span>
            </div>

            {/* Masked Sentence with asterisks matching Screenshot 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-mono text-sm sm:text-base tracking-wide leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {isRevealed ? (
                  <span className="font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded">
                    {activeSentence.text}
                  </span>
                ) : (
                  maskedResult.parts.map((part, idx) => (
                    <span
                      key={idx}
                      className={
                        part.isCorrect
                          ? 'text-emerald-600 font-bold'
                          : 'text-stone-500 font-bold'
                      }
                    >
                      {part.text}
                    </span>
                  ))
                )}
              </div>

              {/* Action Buttons: Reveal Eye, Làm lại, Kiểm tra */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Reveal Eye Button */}
                <button
                  type="button"
                  onClick={() => setIsRevealed(!isRevealed)}
                  className={`p-2.5 rounded-xl border transition ${
                    isRevealed
                      ? 'bg-rose-50 text-[#E11D48] border-rose-300'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                  title={isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Làm lại Button */}
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
                >
                  Làm lại
                </button>

                {/* Kiểm tra Button */}
                <button
                  type="button"
                  onClick={handleCheck}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95"
                >
                  Kiểm tra
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: CORRECT STATE (Matching Screenshot 3) */}
        {isCheckSubmitted && isCorrect && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 animate-slide-down">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-700">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Chính xác! Bạn làm tốt lắm!</span>
              </div>
              <p className="text-xs text-stone-500 pl-5">
                Nhấn phím <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded font-mono font-bold text-stone-700">Enter</kbd> để qua câu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Tiếp theo</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* CASE 3: INITIAL STATE (Not submitted yet) */}
        {!isCheckSubmitted && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-400 font-medium">
              Gõ nội dung nghe được rồi nhấn <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-stone-600">Enter</kbd> hoặc bấm Kiểm tra.
            </span>

            <button
              type="button"
              onClick={handleCheck}
              disabled={!userTypedText.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition shadow-sm ${
                userTypedText.trim()
                  ? 'bg-[#E11D48] hover:bg-rose-700 text-white active:scale-95 cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              Kiểm tra
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* ACCORDION 1: SCRIPT, PRONUNCIATION & TRANSLATE (Matching Screenshot 2 & 3) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsScriptOpen(!isScriptOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-black text-sm text-stone-900 hover:bg-stone-50 transition"
        >
          <span>Script, pronunciation & translate</span>
          {isScriptOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {isScriptOpen && (
          <div className="px-5 pb-5 pt-1 border-t border-stone-100 space-y-4 animate-slide-down">
            {/* ENGLISH Section with Dotted Underline Clickable Words */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                <span className="text-[#1F2421] font-black">ENGLISH</span>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <span>A</span>
                  <span>Click vào từ để nghe phát âm</span>
                </span>
              </div>

              {/* Dotted Words */}
              <div className="text-base sm:text-lg font-bold text-stone-800 leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
                {activeSentence.text.split(' ').map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleWordClick(word)}
                    className={`border-b-2 border-dotted border-stone-400 hover:border-solid hover:border-[#E11D48] hover:text-[#E11D48] transition cursor-pointer ${
                      activeWordPlaying === cleanForCompare(word) ? 'text-[#E11D48] border-solid border-[#E11D48]' : ''
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Shadowing Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => speech.speak(activeSentence.text, 'en-US', 0.85)}
                  className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1.5"
                >
                  <span>🗣 Luyện shadowing câu</span>
                </button>
              </div>
            </div>

            {/* VIETNAMESE Translation */}
            <div className="space-y-1 pt-2 border-t border-stone-100">
              <span className="text-xs font-black text-stone-400 block">VIETNAMESE</span>
              <p className="text-sm text-stone-700 italic font-medium leading-relaxed">
                {activeSentence.vietnamese}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* ACCORDION 2: TỪ HAY HỌC ĐƯỢC (Matching Screenshot 2 & 3) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsVocabOpen(!isVocabOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-black text-sm text-stone-900 hover:bg-stone-50 transition"
        >
          <span>Từ hay học được</span>
          {isVocabOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {isVocabOpen && (
          <div className="px-5 pb-5 pt-1 border-t border-stone-100 space-y-3 animate-slide-down">
            {activeSentence.vocabList && activeSentence.vocabList.length > 0 ? (
              <div className="space-y-2">
                {activeSentence.vocabList.map((vc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-stone-900">
                        {vc.phrase}
                      </span>

                      {/* Shadowing Button */}
                      <button
                        type="button"
                        onClick={() => speech.speak(vc.phrase, 'en-US', 0.8)}
                        className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
                        title="Nghe shadowing chậm"
                      >
                        🗣
                      </button>

                      {/* Audio Speaker Button */}
                      <button
                        type="button"
                        onClick={() => speech.speak(vc.phrase, 'en-US', 1.0)}
                        className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <span className="font-mono text-xs text-stone-500">
                        {vc.ipa}
                      </span>
                    </div>

                    <span className="text-xs text-stone-700 font-bold">
                      {vc.meaning}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">
                Chưa có từ vựng chuyên sâu cho câu này. Hãy luyện tập phát âm cả câu nhé!
              </p>
            )}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* LESSON PICKER DRAWER / FOOTER BAR */}
      {/* ==================================================================== */}
      <div className="bg-stone-100 rounded-2xl p-3.5 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-500">Bài học khác:</span>
          <select
            value={activeLessonId}
            onChange={(e) => {
              setActiveLessonId(e.target.value);
              setSentenceIndex(0);
            }}
            className="bg-white border border-stone-300 font-bold text-stone-800 rounded-xl px-2.5 py-1.5 outline-none"
          >
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.totalSentences} câu)
              </option>
            ))}
          </select>
        </div>

        <div className="text-stone-500 font-medium">
          Mô phỏng 100% chuẩn hệ thống <strong>DOL English</strong> & <strong>V English House</strong>
        </div>
      </div>
    </div>
  );
}
