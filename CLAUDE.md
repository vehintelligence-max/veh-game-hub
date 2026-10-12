# V ENGLISH HOUSE — INTERACTIVE LEARNING & GAME HUB
> Comprehensive Project Handover & Architecture Guide for Claude & ChatGPT

## 1. Project Overview
**V English House Game Hub** is a comprehensive, gamified classroom engagement platform built for English teachers and students. It is designed to be projected onto big TV screens, classroom projectors, and used interactively on laptops and tablets.

- **GitHub Repository**: [https://github.com/vehintelligence-max/veh-game-hub](https://github.com/vehintelligence-max/veh-game-hub)
- **Local Directory**: `quiz-party/`
- **Main Port**: `http://localhost:3000` (Production Node server + Socket.io) or `http://localhost:5173` (Vite Dev Server)

---

## 2. Technology Stack
- **Frontend**: React 18, Vite 6, Tailwind CSS (with custom utility classes and animations)
- **UI & Icons**: `lucide-react`, `canvas-confetti`
- **Backend / Realtime**: Node.js (ES modules), Express, `socket.io` (for multiplayer Kahoot-style game)
- **Audio & Sound**: 
  - Pure Web Audio API synthesized procedural sounds (`src/utils/sound.js`): no external asset loading required, ultra-low latency.
  - Native High-Fidelity Natural English Speech Synthesis (`src/utils/speech.js`): automatically uses Apple Samantha/Enhanced or Google US English for native authentic pronunciation.
  - Server-side Google TTS audio proxy stream (`/api/tts` in `server.js`).

---

## 3. How to Run & Build
```bash
# 1. Install dependencies
npm install

# 2. Build frontend production assets
npm run build

# 3. Start full-stack server (Serves dist/ frontend + Socket.io + TTS proxy)
node server.js
# -> Accessible at http://localhost:3000

# (Optional) Run Vite standalone development mode
npm run dev
# -> Accessible at http://localhost:5173
```

---

## 4. Key Components Map & Architecture
```
src/
├── App.jsx                     # Master Controller: mainTab switcher, Socket.io rooms, global state
├── main.jsx                    # React entry point
├── index.css                   # Custom keyframe animations (catGallop, dustPuff, comicPop, fairyLight)
│
├── components/
│   ├── Navbar.jsx              # Sticky header: Role selector, Search, Theme picker, Sound mute, Tab pills
│   ├── SideDrawer.jsx          # Mobile & slide-out navigation drawer for all hub modules
│   │
│   ├── CatRaceTimer.jsx        # 🐱🏆 Cat IQ Race & Christmas Reindeer Race:
│   │                           # - Athletic stadium vs Frozen North Pole Christmas ice track
│   │                           # - Reindeer mount with Cat rider, Rudolph glowing nose, sleigh bells
│   │                           # - Checkpoints & Knowledge Stations (pauses race for student questions)
│   │                           # - Sleek Sports Live Ticker (~40px compact broadcast bar with collapse toggle)
│   │                           # - Fit Screen Mode (flex-1 dynamic lane heights, fits 100% viewport)
│   │                           # - Slapstick comic clash physics (side-kicks, banana slips, tuna turbos)
│   │
│   ├── KidsArcade.jsx          # 🧩 Khan Academy Kids & Duolingo Style Learning Zone:
│   │                           # 1. Word Scramble (Spelling): 3D tactile Duolingo tiles, outline slots, hints
│   │                           # 2. What's Missing?: 5-card memory countdown, close eyes curtain, reveal mystery
│   │                           # 3. Memory Match: 3D card flips (Word vs Picture / Meaning), pair matching
│   │                           # - 6 Rich Themes: Animals, Food, School, House, Christmas, Vehicles
│   │                           # - 2-Team Battle Mode: Red Team vs Blue Team live scoreboards
│   │
│   ├── WheelOfNames.jsx        # 🎡 Lucky Wheel Student Picker:
│   │                           # - Classic Carnival Wheel vs 🎄 Christmas Holiday Fair Wheel
│   │                           # - Rotating fairy lights, Santa hat pointer needle, Jingle Bells victory fanfare
│   │                           # - Natural English celebratory voice announcements
│   │
│   ├── DictationLab.jsx        # 🎧 YouTube & Studio Voice audio listening & typing dictation
│   ├── HangmanGame.jsx         # 🪢 Vocabulary guessing game with life counter and hints
│   ├── TicTacGame.jsx          # ⚔️ 3x3 Tic Tac Toe Trivia battle with question reveals
│   ├── DuolingoPracticeView.jsx# 🦉 Self-paced practice with XP, hearts, and streaks
│   ├── FlashcardDeck.jsx       # 🃏 3D interactive flip flashcards
│   ├── HostView.jsx            # 👑 Kahoot Host Console: Question screen, player countdown, live bar chart
│   ├── PlayerView.jsx          # 📱 Kahoot Student Controller: 4 color answer buttons (Triangle, Diamond, Circle, Square)
│   ├── SplitView.jsx           # 🖥️ Split Host & Player preview on a single test screen
│   ├── VHouseCurriculumHub.jsx # 📚 Unit curriculum repository, target vocabularies, grammar focus
│   ├── ClassManagement.jsx     # 🎓 Student roster manager, houses, and power-up points
│   ├── PowerUpLeaderboard.jsx  # 🏆 Gryffindor/Slytherin style house cup ranking leaderboard
│   ├── AIGeneratorModal.jsx    # 🤖 AI Quiz creator from lesson notes or topics
│   ├── QuizEditorModal.jsx     # ✏️ Manual quiz question & answer editor
│   ├── VoiceSettingsModal.jsx  # 🎙️ Google Studio & Web Speech voice configuration modal
│   └── VLogo.jsx               # V English House corporate SVG brand logo
│
├── data/
│   └── defaultQuizzes.js       # Default curriculum quizzes & 4-color answer themes (V-House, Classic, Pastel, Neon)
│
└── utils/
    ├── sound.js                # Web Audio API procedural sound synthesizer (Click, Tick, Fanfare, Whistle, Bells, Meow)
    └── speech.js               # High-fidelity natural English Text-To-Speech engine
```

---

## 5. Coding & Design Conventions
1. **Khan Academy Kids & Duolingo Visual Polish**:
   - Chunky, tactile 3D buttons: `border-2 border-b-4 hover:border-b-2 active:border-b-0 active:translate-y-1`.
   - Soft pastel backgrounds, high-contrast typography, large legible text for TV/projector viewing across classrooms.
   - Rounded containers: `rounded-2xl` or `rounded-3xl`, clean drop shadows.
2. **Audio & Pronunciation**:
   - Always call `speech.speakEnglish(text)` for English words.
   - Always call `sound.playClick()`, `sound.playCorrect()`, `sound.playWrong()`, or `sound.playFanfare()` for interactive feedback.
3. **No External Asset Dependencies**:
   - All sounds and animations are synthesized or SVG-based; no missing audio MP3s or broken image URLs.

---

## 6. How Claude / ChatGPT Should Continue Developing
When asking Claude or ChatGPT to add a new game or modify existing components:
- **Reference existing utilities**: Use `sound.js` for audio and `speech.js` for voice pronunciation.
- **Maintain responsive viewport fitting**: Keep `fitScreenMode` and `max-w-[1720px]` conventions so games always fit on screen without vertical scrollbars at 100% browser zoom.
- **Support 2-Team Competition**: Kids love Team Red vs Team Blue battles!
