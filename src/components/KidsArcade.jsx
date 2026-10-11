import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Volume2, RotateCcw, Shuffle, HelpCircle, Trophy,
  Award, Check, X, ArrowRight, Play, Pause, RefreshCw, Star,
  Users, User, Flame, Eye, EyeOff, Brain, ChevronRight, Bookmark,
  Layers, Lightbulb, Clock, Compass, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

// ============================================================================
// TOPIC VOCABULARY DATABASE (KHAN ACADEMY KIDS & DUOLINGO STYLE)
// ============================================================================
const ARCADE_TOPICS = [
  {
    id: 'animals',
    name: 'Động Vật',
    nameEn: 'Animals',
    icon: '🦁',
    bg: 'from-amber-100 to-orange-100',
    accent: '#F59E0B',
    words: [
      { word: 'CAT', viet: 'Con mèo', icon: '🐱', hint: 'Thú cưng thích bắt chuột, kêu meo meo' },
      { word: 'DOG', viet: 'Con chó', icon: '🐶', hint: 'Người bạn trung thành hay sủa gâu gâu' },
      { word: 'FOX', viet: 'Con cáo', icon: '🦊', hint: 'Loài vật thông minh có bộ lông màu cam' },
      { word: 'BEAR', viet: 'Con gấu', icon: '🐻', hint: 'Loài thú to lớn thích ăn mật ong' },
      { word: 'LION', viet: 'Sư tử', icon: '🦁', hint: 'Chúa tể sơn lâm có bờm dũng mãnh' },
      { word: 'DUCK', viet: 'Con vịt', icon: '🦆', hint: 'Loài chim bơi dưới nước kêu cạp cạp' },
      { word: 'FROG', viet: 'Con ếch', icon: '🐸', hint: 'Bật nhảy xa, sống ở bờ ao bờ ruộng' },
      { word: 'BIRD', viet: 'Con chim', icon: '🐦', hint: 'Có đôi cánh bay lượn trên bầu trời' },
      { word: 'FISH', viet: 'Con cá', icon: '🐟', hint: 'Bơi lội tung tăng dưới đại dương' },
      { word: 'PIG', viet: 'Con heo', icon: '🐷', hint: 'Mũi tròn ủn ỉn, thích ăn no ngủ kỹ' },
      { word: 'COW', viet: 'Con bò', icon: '🐮', hint: 'Cho chúng ta sữa tươi thơm ngon mỗi ngày' },
      { word: 'TIGER', viet: 'Con hổ', icon: '🐯', hint: 'Chúa tể rừng xanh có sọc vằn trên lưng' },
      { word: 'PANDA', viet: 'Gấu trúc', icon: '🐼', hint: 'Gấu trắng đen thích ăn lá tre lá trúc' },
      { word: 'ZEBRA', viet: 'Ngựa vằn', icon: '🦓', hint: 'Ngựa có sọc đen trắng đặc trưng' },
      { word: 'MONKEY', viet: 'Con khỉ', icon: '🐵', hint: 'Rất nhanh nhẹn, thích chuyền cành ăn chuối' },
      { word: 'ELEPHANT', viet: 'Con voi', icon: '🐘', hint: 'Thân hình khổng lồ và có chiếc vòi dài' }
    ]
  },
  {
    id: 'food',
    name: 'Đồ Ăn & Thức Uống',
    nameEn: 'Food & Drinks',
    icon: '🍕',
    bg: 'from-rose-100 to-amber-100',
    accent: '#EF4444',
    words: [
      { word: 'PIZZA', viet: 'Bánh pizza', icon: '🍕', hint: 'Món bánh tròn phủ phô mai nướng thơm lừng' },
      { word: 'BURGER', viet: 'Bánh kẹp', icon: '🍔', hint: 'Bánh mì kẹp thịt và rau xà lách tươi ngon' },
      { word: 'APPLE', viet: 'Quả táo', icon: '🍎', hint: 'Trái cây giòn ngọt, màu đỏ tươi hoặc xanh' },
      { word: 'BANANA', viet: 'Quả chuối', icon: '🍌', hint: 'Trái cây màu vàng cong cong khỉ rất thích' },
      { word: 'CAKE', viet: 'Bánh ngọt', icon: '🎂', hint: 'Bánh sinh nhật cắm nến nhiều tầng' },
      { word: 'MILK', viet: 'Sữa tươi', icon: '🥛', hint: 'Thức uống bổ dưỡng giúp bé cao lớn' },
      { word: 'BREAD', viet: 'Bánh mì', icon: '🍞', hint: 'Bánh mì giòn rụm cho bữa sáng tràn năng lượng' },
      { word: 'CHEESE', viet: 'Phô mai', icon: '🧀', hint: 'Món ăn màu vàng thơm béo chuột rất mê' },
      { word: 'CANDY', viet: 'Kẹo ngọt', icon: '🍬', hint: 'Món kẹo ngọt ngào đầy màu sắc' },
      { word: 'COOKIE', viet: 'Bánh quy', icon: '🍪', hint: 'Bánh nướng giòn rụm có hạt sô-cô-la' },
      { word: 'ORANGE', viet: 'Quả cam', icon: '🍊', hint: 'Trái cây mọng nước giàu vitamin C' },
      { word: 'WATER', viet: 'Nước lọc', icon: '💧', hint: 'Nước trong lành cần thiết cho cơ thể' }
    ]
  },
  {
    id: 'school',
    name: 'Trường Học',
    nameEn: 'School & Classroom',
    icon: '🏫',
    bg: 'from-blue-100 to-indigo-100',
    accent: '#3B82F6',
    words: [
      { word: 'BOOK', viet: 'Quyển sách', icon: '📖', hint: 'Chứa đựng nhiều kiến thức và câu chuyện hay' },
      { word: 'DESK', viet: 'Bàn học', icon: '🪑', hint: 'Nơi em ngồi học bài mỗi ngày' },
      { word: 'CHAIR', viet: 'Cái ghế', icon: '🪑', hint: 'Đồ dùng để ngồi trong lớp học' },
      { word: 'PEN', viet: 'Bút mực', icon: '🖊️', hint: 'Dụng cụ dùng để viết chữ bằng mực' },
      { word: 'PENCIL', viet: 'Bút chì', icon: '✏️', hint: 'Bút có thể tẩy xóa khi vẽ tranh' },
      { word: 'RULER', viet: 'Thước kẻ', icon: '📏', hint: 'Dùng để đo độ dài và kẻ đường thẳng tắp' },
      { word: 'ERASER', viet: 'Cục tẩy', icon: '🧼', hint: 'Giúp bé xóa sạch nét bút chì khi viết nhầm' },
      { word: 'SCHOOL', viet: 'Trường học', icon: '🏫', hint: 'Nơi có thầy cô và bạn bè thân thương' },
      { word: 'CLOCK', viet: 'Đồng hồ', icon: '⏰', hint: 'Dụng cụ xem giờ để không đi học muộn' },
      { word: 'BAG', viet: 'Cặp sách', icon: '🎒', hint: 'Chiếc ba lô đựng sách vở tới trường' },
      { word: 'CLASS', viet: 'Lớp học', icon: '👩‍🏫', hint: 'Căn phòng nơi chúng mình cùng học tập' }
    ]
  },
  {
    id: 'house',
    name: 'Ngôi Nhà',
    nameEn: 'House & Home',
    icon: '🏠',
    bg: 'from-emerald-100 to-teal-100',
    accent: '#10B981',
    words: [
      { word: 'HOUSE', viet: 'Ngôi nhà', icon: '🏠', hint: 'Tổ ấm yêu thương che mưa che nắng' },
      { word: 'DOOR', viet: 'Cửa ra vào', icon: '🚪', hint: 'Cửa mở ra để bước vào phòng' },
      { word: 'ROOM', viet: 'Căn phòng', icon: '🛋️', hint: 'Không gian riêng tư trong ngôi nhà' },
      { word: 'BED', viet: 'Chiếc giường', icon: '🛏️', hint: 'Nơi êm ái cho bé giấc ngủ ngon' },
      { word: 'LAMP', viet: 'Đèn bàn', icon: '💡', hint: 'Thắp sáng căn phòng khi trời tối' },
      { word: 'TABLE', viet: 'Cái bàn', icon: '🪵', hint: 'Bàn ăn cơm ấm cúng cùng gia đình' },
      { word: 'WINDOW', viet: 'Cửa sổ', icon: '🪟', hint: 'Nơi đón ánh nắng và gió mát vào phòng' },
      { word: 'SOFA', viet: 'Ghế sô-pha', icon: '🛋️', hint: 'Chiếc ghế dài êm ái ở phòng khách' },
      { word: 'GARDEN', viet: 'Khu vườn', icon: '🏡', hint: 'Mảnh vườn xinh trồng hoa và cây xanh' },
      { word: 'KITCHEN', viet: 'Nhà bếp', icon: '🍳', hint: 'Nơi mẹ nấu những bữa ăn thơm ngon' }
    ]
  },
  {
    id: 'christmas',
    name: 'Giáng Sinh & Mùa Đông',
    nameEn: 'Christmas & Winter',
    icon: '🎄',
    bg: 'from-emerald-100 to-rose-100',
    accent: '#DC2626',
    words: [
      { word: 'SANTA', viet: 'Ông già Noel', icon: '🎅', hint: 'Ông già râu bạc mang quà tặng bé ngoan' },
      { word: 'TREE', viet: 'Cây thông Noel', icon: '🎄', hint: 'Cây xanh trang trí đèn sao lấp lánh' },
      { word: 'BELL', viet: 'Chuông bạc', icon: '🔔', hint: 'Tiếng chuông ngân vang Jingle Bells' },
      { word: 'STAR', viet: 'Ngôi sao', icon: '⭐', hint: 'Ngôi sao sáng gắn trên đỉnh cây thông' },
      { word: 'SNOW', viet: 'Băng tuyết', icon: '❄️', hint: 'Những bông tuyết trắng rơi mùa đông' },
      { word: 'GIFT', viet: 'Hộp quà', icon: '🎁', hint: 'Món quà xinh xắn buộc nơ đỏ' },
      { word: 'DEER', viet: 'Tuần lộc', icon: '🦌', hint: 'Chú tuần lộc kéo xe trượt tuyết của Santa' },
      { word: 'SOCKS', viet: 'Tất Giáng Sinh', icon: '🧦', hint: 'Chiếc tất đỏ treo bên lò sưởi đón quà' },
      { word: 'CANDY', viet: 'Kẹo gậy Noel', icon: '🦯', hint: 'Cây kẹo gậy sọc trắng đỏ ngọt lịm' }
    ]
  },
  {
    id: 'vehicles',
    name: 'Phương Tiện',
    nameEn: 'Vehicles',
    icon: '🚗',
    bg: 'from-cyan-100 to-blue-100',
    accent: '#06B6D4',
    words: [
      { word: 'CAR', viet: 'Xe ô tô', icon: '🚗', hint: 'Xe bốn bánh chở gia đình đi chơi' },
      { word: 'BUS', viet: 'Xe buýt', icon: '🚌', hint: 'Xe chở nhiều hành khách đi khắp thành phố' },
      { word: 'TRAIN', viet: 'Tàu hỏa', icon: '🚂', hint: 'Đoàn tàu xình xịch chạy trên đường ray' },
      { word: 'BIKE', viet: 'Xe đạp', icon: '🚲', hint: 'Xe hai bánh bé dùng chân đạp rèn sức khỏe' },
      { word: 'BOAT', viet: 'Thuyền buồm', icon: '⛵', hint: 'Chiếc thuyền giương buồm lướt sóng' },
      { word: 'PLANE', viet: 'Máy bay', icon: '✈️', hint: 'Bay lượn trên bầu trời xuyên qua những đám mây' },
      { word: 'TRUCK', viet: 'Xe tải', icon: '🚚', hint: 'Chiếc xe to lớn dùng chở hàng hóa nặng' },
      { word: 'SHIP', viet: 'Tàu thủy', icon: '🚢', hint: 'Tàu viễn dương khổng lồ vượt đại dương' },
      { word: 'ROCKET', viet: 'Tên lửa', icon: '🚀', hint: 'Phun lửa phụt khói bay vút vào không gian' }
    ]
  }
];

