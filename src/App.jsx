import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import HostView from './components/HostView';
import PlayerView from './components/PlayerView';
import SplitView from './components/SplitView';
import QuizEditorModal from './components/QuizEditorModal';
import AIGeneratorModal from './components/AIGeneratorModal';
import VoiceSettingsModal from './components/VoiceSettingsModal';
import DuolingoPracticeView from './components/DuolingoPracticeView';
import ClassManagement from './components/ClassManagement';
import FlashcardDeck from './components/FlashcardDeck';
import WheelOfNames from './components/WheelOfNames';
import TicTacGame from './components/TicTacGame';
import HangmanGame from './components/HangmanGame';
import DictationLab from './components/DictationLab';
import SideDrawer from './components/SideDrawer';
import PowerUpLeaderboard from './components/PowerUpLeaderboard';
import VHouseCurriculumHub from './components/VHouseCurriculumHub';
import CatRaceTimer from './components/CatRaceTimer';
import { defaultQuizzes } from './data/defaultQuizzes';
import { Sparkles } from 'lucide-react';

const SOCKET_SERVER_URL = window.location.origin.includes('5173')
  ? 'http://localhost:3000'
  : window.location.origin;

export default function App() {
  const [mainTab, setMainTab] = useState('arena'); // 'arena' | 'dictation' | 'tictac' | 'hangman' | 'practice' | 'flashcards' | 'wheel' | 'classes' | 'powerup'
  const [activeMode, setActiveMode] = useState('host'); // 'host' | 'player'
  const [isSplitView, setIsSplitView] = useState(true);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [quizzes, setQuizzes] = useState(defaultQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState(defaultQuizzes[0]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const [answerThemeKey, setAnswerThemeKey] = useState(() => {
    return localStorage.getItem('vhouse_answer_theme') || 'vhouse';
  });

  const handleSelectAnswerTheme = (key) => {
    setAnswerThemeKey(key);
    localStorage.setItem('vhouse_answer_theme', key);
  };

  // Separate socket connections for Host & Player in SplitView
  const [hostSocket, setHostSocket] = useState(null);
  const [playerSocket, setPlayerSocket] = useState(null);

  useEffect(() => {
    const hSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });
    const pSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });

    setHostSocket(hSocket);
    setPlayerSocket(pSocket);

    return () => {
      hSocket.disconnect();
      pSocket.disconnect();
    };
  }, []);

  const handleSaveQuiz = (savedQuiz) => {
    const existingIndex = quizzes.findIndex((q) => q.id === savedQuiz.id);
    if (existingIndex >= 0) {
      const updated = [...quizzes];
      updated[existingIndex] = savedQuiz;
      setQuizzes(updated);
    } else {
      setQuizzes([savedQuiz, ...quizzes]);
    }
    setSelectedQuiz(savedQuiz);
    setIsEditorOpen(false);
    setEditingQuiz(null);
  };

  const handleOpenEditQuiz = (quizToEdit = null) => {
    setEditingQuiz(quizToEdit);
    setIsEditorOpen(true);
  };

  const handleQuizGeneratedByAI = (newQuiz) => {
    setQuizzes([newQuiz, ...quizzes]);
    setSelectedQuiz(newQuiz);
    alert(`🎉 Đã tạo thành công bộ đề: "${newQuiz.title}" với ${newQuiz.questions.length} câu hỏi!`);
  };

  const handleLaunchFromCurriculum = (unit, targetGame = 'arena') => {
    const vocabList = unit.targetVocab || ['Vocabulary', 'Grammar', 'Structure', 'Practice'];
    const generatedQuestions = vocabList.slice(0, 8).map((word, idx) => {
      return {
        id: `q_${unit.id}_${idx + 1}`,
        text: unit.sampleSentence && idx === 0
          ? unit.sampleSentence
          : `[${unit.className || unit.classId}] Choose the best word or structure for "${word}" (${unit.grammarFocus}):`,
        options: [
          { text: word, isCorrect: true },
          { text: `${word}ly`, isCorrect: false },
          { text: `un${word}`, isCorrect: false },
          { text: `${word}ing`, isCorrect: false }
        ],
        type: unit.recommendedFormat === 'blank' ? 'blank' : 'choice',
        explanation: `Chuyên đề ${unit.title}: Lựa chọn chính xác là "${word}". ${unit.grammarFocus}.`,
        timeLimit: unit.classId === 'A01' ? 15 : 20
      };
    });

    const newQuiz = {
      id: `quiz_${unit.id}_${Date.now()}`,
      title: `${unit.title} (${unit.className || unit.classId})`,
      description: `Giáo án chuẩn V English House: ${unit.theme}. Ngữ pháp: ${unit.grammarFocus}`,
      questions: generatedQuestions
    };

    setQuizzes([newQuiz, ...quizzes]);
    setSelectedQuiz(newQuiz);
    setMainTab(targetGame);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#1F2421] flex flex-col font-brand selection:bg-[#FFC600] selection:text-[#1F2421]">
      <Navbar
        mainTab={mainTab}
        setMainTab={setMainTab}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        isSplitView={isSplitView}
        setIsSplitView={setIsSplitView}
        onOpenAIModal={() => setIsAIOpen(true)}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceOpen(true)}
        onOpenSideDrawer={() => setIsSideDrawerOpen(true)}
        answerThemeKey={answerThemeKey}
        onSelectAnswerTheme={handleSelectAnswerTheme}
      />

      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        mainTab={mainTab}
        setMainTab={setMainTab}
      />

      <main className="container mx-auto py-3 px-2 sm:px-4 flex-1">
        {/* TAB 1: ARENA (Kahoot Multiplayer Live) */}
        {mainTab === 'arena' && (
          <div>
            {/* Quick banner indicating V English House Live Room */}
            <div className="mb-3 flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border border-stone-200/90 shadow-sm text-xs">
              <span className="text-stone-600 font-medium">
                Đang chọn bộ đề: <strong className="text-[#1F2421] font-bold">{selectedQuiz.title}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsAIOpen(true)}
                className="text-[#A67C1E] hover:text-[#1F2421] font-bold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dùng AI tạo đề mới từ giáo án</span>
              </button>
            </div>

            {isSplitView ? (
              <SplitView
                socket={hostSocket}
                playerSocket={playerSocket}
                quizzes={quizzes}
                selectedQuiz={selectedQuiz}
                setSelectedQuiz={setSelectedQuiz}
                onOpenAIModal={() => setIsAIOpen(true)}
                onEditQuiz={handleOpenEditQuiz}
                answerThemeKey={answerThemeKey}
                onSelectAnswerTheme={handleSelectAnswerTheme}
              />
            ) : activeMode === 'host' ? (
              <HostView
                socket={hostSocket}
                quizzes={quizzes}
                selectedQuiz={selectedQuiz}
                setSelectedQuiz={setSelectedQuiz}
                onOpenAIModal={() => setIsAIOpen(true)}
                onEditQuiz={handleOpenEditQuiz}
                answerThemeKey={answerThemeKey}
                onSelectAnswerTheme={handleSelectAnswerTheme}
              />
            ) : (
              <PlayerView
                socket={playerSocket}
                answerThemeKey={answerThemeKey}
              />
            )}
          </div>
        )}

        {/* TAB: V ENGLISH HOUSE CURRICULUM HUB */}
        {mainTab === 'curriculum' && (
          <VHouseCurriculumHub
            onLaunchArenaWithQuiz={(unit) => handleLaunchFromCurriculum(unit, 'arena')}
            onLaunchTicTacWithUnit={(unit) => handleLaunchFromCurriculum(unit, 'tictac')}
            onLaunchHangmanWithUnit={(unit) => handleLaunchFromCurriculum(unit, 'hangman')}
            onLaunchDictationWithUnit={(unit) => handleLaunchFromCurriculum(unit, 'dictation')}
            onOpenAIModalWithUnit={(unit) => setIsAIOpen(true)}
          />
        )}

        {/* TAB: CUỘC ĐUA MÈO - CAT RACE COUNTDOWN TIMER */}
        {mainTab === 'catrace' && (
          <div className="max-w-6xl mx-auto">
            <CatRaceTimer />
          </div>
        )}

        {/* TAB 2: DICTATION LAB (YouTube & Google Studio Voice Dictation) */}
        {mainTab === 'dictation' && (
          <DictationLab currentQuiz={selectedQuiz} />
        )}

        {/* TAB 3: TICTAC BATTLE (TriviaMaker Style 3x3) */}
        {mainTab === 'tictac' && (
          <TicTacGame
            quiz={selectedQuiz}
            quizzes={quizzes}
            onSelectQuiz={setSelectedQuiz}
            onOpenAIModal={() => setIsAIOpen(true)}
            onEditQuiz={handleOpenEditQuiz}
          />
        )}

        {/* TAB 4: HANGMAN (TriviaMaker Style Vocabulary Guessing) */}
        {mainTab === 'hangman' && (
          <HangmanGame
            quiz={selectedQuiz}
            quizzes={quizzes}
            onSelectQuiz={setSelectedQuiz}
            onOpenAIModal={() => setIsAIOpen(true)}
            onEditQuiz={handleOpenEditQuiz}
          />
        )}

        {/* TAB 5: PRACTICE (Duolingo Style Self-Paced Learning) */}
        {mainTab === 'practice' && (
          <div>
            {/* Quiz Selector for practice */}
            <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm">
              <span className="text-xs text-stone-600 font-bold">Chọn bài ôn tập:</span>
              <select
                value={selectedQuiz.id}
                onChange={(e) => {
                  const q = quizzes.find((item) => item.id === e.target.value);
                  if (q) setSelectedQuiz(q);
                }}
                className="bg-stone-50 border border-stone-200 text-[#1F2421] text-xs font-bold rounded-xl px-3 py-2 outline-none max-w-[320px] truncate focus:border-[#FFC600]"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </div>

            <DuolingoPracticeView quiz={selectedQuiz} />
          </div>
        )}

        {/* TAB 6: FLASHCARDS (3D Interactive Flip Vocabulary Cards) */}
        {mainTab === 'flashcards' && (
          <FlashcardDeck onOpenAIModal={() => setIsAIOpen(true)} />
        )}

        {/* TAB 7: WHEEL OF NAMES (Funny Random Student Picker) */}
        {mainTab === 'wheel' && (
          <WheelOfNames />
        )}

        {/* TAB 8: CLASSES & HOUSE POWER-UP MANAGEMENT */}
        {mainTab === 'classes' && (
          <ClassManagement
            quizzes={quizzes}
            onOpenAIModal={() => setIsAIOpen(true)}
            onAssignQuiz={(classId, quiz) => {
              alert(`Đã giao bộ đề cho lớp thành công!`);
            }}
          />
        )}

        {/* TAB 9: POWER-UP HOUSE LEADERBOARD (Screenshot 1) */}
        {mainTab === 'powerup' && (
          <PowerUpLeaderboard />
        )}
      </main>

      {/* Modals */}
      <AIGeneratorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onQuizGenerated={handleQuizGeneratedByAI}
        onOpenEditorWithQuiz={(quiz) => {
          setEditingQuiz(quiz);
          setIsAIOpen(false);
          setIsEditorOpen(true);
        }}
      />

      <QuizEditorModal
        isOpen={isEditorOpen}
        quizToEdit={editingQuiz}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingQuiz(null);
        }}
        onSaveQuiz={handleSaveQuiz}
      />

      <VoiceSettingsModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}
