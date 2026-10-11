import React, { useState } from 'react';
import { Volume2, RotateCcw, ArrowLeft, ArrowRight, Check, Sparkles, Shuffle, BookOpen, Plus, Trash2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

const DEFAULT_DECKS = [
  {
    id: 'deck-a01',
    title: '🎒 Lớp A01: Daily Vocabulary & Animals',
    cards: [
      {
        word: 'Giraffe',
        type: 'noun',
        ipa: '/dʒɪˈrɑːf/',
        meaning: 'Hươu cao cổ (động vật ăn lá cây trên cao)',
        example: 'The giraffe is eating green leaves from the tall tree.',
      },
      {
        word: 'Elephant',
        type: 'noun',
        ipa: '/ˈelɪfənt/',
        meaning: 'Con voi (loài thú to lớn có vòi)',
        example: 'The baby elephant is playing with water.',
      },
      {
        word: 'Brush',
        type: 'verb',
        ipa: '/brʌʃ/',
        meaning: 'Chải, đánh (răng)',
        example: 'Minh brushes his teeth every morning at 6:30 AM.',
      },
      {
        word: 'Sleep',
        type: 'verb',
        ipa: '/sliːp/',
        meaning: 'Ngủ',
        example: 'The cat is sleeping under the table.',
      },
      {
        word: 'Bright',
        type: 'adjective',
        ipa: '/braɪt/',
        meaning: 'Tươi sáng, rực rỡ',
        example: 'The yellow sun is very bright today.',
      },
    ],
  },
  {
    id: 'deck-ielts',
    title: '⚡ Pre-IELTS: Essential Collocations',
    cards: [
      {
        word: 'Pay attention to',
        type: 'collocation',
        ipa: '/peɪ əˈtenʃn tuː/',
        meaning: 'Chú ý, tập trung lắng nghe ai đó',
        example: 'Students should pay attention to Teacher Tuong Vi in class.',
      },
      {
        word: 'Do a favor',
        type: 'collocation',
        ipa: '/duː ə ˈfeɪvər/',
        meaning: 'Giúp đỡ ai một ân huệ',
        example: 'Could you do me a favor and close the door?',
      },
      {
        word: 'Make progress',
        type: 'collocation',
        ipa: '/meɪk ˈprəʊɡres/',
        meaning: 'Tiến bộ, có sự cải thiện rõ rệt',
        example: 'She has made great progress in her IELTS Speaking test.',
      },
      {
        word: 'Take advantage of',
        type: 'collocation',
        ipa: '/teɪk ədˈvɑːntɪdʒ əv/',
        meaning: 'Tận dụng triệt để cơ hội',
        example: 'You should take advantage of this online vocabulary lab.',
      },
      {
        word: 'Keep in touch',
        type: 'idiom',
        ipa: '/kiːp ɪn tʌtʃ/',
        meaning: 'Giữ liên lạc với bạn bè',
        example: 'Let us keep in touch after finishing the course.',
      },
    ],
  },
];

export default function FlashcardDeck({ onOpenAIModal }) {
  const [selectedDeckIdx, setSelectedDeckIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});

  const currentDeck = DEFAULT_DECKS[selectedDeckIdx];
  const cards = currentDeck.cards;
  const currentCard = cards[cardIdx];

  const handleFlip = () => {
    sound.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    sound.playClick();
    setIsFlipped(false);
    setCardIdx((cardIdx + 1) % cards.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setIsFlipped(false);
    setCardIdx((cardIdx - 1 + cards.length) % cards.length);
  };

  const handlePronounce = (e) => {
    e.stopPropagation();
    speech.speak(currentCard.word);
  };

  const handleToggleMastered = (e) => {
    e.stopPropagation();
    sound.playClick();
    const key = `${currentDeck.id}_${cardIdx}`;
    setMasteredCards({ ...masteredCards, [key]: !masteredCards[key] });
  };

  const isMastered = masteredCards[`${currentDeck.id}_${cardIdx}`];
  const progressPercent = Math.round(((cardIdx + 1) / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-[#1F2421]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A67C1E] bg-[#FFC600]/20 px-2.5 py-0.5 rounded border border-[#FFC600]/40">
            V ENGLISH HOUSE · VOCABULARY ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] mt-1 font-brand flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#A67C1E]" />
            <span>THẺ HỌC TỪ VỰNG TƯƠNG TÁC (FLASHCARDS)</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
            Lật thẻ 3D, nghe phát âm AI bản xứ và ghi nhớ từ vựng theo phương pháp Spaced Repetition
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAIModal}
          className="px-4 py-2 bg-[#FFC600] text-[#1F2421] text-xs font-black rounded-xl shadow-duo-yellow hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Dùng AI Tạo Bộ Thẻ Mới</span>
        </button>
      </div>

      {/* Deck Selector Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DEFAULT_DECKS.map((deck, idx) => (
          <button
            key={deck.id}
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedDeckIdx(idx);
              setCardIdx(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition border whitespace-nowrap ${
              selectedDeckIdx === idx
                ? 'bg-[#FFC600] text-[#1F2421] border-[#FFC600] shadow-duo-yellow'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            {deck.title}
          </button>
        ))}
      </div>

      {/* Progress & Card Counter */}
      <div className="max-w-xl mx-auto mb-4 flex items-center justify-between text-xs text-stone-500 font-bold">
        <span>
          Thẻ <strong className="text-[#A67C1E] text-sm">{cardIdx + 1}</strong> / {cards.length}
        </span>
        <div className="w-48 bg-stone-200 h-2.5 rounded-full overflow-hidden border border-stone-300">
          <div
            className="bg-[#FFC600] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="max-w-xl mx-auto perspective-1000 my-4">
        <div
          onClick={handleFlip}
          className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-500 transform border-2 shadow-xl relative select-none flex flex-col justify-between ${
            isFlipped
              ? 'bg-[#FFFDF6] border-[#FFC600] shadow-2xl rotate-y-180'
              : 'bg-white border-stone-200 hover:border-[#FFC600] hover:shadow-2xl'
          }`}
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#A67C1E] bg-[#FFC600]/20 px-2.5 py-1 rounded-lg border border-[#FFC600]/40">
              {currentCard.type}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePronounce}
                className="p-2 bg-stone-100 hover:bg-[#FFC600] hover:text-[#1F2421] rounded-xl text-[#A67C1E] transition border border-stone-200"
                title="Nghe phát âm chuẩn bản xứ"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleMastered}
                className={`p-2 rounded-xl transition border ${
                  isMastered
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow'
                    : 'bg-stone-100 text-stone-400 border-stone-200 hover:text-emerald-600'
                }`}
                title={isMastered ? 'Đã thuộc từ này' : 'Đánh dấu đã thuộc'}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="my-auto text-center py-4">
            {!isFlipped ? (
              // FRONT: Target Word
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#1F2421] font-brand tracking-tight">
                  {currentCard.word}
                </h3>
                <p className="text-sm font-mono text-stone-500 font-bold mt-2">{currentCard.ipa}</p>
                <span className="inline-block mt-4 text-[11px] text-[#A67C1E] font-bold bg-[#FFC600]/15 px-3.5 py-1 rounded-full border border-[#FFC600]/30 animate-pulse">
                  Chạm để lật xem nghĩa & câu ví dụ ↻
                </span>
              </div>
            ) : (
              // BACK: Meaning & Example
              <div className="space-y-3">
                <span className="text-xs uppercase font-black tracking-wider text-[#A67C1E] block">
                  Ý NGHĨA TIẾNG VIỆT
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#1F2421] leading-snug">
                  {currentCard.meaning}
                </h4>

                <div className="pt-3 border-t border-stone-200 text-left bg-white p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                    CÂU VÍ DỤ MINH HỌA:
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium italic">
                    "{currentCard.example}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Hint */}
          <div className="text-center text-[10px] text-stone-400 font-semibold">
            {isFlipped ? 'Chạm lại để xem mặt trước' : 'Mẹo: Bấm loa để luyện nghe & nói theo'}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-3 bg-white hover:bg-stone-100 text-stone-700 rounded-2xl font-bold text-xs border border-stone-300 transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thẻ Trước</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="px-6 py-3 bg-[#1F2421] hover:bg-black text-[#FFC600] rounded-2xl font-black text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Lật Thẻ</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-3 bg-[#FFC600] hover:brightness-105 text-[#1F2421] rounded-2xl font-black text-xs shadow-duo-yellow transition flex items-center gap-1.5 active:scale-95"
        >
          <span>Thẻ Tiếp</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