// Helper: Scramble letters guaranteeing it differs from original
function scrambleWord(word) {
  const letters = word.toUpperCase().split('');
  if (letters.length <= 1) return letters;
  let scrambled = [...letters];
  let attempts = 0;
  while (attempts < 8 && scrambled.join('') === word.toUpperCase()) {
    scrambled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  }
  return scrambled;
}

// Letter Colors palette for Khan Academy Kids tiles
const TILE_COLORS = [
  'bg-rose-500 text-white border-rose-700',
  'bg-amber-500 text-white border-amber-700',
  'bg-emerald-500 text-white border-emerald-700',
  'bg-sky-500 text-white border-sky-700',
  'bg-purple-500 text-white border-purple-700',
  'bg-pink-500 text-white border-pink-700',
  'bg-indigo-500 text-white border-indigo-700',
  'bg-teal-500 text-white border-teal-700',
];

export default function KidsArcade({ quizzes = [], selectedQuiz, onSelectQuiz }) {
  // Current Mini Game: 'scramble' | 'missing' | 'memory'
  const [activeGame, setActiveGame] = useState('scramble');

  // Topic Selection
  const [currentTopicId, setCurrentTopicId] = useState('animals');

  // Competition Mode: 'single' | 'battle' (2 Teams: Red vs Blue)
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [teamScores, setTeamScores] = useState({ red: 0, blue: 0 });
  const [activeTeamTurn, setActiveTeamTurn] = useState('red'); // 'red' | 'blue'

  // Current Topic Words
  const currentTopic = ARCADE_TOPICS.find((t) => t.id === currentTopicId) || ARCADE_TOPICS[0];
  const topicWords = currentTopic.words;

  // ==========================================================================
  // GAME 1: WORD SCRAMBLE STATE
  // ==========================================================================
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState([]); // indices in letterPool placed
  const [scrambleStatus, setScrambleStatus] = useState('playing'); // 'playing' | 'correct' | 'wrong'
  const [scrambleStreak, setScrambleStreak] = useState(0);
  const [totalScrambleScore, setTotalScrambleScore] = useState(0);
  const [letterPool, setLetterPool] = useState([]); // array of { id, char, used }

  const currentScrambleWord = topicWords[scrambleIndex % topicWords.length];

  // Initialize Word Scramble Letter Pool
  useEffect(() => {
    if (!currentScrambleWord) return;
    const target = currentScrambleWord.word.toUpperCase();
    const scrambled = scrambleWord(target);
    const pool = scrambled.map((char, i) => ({
      id: `${char}_${i}_${Date.now()}`,
      char,
      used: false,
      colorClass: TILE_COLORS[i % TILE_COLORS.length]
    }));
    setLetterPool(pool);
    setPlacedLetters([]);
    setScrambleStatus('playing');
  }, [scrambleIndex, currentTopicId]);

  // Click on letter in pool to place in first empty slot
  const handleSelectLetter = (item) => {
    if (item.used || scrambleStatus === 'correct') return;
    sound.playClick();

    const targetLen = currentScrambleWord.word.length;
    if (placedLetters.length >= targetLen) return;

    const nextPlaced = [...placedLetters, item];
    setPlacedLetters(nextPlaced);

    // Mark as used in pool
    setLetterPool((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
    );

    // If all letters placed, check word!
    if (nextPlaced.length === targetLen) {
      checkScrambleAnswer(nextPlaced);
    }
  };

  // Click on placed letter to return it to the pool
  const handleRemovePlacedLetter = (itemIndex) => {
    if (scrambleStatus === 'correct') return;
    sound.playClick();

    const removedItem = placedLetters[itemIndex];
    if (!removedItem) return;

    const nextPlaced = placedLetters.filter((_, idx) => idx !== itemIndex);
    setPlacedLetters(nextPlaced);
    setScrambleStatus('playing');

    // Return to pool
    setLetterPool((prev) =>
      prev.map((l) => (l.id === removedItem.id ? { ...l, used: false } : l))
    );
  };

  // Verify Word Scramble
  const checkScrambleAnswer = (placed) => {
    const attempted = placed.map((p) => p.char).join('');
    const correct = currentScrambleWord.word.toUpperCase();

    if (attempted === correct) {
      sound.playCorrect();
      setScrambleStatus('correct');
      setScrambleStreak((s) => s + 1);
      const earned = 100 + scrambleStreak * 20;
      setTotalScrambleScore((s) => s + earned);

      if (isBattleMode) {
        setTeamScores((ts) => ({
          ...ts,
          [activeTeamTurn]: ts[activeTeamTurn] + earned
        }));
      }

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });

      speech.speakEnglish(currentScrambleWord.word);

      // Auto next word after 1.4s
      setTimeout(() => {
        handleNextScrambleWord();
      }, 1400);
    } else {
      sound.playWrong();
      setScrambleStatus('wrong');
    }
  };

  const handleNextScrambleWord = () => {
    setScrambleIndex((i) => (i + 1) % topicWords.length);
    if (isBattleMode) {
      setActiveTeamTurn((t) => (t === 'red' ? 'blue' : 'red'));
    }
  };

  // Shuffle remaining unused letters
  const handleShuffleLetters = () => {
    sound.playClick();
    setLetterPool((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Hint: Put the next correct letter in place
  const handleScrambleHint = () => {
    sound.playClick();
    const correct = currentScrambleWord.word.toUpperCase();
    const nextCharIndex = placedLetters.length;
    if (nextCharIndex >= correct.length) return;

    const expectedChar = correct[nextCharIndex];
    // Find an unused letter in pool with that char
    const candidate = letterPool.find((l) => !l.used && l.char === expectedChar);
    if (candidate) {
      handleSelectLetter(candidate);
    }
  };

  // Clear all placed letters
  const handleClearScramble = () => {
    sound.playClick();
    setPlacedLetters([]);
    setLetterPool((prev) => prev.map((l) => ({ ...l, used: false })));
    setScrambleStatus('playing');
  };

  // ==========================================================================
  // GAME 2: WHAT'S MISSING? (MISSING PICTURES)
  // ==========================================================================
  // Phases: 'memorize' (countdown to remember) | 'curtain' (eyes closed) | 'guess' (1 missing) | 'revealed'
  const [missingPhase, setMissingPhase] = useState('memorize');
  const [missingItems, setMissingItems] = useState([]); // 5 or 6 items
  const [hiddenTarget, setHiddenTarget] = useState(null); // the one missing item
  const [memorizeCountdown, setMemorizeCountdown] = useState(8);
  const [missingRoundsPlayed, setMissingRoundsPlayed] = useState(0);

  // Setup round for What's Missing
  const startNewMissingRound = () => {
    sound.playClick();
    // Pick 5 random items from current topic
    const shuffled = [...topicWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    const chosenHidden = selected[Math.floor(Math.random() * selected.length)];

    setMissingItems(selected);
    setHiddenTarget(chosenHidden);
    setMissingPhase('memorize');
    setMemorizeCountdown(8);
  };

  // Initialize or reset Missing game when topic changes
  useEffect(() => {
    if (activeGame === 'missing') {
      startNewMissingRound();
    }
  }, [activeGame, currentTopicId]);

  // Memorize Countdown Timer
  useEffect(() => {
    if (activeGame !== 'missing' || missingPhase !== 'memorize') return;

    if (memorizeCountdown > 0) {
      const timer = setTimeout(() => {
        setMemorizeCountdown((c) => c - 1);
        sound.playTick();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Transition to Curtain / Close Eyes!
      setMissingPhase('curtain');
      sound.playBoingSound();

      setTimeout(() => {
        setMissingPhase('guess');
      }, 1800);
    }
  }, [activeGame, missingPhase, memorizeCountdown]);

  // Skip countdown directly to Guess phase
  const handleSkipToGuess = () => {
    sound.playClick();
    setMissingPhase('curtain');
    setTimeout(() => {
      setMissingPhase('guess');
    }, 1200);
  };

  // Reveal Missing Answer
  const handleRevealMissing = () => {
    sound.playFanfare();
    setMissingPhase('revealed');
    setMissingRoundsPlayed((r) => r + 1);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    if (hiddenTarget) {
      speech.speakEnglish(`It's the ${hiddenTarget.word}!`);
    }
  };

  const handleAwardMissingPoint = (team) => {
    sound.playCorrect();
    setTeamScores((ts) => ({
      ...ts,
      [team]: ts[team] + 100
    }));
  };

  // ==========================================================================
  // GAME 3: MEMORY MATCH (CARD FLIP GAME)
  // ==========================================================================
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // indices of flipped cards (max 2)
  const [matchedPairs, setMatchedPairs] = useState([]); // matched card ids
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Initialize Memory Match cards
  const startNewMemoryGame = () => {
    sound.playClick();
    // Pick 6 words for 12 cards (or 8 words for 16)
    const shuffledWords = [...topicWords].sort(() => Math.random() - 0.5).slice(0, 6);
    const cardList = [];

    shuffledWords.forEach((item, idx) => {
      // Card A: English Word
      cardList.push({
        uid: `word_${item.word}_${idx}_A`,
        matchKey: item.word,
        type: 'word',
        label: item.word,
        viet: item.viet,
        icon: item.icon,
        color: TILE_COLORS[idx % TILE_COLORS.length]
      });
      // Card B: Picture / Icon Card
      cardList.push({
        uid: `pic_${item.word}_${idx}_B`,
        matchKey: item.word,
        type: 'picture',
        label: item.word,
        viet: item.viet,
        icon: item.icon,
        color: TILE_COLORS[idx % TILE_COLORS.length]
      });
    });

    // Shuffle the 12 cards
    const shuffledCards = cardList.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    if (activeGame === 'memory') {
      startNewMemoryGame();
    }
  }, [activeGame, currentTopicId]);

  // Handle Memory Card Click
  const handleCardClick = (cardIndex) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardIndex)) return;
    const card = memoryCards[cardIndex];
    if (matchedPairs.includes(card.matchKey)) return;

    sound.playClick();
    const nextFlipped = [...flippedCards, cardIndex];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const card1 = memoryCards[nextFlipped[0]];
      const card2 = memoryCards[nextFlipped[1]];

      if (card1.matchKey === card2.matchKey) {
        // MATCH!
        setTimeout(() => {
          sound.playCorrect();
          setMatchedPairs((mp) => [...mp, card1.matchKey]);
          setFlippedCards([]);
          speech.speakEnglish(card1.label);

          if (isBattleMode) {
            setTeamScores((ts) => ({
              ...ts,
              [activeTeamTurn]: ts[activeTeamTurn] + 100
            }));
          }

          // Check Win (All 6 pairs found)
          if (matchedPairs.length + 1 >= memoryCards.length / 2) {
            sound.playFanfare();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
          }
        }, 500);
      } else {
        // MISMATCH -> Flip back after 900ms
        setTimeout(() => {
          setFlippedCards([]);
          if (isBattleMode) {
            setActiveTeamTurn((t) => (t === 'red' ? 'blue' : 'red'));
          }
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto select-none font-sans pb-8">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER BANNER: KHAN ACADEMY KIDS & DUOLINGO STYLE             */}
      {/* ==================================================================== */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-3 sm:p-5 shadow-lg mb-4 text-stone-900 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl sm:text-4xl transform -rotate-3 border-2 border-amber-300">
            {activeGame === 'scramble' ? '🔤' : activeGame === 'missing' ? '🕵️' : '🃏'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/15 text-white">
                V English Kids Zone
              </span>
              <span className="text-[10px] sm:text-xs font-black text-amber-900 bg-white/70 px-2 py-0.5 rounded-full">
                Khan Academy & Duolingo Style
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 drop-shadow-xs tracking-tight">
              {activeGame === 'scramble' && 'Word Scramble • Xếp Chữ Tiếng Anh'}
              {activeGame === 'missing' && "What's Missing? • Hình Nào Biến Mất?"}
              {activeGame === 'memory' && 'Memory Match • Lật Thẻ Ghép Đôi'}
            </h1>
          </div>
        </div>

        {/* Right Action: Game Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/30 backdrop-blur-sm p-1 sm:p-1.5 rounded-2xl border border-white/50">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveGame('scramble');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeGame === 'scramble'
                ? 'bg-white text-stone-900 shadow-md ring-2 ring-yellow-400 scale-102'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            <span>🔤</span>
            <span>Xếp Chữ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveGame('missing');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeGame === 'missing'
                ? 'bg-white text-stone-900 shadow-md ring-2 ring-yellow-400 scale-102'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            <span>🕵️</span>
            <span>Hình Biến Mất</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveGame('memory');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 ${
              activeGame === 'memory'
                ? 'bg-white text-stone-900 shadow-md ring-2 ring-yellow-400 scale-102'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            <span>🃏</span>
            <span>Lật Thẻ</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. SUB-BAR: TOPIC SELECTOR & 2-TEAM COMPETITION TOGGLE                */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-stone-200/90 mb-4 flex items-center justify-between gap-3 flex-wrap">
        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-xs font-black text-stone-500 uppercase tracking-wider flex items-center gap-1 shrink-0 ml-1 mr-1">
            <span>📚</span>
            <span>Chủ đề:</span>
          </span>
          {ARCADE_TOPICS.map((topic) => {
            const isSel = topic.id === currentTopicId;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentTopicId(topic.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 border ${
                  isSel
                    ? 'bg-[#1F2421] text-white border-black shadow-sm ring-2 ring-yellow-400'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
                <span className="text-[10px] opacity-70">({topic.words.length})</span>
              </button>
            );
          })}
        </div>

        {/* 2-Team Battle Mode Toggle (Cạnh tranh lớp học) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsBattleMode(!isBattleMode);
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 border ${
              isBattleMode
                ? 'bg-gradient-to-r from-rose-500 to-blue-600 text-white border-transparent shadow ring-2 ring-yellow-300'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
            }`}
            title="Bật chế độ Đấu 2 Đội (Đội Đỏ vs Đội Xanh) tranh tài gay cấn"
          >
            <span>⚔️</span>
            <span>{isBattleMode ? 'Đấu 2 Đội: BẬT' : 'Đấu 2 Đội: TẮT'}</span>
          </button>
        </div>
      </div>

      {/* 2-TEAM BATTLE SCOREBOARD (if enabled) */}
      {isBattleMode && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Team Red */}
          <div
            className={`p-3 rounded-2xl border-3 flex items-center justify-between transition-all ${
              activeTeamTurn === 'red'
                ? 'bg-rose-50 border-rose-500 shadow-md ring-4 ring-rose-200 scale-101'
                : 'bg-white border-stone-200 opacity-80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-rose-700 block">ĐỘI ĐỎ (TEAM RED)</span>
                {activeTeamTurn === 'red' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-200 px-2 py-0.2 rounded-full animate-pulse">
                    Đang đến lượt!
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-rose-600">{teamScores.red}đ</span>
          </div>

          {/* Team Blue */}
          <div
            className={`p-3 rounded-2xl border-3 flex items-center justify-between transition-all ${
              activeTeamTurn === 'blue'
                ? 'bg-blue-50 border-blue-500 shadow-md ring-4 ring-blue-200 scale-101'
                : 'bg-white border-stone-200 opacity-80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔵</span>
              <div>
                <span className="font-black text-xs sm:text-sm text-blue-700 block">ĐỘI XANH (TEAM BLUE)</span>
                {activeTeamTurn === 'blue' && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-200 px-2 py-0.2 rounded-full animate-pulse">
                    Đang đến lượt!
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-blue-600">{teamScores.blue}đ</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME MODE 1: WORD SCRAMBLE (SPELLING · VOCABULARY)                   */}
      {/* ==================================================================== */}
      {activeGame === 'scramble' && (
        <div className="bg-white rounded-3xl p-4 sm:p-7 shadow-lg border-2 border-stone-200/90 text-center relative overflow-hidden">
          {/* Top Status & Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border">
                Từ #{scrambleIndex + 1} / {topicWords.length}
              </span>
              {scrambleStreak > 1 && (
                <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1 animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Chuỗi x{scrambleStreak}!</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Pronounce Button */}
              <button
                type="button"
                onClick={() => speech.speakEnglish(currentScrambleWord.word)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition flex items-center gap-1"
                title="Nghe phát âm tiếng Anh chuẩn"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Phát âm</span>
              </button>

              <button
                type="button"
                onClick={handleShuffleLetters}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border transition flex items-center gap-1"
                title="Xáo trộn lại các chữ cái"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xáo trộn</span>
              </button>

              <button
                type="button"
                onClick={handleScrambleHint}
                className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-black text-xs border-b-2 border-yellow-600 active:translate-y-0.5 transition flex items-center gap-1 shadow-xs"
                title="Gợi ý 1 chữ cái"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gợi ý</span>
              </button>

              <button
                type="button"
                onClick={handleClearScramble}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-600 font-bold text-xs border transition flex items-center gap-1"
                title="Xóa hết các chữ đã xếp"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa</span>
              </button>
            </div>
          </div>

          {/* Central Illustrated Card (Khan Academy Kids Phonics Style) */}
          <div className="max-w-xl mx-auto my-3 sm:my-6 p-4 sm:p-6 bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-3xl border-2 border-amber-200 shadow-sm relative">
            {/* Big Cute Topic Icon */}
            <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow animate-pulse">
              {currentScrambleWord.icon}
            </div>

            {/* Vietnamese Meaning & Hint */}
            <div className="mb-2">
              <span className="text-lg sm:text-xl font-black text-stone-800 tracking-tight">
                {currentScrambleWord.viet}
              </span>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5 italic">
                "{currentScrambleWord.hint}"
              </p>
            </div>

            {/* Audio speaker pill */}
            <button
              type="button"
              onClick={() => speech.speakEnglish(currentScrambleWord.word)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 text-xs font-black rounded-full shadow-xs border border-amber-300 transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Bấm nghe âm thanh</span>
            </button>
          </div>

          {/* THE ANSWER SLOTS: Outline Boxes waiting for letters (O H S U E -> H O U S E) */}
          <div className="my-5 sm:my-7 flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-[72px]">
            {Array.from({ length: currentScrambleWord.word.length }).map((_, slotIdx) => {
              const placed = placedLetters[slotIdx];
              return (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => placed && handleRemovePlacedLetter(slotIdx)}
                  className={`w-12 h-14 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl transition-all duration-200 relative ${
                    placed
                      ? `${placed.colorClass} border-2 border-b-4 active:scale-95 shadow-md cursor-pointer animate-[popIn_0.2s_ease-out]`
                      : 'bg-stone-100 text-stone-300 border-2 border-dashed border-stone-300 shadow-inner'
                  } ${
                    scrambleStatus === 'correct'
                      ? 'ring-4 ring-emerald-400 bg-emerald-500 text-white border-emerald-700'
                      : scrambleStatus === 'wrong'
                      ? 'ring-4 ring-rose-400 animate-[shake_0.4s_ease-in-out]'
                      : ''
                  }`}
                  title={placed ? 'Bấm để trả chữ cái về lại khay' : 'Ô trống chờ chữ cái'}
                >
                  {placed ? placed.char : ''}
                  {!placed && (
                    <span className="w-4 h-1 bg-stone-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* SCRAMBLED LETTER TRAY: Tactile Duolingo-style 3D Tiles */}
          <div className="mt-4 pt-4 border-t border-stone-200">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400 mb-3 block">
              Bấm vào từng chữ cái để xếp thành từ đúng:
            </span>

            <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
              {letterPool.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.used || scrambleStatus === 'correct'}
                  onClick={() => handleSelectLetter(item)}
                  className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl font-black text-2xl sm:text-3xl transition-all select-none border-2 border-b-4 flex items-center justify-center ${
                    item.used
                      ? 'bg-stone-100 text-transparent border-stone-200 opacity-20 pointer-events-none'
                      : `${item.colorClass} hover:-translate-y-0.5 active:translate-y-1 active:border-b-2 shadow-md cursor-pointer active:scale-95`
                  }`}
                >
                  {item.char}
                </button>
              ))}
            </div>
          </div>

          {/* Status Feedback Banner */}
          {scrambleStatus === 'correct' && (
            <div className="mt-5 p-3 rounded-2xl bg-emerald-500 text-white font-black text-lg sm:text-xl flex items-center justify-center gap-2 animate-bounce shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
              <span>CHÍNH XÁC! TUYỆT VỜI! (+100 Điểm)</span>
            </div>
          )}

          {scrambleStatus === 'wrong' && (
            <div className="mt-5 p-3 rounded-2xl bg-rose-500 text-white font-black text-sm sm:text-base flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 stroke-[3]" />
                <span>Chưa đúng rồi! Hãy thử đổi vị trí các chữ cái nhé!</span>
              </div>
              <button
                type="button"
                onClick={handleClearScramble}
                className="px-3 py-1 rounded-xl bg-white text-rose-700 font-bold text-xs"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Next Word Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNextScrambleWord}
              className="px-5 py-2.5 rounded-2xl bg-[#1F2421] hover:bg-stone-800 text-white font-black text-sm flex items-center gap-2 shadow-md transition active:scale-95"
            >
              <span>Từ tiếp theo</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME MODE 2: WHAT'S MISSING? (MISSING PICTURES)                      */}
      {/* ==================================================================== */}
      {activeGame === 'missing' && (
        <div className="bg-white rounded-3xl p-4 sm:p-7 shadow-lg border-2 border-stone-200/90 text-center relative overflow-hidden min-h-[500px] flex flex-col justify-between">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl">🕵️</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {missingPhase === 'memorize' && 'Giai đoạn 1: Ghi nhớ các hình ảnh!'}
                  {missingPhase === 'curtain' && 'Nhắm mắt lại nào... 3, 2, 1!'}
                  {missingPhase === 'guess' && 'Hình nào đã biến mất?! (What’s missing?)'}
                  {missingPhase === 'revealed' && 'Đáp án chính xác!'}
                </h3>
                <span className="text-xs text-stone-500">
                  Chủ đề: <strong>{currentTopic.name}</strong> • 5 Hình ảnh thử thách trí nhớ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startNewMissingRound}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs border transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi 5 hình mới</span>
              </button>
            </div>
          </div>

          {/* PHASE 1: MEMORIZE (COUNTDOWN BAR) */}
          {missingPhase === 'memorize' && (
            <div className="my-2">
              <div className="flex items-center justify-center gap-2 text-amber-600 font-black text-sm sm:text-base mb-2 animate-pulse">
                <Clock className="w-4 h-4" />
                <span>Thời gian ghi nhớ: {memorizeCountdown} giây</span>
              </div>

              {/* Progress countdown bar */}
              <div className="w-full max-w-md mx-auto h-3 bg-stone-200 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(memorizeCountdown / 8) * 100}%` }}
                />
              </div>

              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  onClick={handleSkipToGuess}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl border-b-2 border-amber-600 active:translate-y-0.5 shadow-sm transition"
                >
                  Đã nhớ xong! Sang màn đoán ngay ➔
                </button>
              </div>

              {/* The 5 Cards displayed clearly */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 my-4">
                {missingItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => speech.speakEnglish(item.word)}
                    className="p-4 sm:p-5 bg-gradient-to-b from-white to-stone-50 rounded-2xl border-2 border-stone-300 shadow-md hover:border-amber-400 transition hover:scale-103 cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="font-black text-base sm:text-lg text-stone-800">
                      {item.word}
                    </span>
                    <span className="text-xs text-stone-500 font-bold">{item.viet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2: CURTAIN / EYES CLOSED ANIMATION */}
          {missingPhase === 'curtain' && (
            <div className="my-auto py-12 flex flex-col items-center justify-center animate-pulse">
              <span className="text-7xl mb-4 animate-bounce">🙈</span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-800">
                CLOSE YOUR EYES! (NHẮM MẮT LẠI!)
              </h2>
              <p className="text-sm font-bold text-stone-500 mt-2">
                Một hình ảnh bí mật sắp biến mất trong nháy mắt...
              </p>
            </div>
          )}

          {/* PHASE 3 & 4: GUESSING WHAT'S MISSING & REVEAL */}
          {(missingPhase === 'guess' || missingPhase === 'revealed') && (
            <div className="my-2">
              <p className="text-xs sm:text-sm font-bold text-stone-600 mb-4">
                Hãy nhìn kỹ: <strong>Hình ảnh nào trong 5 hình vừa rồi đã biến mất?!</strong>
              </p>

              {/* The 5 Cards with 1 Hidden Question Mark */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 my-4">
                {missingItems.map((item, idx) => {
                  const isHiddenOne = item.word === hiddenTarget?.word;

                  if (isHiddenOne && missingPhase === 'guess') {
                    // Mystery Question Mark Card
                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 bg-gradient-to-b from-purple-600 to-indigo-700 text-white rounded-2xl border-3 border-yellow-300 shadow-xl flex flex-col items-center justify-center gap-2 animate-[bounce_1.5s_infinite]"
                      >
                        <span className="text-5xl sm:text-6xl animate-pulse">❓</span>
                        <span className="font-black text-base sm:text-lg text-yellow-300">
                          WHAT'S THIS?
                        </span>
                        <span className="text-[11px] font-bold text-purple-200">
                          Hình nào ở đây?
                        </span>
                      </div>
                    );
                  }

                  if (isHiddenOne && missingPhase === 'revealed') {
                    // Revealed Missing Card with celebration glow
                    return (
                      <div
                        key={idx}
                        onClick={() => speech.speakEnglish(item.word)}
                        className="p-4 sm:p-5 bg-gradient-to-b from-emerald-500 to-teal-600 text-white rounded-2xl border-4 border-yellow-300 shadow-2xl flex flex-col items-center justify-center gap-2 ring-4 ring-emerald-300 animate-[popIn_0.3s_ease-out] cursor-pointer"
                      >
                        <span className="text-5xl sm:text-6xl animate-bounce">{item.icon}</span>
                        <span className="font-black text-base sm:text-xl text-yellow-300">
                          {item.word}
                        </span>
                        <span className="text-xs font-bold text-emerald-100">{item.viet}</span>
                      </div>
                    );
                  }

                  // Normal visible cards
                  return (
                    <div
                      key={idx}
                      onClick={() => speech.speakEnglish(item.word)}
                      className="p-4 sm:p-5 bg-gradient-to-b from-white to-stone-50 rounded-2xl border-2 border-stone-300 shadow-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-400 transition"
                    >
                      <span className="text-5xl sm:text-6xl">{item.icon}</span>
                      <span className="font-black text-base sm:text-lg text-stone-800">
                        {item.word}
                      </span>
                      <span className="text-xs text-stone-500 font-bold">{item.viet}</span>
                    </div>
                  );
                })}
              </div>

              {/* Reveal & Scoring Actions */}
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                {missingPhase === 'guess' ? (
                  <button
                    type="button"
                    onClick={handleRevealMissing}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base sm:text-lg shadow-lg border-b-4 border-purple-900 active:translate-y-1 transition flex items-center gap-2"
                  >
                    <span>👁️</span>
                    <span>MỞ ĐÁP ÁN (REVEAL)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Award Team Points if in Battle Mode */}
                    {isBattleMode && (
                      <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border">
                        <span className="text-xs font-black text-stone-600 ml-1">Cộng 100đ cho:</span>
                        <button
                          type="button"
                          onClick={() => handleAwardMissingPoint('red')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
                        >
                          🔴 Đội Đỏ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAwardMissingPoint('blue')}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs"
                        >
                          🔵 Đội Xanh
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={startNewMissingRound}
                      className="px-6 py-3 rounded-2xl bg-[#1F2421] hover:bg-stone-800 text-white font-black text-base shadow-lg transition active:scale-95 flex items-center gap-2"
                    >
                      <span>Vòng Tiếp Theo</span>
                      <ArrowRight className="w-5 h-5 text-yellow-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME MODE 3: MEMORY MATCH (CARD FLIP GAME)                           */}
      {/* ==================================================================== */}
      {activeGame === 'memory' && (
        <div className="bg-white rounded-3xl p-4 sm:p-7 shadow-lg border-2 border-stone-200/90 text-center relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl">🃏</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  Lật thẻ ghép đôi • Tìm từ & hình tương ứng
                </h3>
                <span className="text-xs text-stone-500">
                  Đã ghép đúng: <strong>{matchedPairs.length} / 6</strong> cặp • Số lượt lật: <strong>{memoryMoves}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={startNewMemoryGame}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs border transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Chơi ván mới</span>
            </button>
          </div>

          {/* 12 Memory Cards Grid (4x3 on desktop, 3x4 on mobile) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto my-3 sm:my-6">
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedCards.includes(idx);
              const isMatched = matchedPairs.includes(card.matchKey);
              const showFront = isFlipped || isMatched;

              return (
                <div
                  key={card.uid}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-32 rounded-2xl select-none cursor-pointer transition-all duration-300 transform perspective-1000 ${
                    showFront ? 'scale-102' : 'hover:scale-104 active:scale-95'
                  }`}
                >
                  {showFront ? (
                    // Card Face (Shown)
                    <div
                      className={`w-full h-full rounded-2xl p-2 flex flex-col items-center justify-center gap-1 border-3 shadow-md ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                          : 'bg-white border-amber-400 shadow-lg'
                      }`}
                    >
                      {card.type === 'picture' ? (
                        <>
                          <span className="text-4xl sm:text-5xl">{card.icon}</span>
                          <span className="text-[11px] font-bold text-stone-500 truncate">{card.viet}</span>
                        </>
                      ) : (
                        <>
                          <span className="font-black text-lg sm:text-2xl text-stone-900">
                            {card.label}
                          </span>
                          <span className="text-xs font-bold text-amber-600">{card.viet}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    // Card Back (Hidden - Playful Duolingo/Khan style)
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-b-4 border-amber-600 shadow-md flex items-center justify-center text-white text-3xl font-black">
                      <span className="opacity-80">❓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Victory Fanfare when all 6 pairs matched */}
          {matchedPairs.length >= 6 && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg sm:text-xl flex items-center justify-between gap-3 shadow-xl animate-bounce">
              <div className="flex items-center gap-2">
                <Trophy className="w-7 h-7 text-yellow-300" />
                <span>XUẤT SẮC! ĐÃ HOÀN THÀNH TẤT CẢ CÁC CẶP THẺ!</span>
              </div>
              <button
                type="button"
                onClick={startNewMemoryGame}
                className="px-4 py-2 bg-yellow-400 text-stone-950 font-black text-sm rounded-xl border-b-2 border-yellow-600 shadow"
              >
                Chơi tiếp ván mới ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
