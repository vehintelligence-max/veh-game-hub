// High-Fidelity Studio Audio & Speech Engine for V English House
// Features:
// 1. Google Studio Audio Stream (/api/tts proxy) - Authentic native Vietnamese ("Chị Google" chuẩn 100%) & English
// 2. Google Web Speech (Chrome/Edge Engine)
// 3. Apple Enhanced / Samantha Natural Engine (strictly for English)
// Strictly eliminates unnatural robotic novelty voices and English phonetic mangling of Vietnamese words.

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

/**
 * Split text into readable chunks under maxLen characters at word boundaries
 */
function splitIntoChunks(text, maxLen = 170) {
  if (text.length <= maxLen) return [text];
  const words = text.split(/\s+/);
  const chunks = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.substring(0, maxLen)];
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
   * Play studio-grade Google pronunciation stream (/api/tts proxy)
   * Guaranteed 100% authentic native Google Voice ("Chị Google" tiếng Việt chuẩn)
   */
  playStudioAudio(text, lang = 'vi', speed = null) {
    this.stop();

    const cleanText = text
      .replace(/_{2,}/g, ' ')
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const rate = speed !== null ? speed : this.getRate();
    const targetLang = (lang && String(lang).toLowerCase().startsWith('vi')) ? 'vi' : 'en';

    // Break into sentence chunks if necessary so TTS endpoint never truncates
    const chunks = splitIntoChunks(cleanText, 170);
    let currentIndex = 0;

    const playNextChunk = () => {
      if (currentIndex >= chunks.length) {
        activeAudioElement = null;
        return;
      }

      const chunk = chunks[currentIndex++];
      const ttsUrl = `/api/tts?tl=${encodeURIComponent(targetLang)}&text=${encodeURIComponent(chunk)}`;

      const audio = new Audio(ttsUrl);
      audio.playbackRate = Math.max(0.6, Math.min(1.4, rate));
      activeAudioElement = audio;

      audio.onended = () => {
        playNextChunk();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Studio TTS Proxy] Audio play failed, evaluating fallback:', err);
          // If Vietnamese, ONLY fallback to WebSpeech if a real Vietnamese voice is installed
          this.speakWebSpeech(chunk, targetLang, rate);
        });
      }
    };

    playNextChunk();
  },

  /**
   * Web Speech API fallback
   * Strictly prevents non-Vietnamese voices from mangling Vietnamese sentences
   */
  speakWebSpeech(cleanText, lang = 'en-US', speed = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const isVi = String(lang).toLowerCase().startsWith('vi');
    const bestVoice = this.pickBestVoice(lang);

    // CRITICAL: If Vietnamese text, NEVER allow an English voice (e.g. Samantha, Fred)
    // to read it, because it produces incomprehensible phonetic gibberish!
    if (isVi) {
      const isAuthenticViVoice = bestVoice && (
        bestVoice.lang.toLowerCase().startsWith('vi') ||
        bestVoice.name.toLowerCase().includes('vietnam') ||
        bestVoice.name.toLowerCase().includes('tiếng việt') ||
        bestVoice.name.toLowerCase().includes('linh') ||
        bestVoice.name.toLowerCase().includes('hoaimy')
      );

      if (!isAuthenticViVoice) {
        console.warn('[Speech Engine] No authentic Vietnamese voice found in WebSpeech. Suppressed English phonetic mangling.');
        return;
      }
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const rate = speed !== null ? speed : this.getRate();

    utterance.rate = Math.max(0.7, Math.min(1.3, rate));
    utterance.pitch = 1.0;

    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = isVi ? 'vi-VN' : 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Master speak method:
   * Defaults to Google Studio Audio for Vietnamese (crystal-clear native Chị Google voice).
   * Supports English studio stream or user-chosen Web Speech voice.
   */
  speak(text, lang = null, speed = null) {
    if (!text || typeof text !== 'string') return;

    // Detect if text contains Vietnamese characters, diacritics, or common Vietnamese phrases
    const hasVietnameseChars = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐChúc mừng bạn mèo chiến thắng về đích]/i.test(text);

    let targetLang = lang;
    if (!targetLang) {
      targetLang = hasVietnameseChars ? 'vi-VN' : 'en-US';
    } else if (hasVietnameseChars && !targetLang.startsWith('vi')) {
      targetLang = 'vi-VN';
    }

    const isVi = targetLang.startsWith('vi');

    // For Vietnamese, ALWAYS use Google Studio Audio proxy (/api/tts)
    // to guarantee 100% natural native pronunciation
    if (isVi) {
      this.playStudioAudio(text, 'vi', speed);
      return;
    }

    // For English: respect user engine setting or default to studio_google
    const engine = this.getEngine();
    if (engine === 'studio_google') {
      this.playStudioAudio(text, 'en', speed);
    } else {
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
   * Dedicated Vietnamese announcement helper (e.g. Cat Race, Wheel of Names, Hangman)
   * Plays authentic native Vietnamese "Chị Google" voice
   */
  speakVietnamese(text, speed = 1.0) {
    this.playStudioAudio(text, 'vi', speed);
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

  testVoice(voiceName = null, speed = null) {
    const rate = speed !== null ? speed : this.getRate();
    if (voiceName) {
      this.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Hello! Welcome to V English House. Mastering English grammar is easy!');
        utterance.rate = rate;
        const voices = this.getVoices();
        const found = voices.find((v) => v.name === voiceName);
        if (found) utterance.voice = found;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      this.speak('Hello! Welcome to V English House.', 'en-US', rate);
    }
  },

  // Preferred Voice getters/setters
  getPreferredVoice() {
    return localStorage.getItem(STORAGE_KEYS.VOICE_NAME) || '';
  },

  setPreferredVoice(name) {
    localStorage.setItem(STORAGE_KEYS.VOICE_NAME, name);
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
