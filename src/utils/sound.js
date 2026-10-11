// Web Audio API Synthesizer for Kahoot/Quizizz style gamified sound effects

let audioCtx = null;
let isMuted = false;
let lobbyInterval = null;
let raceMusicInterval = null;
let raceMusicStep = 0;
let isUrgentRace = false;
let noiseBuffer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getNoiseBuffer(ctx) {
  if (!noiseBuffer) {
    const bufferSize = ctx.sampleRate * 1.5;
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

function playDrumKick(ctx, t, volume = 0.35) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.1);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}

function playDrumSnare(ctx, t, volume = 0.22) {
  const buffer = getNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1000, t);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.14);
}

function playDrumHiHat(ctx, t, volume = 0.08) {
  const buffer = getNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(7500, t);
  filter.Q.setValueAtTime(3, t);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.04);
}

function playSynthBass(ctx, freq, t, dur = 0.1, volume = 0.2) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, t);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(750, t);
  filter.frequency.exponentialRampToValueAtTime(220, t + dur);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

function playSynthLead(ctx, freq, t, dur = 0.09, volume = 0.12) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, t);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export const sound = {
  getMuted() {
    return isMuted;
  },

  toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      if (lobbyInterval) this.stopLobbyMusic();
      if (raceMusicInterval) this.stopRaceMusic();
    }
    return isMuted;
  },

  playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  playTick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  playUrgentTick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  playCorrect() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major Arpeggio)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  },

  playWrong() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  },

  playFanfare() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Victory fanfare progression
    const sequence = [
      { freq: 523.25, time: 0, dur: 0.15 },     // C5
      { freq: 523.25, time: 0.15, dur: 0.15 },  // C5
      { freq: 523.25, time: 0.3, dur: 0.15 },   // C5
      { freq: 659.25, time: 0.45, dur: 0.4 },   // E5
      { freq: 587.33, time: 0.9, dur: 0.15 },   // D5
      { freq: 659.25, time: 1.05, dur: 0.15 },  // E5
      { freq: 783.99, time: 1.25, dur: 0.8 },   // G5 (Hold)
    ];

    sequence.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.35, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  },

  startLobbyMusic() {
    if (isMuted || lobbyInterval) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    let chordIdx = 0;
    const playBar = () => {
      if (isMuted) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      });
    };

    playBar();
    lobbyInterval = setInterval(playBar, 1200);
  },

  playWhistle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Referee / Starter Whistle (Dual frequency modulated beep)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2600, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(2850, ctx.currentTime + 0.15);
    osc1.frequency.linearRampToValueAtTime(2600, ctx.currentTime + 0.35);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2800, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(3050, ctx.currentTime + 0.15);
    osc2.frequency.linearRampToValueAtTime(2800, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  },

  playSplash() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Water bubble splash pop
    const freqs = [350, 480, 620, 280];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + idx * 0.04 + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + idx * 0.04 + 0.08);
    });
  },

  playAlarmBell() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // School / Stopwatch Bell Ringing
    const bellNotes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
    [0, 0.15, 0.3, 0.45, 0.6].forEach((timeOffset) => {
      bellNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.3);
      });
    });
  },

  stopLobbyMusic() {
    if (lobbyInterval) {
      clearInterval(lobbyInterval);
      lobbyInterval = null;
    }
  },

  // ==========================================================================
  // CAT MEOW VOCAL SYNTHESIZER (Physical acoustic modeling of cat cries)
  // ==========================================================================
  playMeow(variant = 'default') {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2.2, now);

    osc.type = 'sawtooth';
    let baseFreq = 480;
    if (variant === 'kitten') baseFreq = 620;
    else if (variant === 'deep') baseFreq = 380;
    else if (variant === 'excited') baseFreq = 540;

    // Feline vocal formant contour: M - E - O - W
    osc.frequency.setValueAtTime(baseFreq * 0.92, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.75, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.78, now + 0.52);

    // Vocal cord vibrato (~6.5 Hz)
    vibrato.frequency.setValueAtTime(6.5, now);
    vibratoGain.gain.setValueAtTime(20, now);
    vibrato.connect(osc.frequency);

    // Dynamic mouth filter formant sweep
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1900, now + 0.18);
    filter.frequency.linearRampToValueAtTime(650, now + 0.52);

    // Volume envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    gain.gain.setValueAtTime(0.28, now + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    vibrato.start(now);
    osc.start(now);
    vibrato.stop(now + 0.52);
    osc.stop(now + 0.52);
  },

  playQuickMew(variant = 'default') {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.0, now);

    osc.type = 'sawtooth';
    const baseFreq = variant === 'kitten' ? 680 : variant === 'deep' ? 420 : 540;

    // Short chirp: "Mew!" (~0.2s)
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, now + 0.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  },

  playVictoryMeow() {
    if (isMuted) return;
    this.playQuickMew('excited');
    setTimeout(() => this.playMeow('kitten'), 180);
    setTimeout(() => this.playMeow('default'), 460);
  },

  // ==========================================================================
  // TOURNAMENT RACING BATTLE SOUNDTRACK (134 BPM Arcade groove & urgent mode)
  // ==========================================================================
  startRaceMusic({ urgent = false } = {}) {
    if (isMuted || raceMusicInterval) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    isUrgentRace = urgent;
    raceMusicStep = 0;

    const bassNotes = [
      65.41, 65.41, 130.81, 116.54, 65.41, 77.78, 87.31, 98.00,
      65.41, 65.41, 103.83, 116.54, 65.41, 77.78, 87.31, 98.00
    ];

    const leadNotes = [
      523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 587.33, 523.25,
      659.25, 783.99, 880.00, 1046.50, 1174.66, 1046.50, 880.00, 783.99
    ];

    const playStep = () => {
      if (isMuted) return;
      const t = ctx.currentTime;
      const step = raceMusicStep % 16;
      raceMusicStep++;

      // 1. Kick on beats 0, 4, 8, 12
      if (step % 4 === 0) {
        playDrumKick(ctx, t, 0.32);
      }

      // 2. Snare on beats 4, 12
      if (step === 4 || step === 12) {
        playDrumSnare(ctx, t, 0.22);
      }

      // 3. Hi-Hat on 16th notes
      playDrumHiHat(ctx, t, step % 2 === 0 ? 0.08 : 0.04);

      // 4. Driving Bassline
      const bassFreq = bassNotes[step];
      playSynthBass(ctx, bassFreq, t, 0.1, 0.18);

      // 5. Arcade Lead Melody Arpeggio
      const leadFreq = leadNotes[step] * (isUrgentRace ? 1.122 : 1.0);
      playSynthLead(ctx, leadFreq, t, 0.085, isUrgentRace ? 0.15 : 0.11);
    };

    const stepInterval = isUrgentRace ? 95 : 112;
    playStep();
    raceMusicInterval = setInterval(playStep, stepInterval);
  },

  setRaceMusicUrgent(urgent) {
    if (isUrgentRace === urgent) return;
    isUrgentRace = urgent;
    if (raceMusicInterval) {
      clearInterval(raceMusicInterval);
      raceMusicInterval = null;
      this.startRaceMusic({ urgent: true });
    }
  },

  stopRaceMusic() {
    if (raceMusicInterval) {
      clearInterval(raceMusicInterval);
      raceMusicInterval = null;
    }
    raceMusicStep = 0;
    isUrgentRace = false;
  }
};
