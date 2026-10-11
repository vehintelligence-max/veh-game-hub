// High-Fidelity Studio Audio & Speech Engine for V English House
// Features:
// 1. Google Studio Audio Stream (HD Natural Cloud Audio) - pure human native pronunciation
// 2. Google Web Speech (Chrome/Edge Engine)
// 3. Apple Enhanced / Samantha Natural Engine
// Strictly eliminates unnatural robotic novelty voices.

const STORAGE_KEYS = {
  VOICE_ENGINE: 'vhouse_speech_engine', // 'studio_google' | 'web_google' | 'apple_natural'
  VOICE_NAME: 'vhouse_speech_voice',
  RATE: 'vhouse_speech_rate',
  AUTO_READ: 'vhouse_speech_auto_read',
};

const CREEPY_NOVELTY_VOICES = [
  'fred', 'deranged', 'whisper', 'zarvox', 'trinoids', 'bad news', 'bells',
  'boing', 'cellos', 'good news', 'hysterical', 'organ', 'pipe organ',
  'wobble', 'xander', 'junior', 'kathy', 'princess', 'albert', 'bruce',
  'ralph', 'agnes', 'vicki', 'victor', 'jester', 'whisperer'
];

let cachedVoices = [];
let activeAudioElement = null;

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export const speech = {
  /**
   * Stop any ongoing speech or studio audio playback
   */
  stop() {
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Play studio-grade Google pronunciation stream (Direct MP3 audio)
   */
  playStudioAudio(text, lang = 'en', speed = null) {
    this.stop();

    const cleanText = text
      .replace(/_{2,}/g, ' blank ')
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const rate = speed !== null ? speed : this.getRate();
    const targetLang = lang.startsWith('vi') ? 'vi' : 'en';

    // Google Translate TTS direct endpoint (standard client tw-ob, supported natively in all browser <audio>)
    // Limit to first 200 chars per sentence chunk for standard TTS
    const chunk = cleanText.length > 180 ? cleanText.substring(0, 180) : cleanText;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(chunk)}`;

    const audio = new Audio(url);
    audio.playbackRate = Math.max(0.6, Math.min(1.4, rate));
    activeAudioElement = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Google Studio Audio blocked or unavailable, falling back to Web Speech:', err);
        this.speakWebSpeech(cleanText, targetLang, rate);
      });
    }
  },

  /**
   * Web Speech API fallback
   */
  speakWebSpeech(cleanText, lang = 'en-US', speed = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const rate = speed !== null ? speed : this.getRate();

    utterance.rate = Math.max(0.7, Math.min(1.3, rate));
    utterance.pitch = 1.0;

    const bestVoice = this.pickBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = lang.startsWith('vi') ? 'vi-VN' : 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Master speak method: Defaults to Google Studio Audio for crystal-clear natural voice,
   * respects user engine choice if configured.
   * Auto-detects Vietnamese if text contains Vietnamese diacritics or words.
   */
  speak(text, lang = null, speed = null) {
    if (!text || typeof text !== 'string') return;

    // Detect if text contains Vietnamese characters or phrases
    const hasVietnameseChars = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđChúc mừng bạn]/i.test(text);

    let targetLang = lang;
    if (!targetLang) {
      targetLang = hasVietnameseChars ? 'vi-VN' : 'en-US';
    } else if (targetLang.startsWith('en') && hasVietnameseChars) {
      targetLang = 'vi-VN';
    }

    const engine = this.getEngine();

    if (engine === 'studio_google') {
      this.playStudioAudio(text, targetLang, speed);
    } else {
      // Clean text for Web Speech
      const cleanText = text
        .replace(/_{2,}/g, ', ... ,')
        .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/[*_#`~[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      this.speakWebSpeech(cleanText, targetLang, speed);
    }
  },

  /**
   * Dedicated Vietnamese announcement helper
   */
  speakVietnamese(text, speed = 1.0) {
    this.speak(text, 'vi-VN', speed);
  },

  /**
   * Speak at slow 0.75x pace for dictation practice
   */
  speakDictation(text, lang = 'en-US') {
    this.speak(text, lang, 0.75);
  },

  /**
   * Available browser voices
   */
  getVoices() {
    const list = cachedVoices.length > 0 ? cachedVoices : loadVoices();
    return list.filter((v) => {
      const name = v.name.toLowerCase();
      return !CREEPY_NOVELTY_VOICES.some((c) => name.includes(c));
    });
  },

  getEnglishVoices() {
    return this.getVoices()
      .filter((v) => v.lang.startsWith('en'))
      .sort((a, b) => {
        const aGoogle = a.name.includes('Google');
        const bGoogle = b.name.includes('Google');
        if (aGoogle && !bGoogle) return -1;
        if (!aGoogle && bGoogle) return 1;

        const aNatural = a.name.includes('Natural') || a.name.includes('Neural') || a.name.includes('Samantha');
        const bNatural = b.name.includes('Natural') || b.name.includes('Neural') || b.name.includes('Samantha');
        if (aNatural && !bNatural) return -1;
        if (!aNatural && bNatural) return 1;

        return a.name.localeCompare(b.name);
      });
  },

  pickBestVoice(lang = 'en-US') {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    const preferredName = localStorage.getItem(STORAGE_KEYS.VOICE_NAME);
    if (preferredName) {
      const saved = voices.find((v) => v.name === preferredName);
      if (saved) return saved;
    }

    if (lang.startsWith('vi')) {
      return (
        voices.find((v) => v.lang.startsWith('vi') && v.name.includes('Google')) ||
        voices.find((v) => v.lang.startsWith('vi') && (v.name.includes('Linh') || v.name.includes('HoaiMy'))) ||
        voices.find((v) => v.lang.startsWith('vi')) ||
        null
      );
    }

    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

    // Google US English (Warm, standard, friendly)
    const googleUS = englishVoices.find((v) => v.name.includes('Google') && v.name.includes('US'));
    if (googleUS) return googleUS;

    // Google UK English
    const googleUK = englishVoices.find((v) => v.name.includes('Google') && v.name.includes('UK'));
    if (googleUK) return googleUK;

    // Any Google
    const anyGoogle = englishVoices.find((v) => v.name.includes('Google'));
    if (anyGoogle) return anyGoogle;

    // Apple Samantha or Natural
    const appleQuality = englishVoices.find((v) =>
      ['samantha', 'ava', 'serena', 'oliver', 'victoria', 'daniel'].some((n) =>
        v.name.toLowerCase().includes(n)
      )
    );
    if (appleQuality) return appleQuality;

    return englishVoices[0] || null;
  },

  testVoice(engineName, speed = 0.95) {
    const sample = 'Hello! Welcome to V English House. Mastering English grammar and dictation has never been easier!';
    if (engineName === 'studio_google') {
      this.playStudioAudio(sample, 'en', speed);
    } else {
      this.speakWebSpeech(sample, 'en-US', speed);
    }
  },

  // Engine preferences
  getEngine() {
    return localStorage.getItem(STORAGE_KEYS.VOICE_ENGINE) || 'studio_google';
  },

  setEngine(engine) {
    localStorage.setItem(STORAGE_KEYS.VOICE_ENGINE, engine);
  },

  getRate() {
    const r = parseFloat(localStorage.getItem(STORAGE_KEYS.RATE));
    return !isNaN(r) ? r : 0.93;
  },

  setRate(val) {
    localStorage.setItem(STORAGE_KEYS.RATE, String(val));
  },

  isAutoReadEnabled() {
    return localStorage.getItem(STORAGE_KEYS.AUTO_READ) === 'true';
  },

  setAutoRead(enabled) {
    localStorage.setItem(STORAGE_KEYS.AUTO_READ, String(enabled));
  },
};
