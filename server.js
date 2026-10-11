import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// High-Fidelity Vietnamese & English Text-to-Speech Proxy endpoint (Real native human voice)
app.get('/api/tts', (req, res) => {
  const text = String(req.query.text || '').trim();
  const lang = String(req.query.lang || req.query.tl || 'vi').toLowerCase();
  if (!text) {
    return res.status(400).send('Missing text parameter');
  }

  const targetLang = lang.startsWith('vi') ? 'vi' : 'en';
  const chunk = text.length > 200 ? text.substring(0, 200) : text;
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(chunk)}`;

  const request = https.get(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  }, (ttsRes) => {
    if (ttsRes.statusCode !== 200) {
      console.warn(`[TTS Proxy] Upstream status: ${ttsRes.statusCode}`);
      return res.status(ttsRes.statusCode).send('TTS upstream error');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    ttsRes.pipe(res);
  });

  request.on('error', (err) => {
    console.error('[TTS Proxy Error]', err);
    if (!res.headersSent) {
      res.status(500).send('Internal TTS error');
    }
  });
});

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const BOT_NAMES = ['An_Ninja', 'Bảo_Pro', 'Chi_Coder', 'Dũng_Gamer', 'Hải_Fast', 'Linh_Smart', 'Minh_Bot'];
const AVATARS = ['🦊', '🐱', '🐶', '🦁', '🐼', '🦄', '🚀', '🤖', '👾', '🔥', '⚡', '👑'];

// In-memory Game Rooms store
// roomPin -> { pin, hostSocketId, quiz, state, currentQIndex, players: {}, timer, timerRemaining, answersCount }
const rooms = new Map();

function generatePin() {
  let pin;
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(pin));
  return pin;
}

function calculateScore(timeLimit, timeTaken, basePoints = 1000) {
  // Kahoot formula: fast answers get up to base points, half minimum for correct
  const fraction = Math.max(0, Math.min(1, timeTaken / timeLimit));
  const multiplier = 1 - fraction * 0.5;
  return Math.round(basePoints * multiplier);
}

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // HOST: Create Room
  socket.on('host:create_room', ({ quiz }, callback) => {
    const pin = generatePin();
    const room = {
      pin,
      hostSocketId: socket.id,
      quiz,
      state: 'LOBBY', // LOBBY, COUNTDOWN, QUESTION, REVEAL, LEADERBOARD, PODIUM
      currentQIndex: 0,
      players: {}, // socketId/botId -> { id, name, avatar, score, streak, isBot, lastAnswer: null }
      timer: null,
      timeRemaining: 0,
      questionStartTime: 0,
      answerStats: [0, 0, 0, 0],
    };

    rooms.set(pin, room);
    socket.join(pin);
    console.log(`[Host] Created room ${pin} with quiz "${quiz.title}"`);
    callback({ success: true, pin });
  });

  // HOST: Add Bots for testing
  socket.on('host:add_bots', ({ pin, count = 3 }) => {
    const room = rooms.get(pin);
    if (!room || room.state !== 'LOBBY') return;

    for (let i = 0; i < count; i++) {
      const botId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const randomName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + '_' + Math.floor(Math.random() * 99);
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

      room.players[botId] = {
        id: botId,
        name: randomName,
        avatar: randomAvatar,
        score: 0,
        streak: 0,
        isBot: true,
        lastAnswer: null,
      };
    }

    io.to(pin).emit('room:players_updated', {
      players: Object.values(room.players),
    });
  });

  // PLAYER: Join Room
  socket.on('player:join', ({ pin, name, avatar }, callback) => {
    const room = rooms.get(pin);
    if (!room) {
      return callback({ success: false, error: 'Mã PIN phòng không tồn tại!' });
    }
    if (room.state !== 'LOBBY') {
      return callback({ success: false, error: 'Trò chơi đã bắt đầu hoặc kết thúc!' });
    }

    const playerId = socket.id;
    room.players[playerId] = {
      id: playerId,
      name: name || `Người chơi ${Object.keys(room.players).length + 1}`,
      avatar: avatar || '🚀',
      score: 0,
      streak: 0,
      isBot: false,
      lastAnswer: null,
    };

    socket.join(pin);
    socket.data.roomPin = pin;
    socket.data.playerId = playerId;

    callback({ success: true, pin, player: room.players[playerId] });

    io.to(pin).emit('room:players_updated', {
      players: Object.values(room.players),
    });
  });

  // HOST: Start Game
  socket.on('host:start_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || socket.id !== room.hostSocketId) return;

    room.currentQIndex = 0;
    startQuestion(room);
  });

  // HOST: Next Question or Leaderboard
  socket.on('host:next', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || socket.id !== room.hostSocketId) return;

    if (room.state === 'REVEAL') {
      // Move to Leaderboard
      room.state = 'LEADERBOARD';
      const sortedPlayers = Object.values(room.players)
        .sort((a, b) => b.score - a.score);

      io.to(pin).emit('game:leaderboard', {
        leaderboard: sortedPlayers,
        isFinal: room.currentQIndex >= room.quiz.questions.length - 1,
      });
    } else if (room.state === 'LEADERBOARD') {
      if (room.currentQIndex < room.quiz.questions.length - 1) {
        room.currentQIndex++;
        startQuestion(room);
      } else {
        // Final podium
        room.state = 'PODIUM';
        const sortedPlayers = Object.values(room.players)
          .sort((a, b) => b.score - a.score);

        io.to(pin).emit('game:podium', {
          podium: sortedPlayers.slice(0, 5),
        });
      }
    }
  });

  // PLAYER: Submit Answer (Supports Multi-Format: choice, blank, true_false, scramble)
  socket.on('player:answer', ({ pin, optionIndex, textAnswer, scrambleAnswer }) => {
    const room = rooms.get(pin);
    if (!room || room.state !== 'QUESTION') return;

    const playerId = socket.id;
    const player = room.players[playerId];
    if (!player || player.lastAnswer !== null) return; // already answered

    const currentQ = room.quiz.questions[room.currentQIndex];
    const qType = currentQ.type || 'choice';
    const timeTaken = (Date.now() - room.questionStartTime) / 1000;

    let isCorrect = false;
    let recordedOptionIndex = typeof optionIndex === 'number' ? optionIndex : 0;
    let submittedValue = textAnswer || optionIndex;

    const normalize = (str) => String(str || '').trim().toLowerCase().replace(/[.,!?'"`’\-]/g, '').replace(/\s+/g, ' ');

    if (qType === 'blank') {
      const cleanInput = normalize(textAnswer);
      const targetCorrect = normalize(currentQ.correctAnswer || currentQ.options?.find((o) => o.isCorrect)?.text);
      const acceptableList = (currentQ.acceptableAnswers || []).map(normalize);

      isCorrect = (cleanInput && cleanInput === targetCorrect) || acceptableList.includes(cleanInput);
      recordedOptionIndex = isCorrect ? 0 : 1;
      submittedValue = textAnswer;
    } else if (qType === 'scramble') {
      const cleanSubmitted = normalize(Array.isArray(scrambleAnswer) ? scrambleAnswer.join(' ') : scrambleAnswer);
      const cleanTarget = normalize(currentQ.originalSentence || currentQ.text);
      isCorrect = cleanSubmitted === cleanTarget;
      recordedOptionIndex = isCorrect ? 0 : 1;
      submittedValue = Array.isArray(scrambleAnswer) ? scrambleAnswer.join(' ') : scrambleAnswer;
    } else {
      // 'choice' or 'true_false'
      isCorrect = currentQ.options[optionIndex]?.isCorrect || false;
      recordedOptionIndex = optionIndex;
      submittedValue = optionIndex;
    }

    let pointsAwarded = 0;
    if (isCorrect) {
      const basePts = calculateScore(currentQ.timeLimit, timeTaken, currentQ.points || 1000);
      player.streak++;
      const streakBonus = Math.min(500, player.streak * 50);
      pointsAwarded = basePts + streakBonus;
      player.score += pointsAwarded;
    } else {
      player.streak = 0;
    }

    player.lastAnswer = {
      optionIndex: recordedOptionIndex,
      submittedValue,
      isCorrect,
      pointsAwarded,
      streak: player.streak,
    };

    if (room.answerStats && room.answerStats[recordedOptionIndex] !== undefined) {
      room.answerStats[recordedOptionIndex]++;
    }

    // Send instant private feedback to player
    socket.emit('player:answer_result', {
      isCorrect,
      pointsAwarded,
      totalScore: player.score,
      streak: player.streak,
      submittedValue,
    });

    // Notify host about answered count
    const totalAnswered = Object.values(room.players).filter((p) => p.lastAnswer !== null).length;
    io.to(room.hostSocketId).emit('host:answer_update', {
      answeredCount: totalAnswered,
      totalPlayers: Object.keys(room.players).length,
    });

    // Check if everyone has answered
    if (totalAnswered >= Object.keys(room.players).length) {
      endQuestionEarly(room);
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const pin = socket.data?.roomPin;
    if (!pin) return;

    const room = rooms.get(pin);
    if (!room) return;

    if (socket.id === room.hostSocketId) {
      // Host left, notify everyone
      io.to(pin).emit('room:closed', { message: 'Chủ phòng đã thoát trò chơi.' });
      clearInterval(room.timer);
      rooms.delete(pin);
    } else {
      // Player left
      delete room.players[socket.id];
      io.to(pin).emit('room:players_updated', {
        players: Object.values(room.players),
      });
    }
  });
});

function startQuestion(room) {
  if (room.timer) clearInterval(room.timer);

  const currentQ = room.quiz.questions[room.currentQIndex];
  const qType = currentQ.type || 'choice';

  room.state = 'QUESTION';
  room.answerStats = [0, 0, 0, 0];
  room.timeRemaining = currentQ.timeLimit;
  room.questionStartTime = Date.now();

  // Reset player answers for this round
  Object.values(room.players).forEach((p) => {
    p.lastAnswer = null;
  });

  // Simulate bots answering automatically
  triggerBots(room, currentQ);

  // Send question payload to everyone (with question type and scramble/blank support)
  io.to(room.pin).emit('game:question_start', {
    questionIndex: room.currentQIndex,
    totalQuestions: room.quiz.questions.length,
    question: {
      id: currentQ.id,
      text: currentQ.text,
      type: qType,
      timeLimit: currentQ.timeLimit,
      originalSentence: currentQ.originalSentence || currentQ.text,
      scrambledWords: currentQ.scrambledWords || [],
      options: (currentQ.options || []).map((opt) => ({ text: opt.text })), // Hide isCorrect
    },
  });

  // Countdown timer loop
  room.timer = setInterval(() => {
    room.timeRemaining--;
    io.to(room.pin).emit('game:timer_tick', {
      timeRemaining: room.timeRemaining,
    });

    if (room.timeRemaining <= 0) {
      endQuestionEarly(room);
    }
  }, 1000);
}

function triggerBots(room, currentQ) {
  const qType = currentQ.type || 'choice';
  const correctOptIdx = currentQ.options?.findIndex((o) => o.isCorrect) ?? 0;
  const correctWord = currentQ.correctAnswer || currentQ.options?.[correctOptIdx]?.text || '';

  Object.values(room.players)
    .filter((p) => p.isBot)
    .forEach((bot) => {
      // Random answer delay between 1.5s and timeLimit - 1s
      const delay = 1500 + Math.random() * (currentQ.timeLimit * 1000 - 2500);
      setTimeout(() => {
        if (room.state !== 'QUESTION' || bot.lastAnswer !== null) return;

        // 75% chance bot answers correctly
        const isCorrect = Math.random() < 0.75;
        let chosenIndex = 0;
        let botSubmitted = null;

        if (qType === 'blank') {
          chosenIndex = isCorrect ? 0 : 1;
          botSubmitted = isCorrect ? correctWord : (currentQ.options?.[1]?.text || 'incorrect');
        } else if (qType === 'scramble') {
          chosenIndex = isCorrect ? 0 : 1;
          botSubmitted = isCorrect ? currentQ.originalSentence : (currentQ.scrambledWords || []).join(' ');
        } else {
          if (isCorrect && correctOptIdx !== -1) {
            chosenIndex = correctOptIdx;
          } else {
            chosenIndex = Math.floor(Math.random() * (currentQ.options?.length || 4));
          }
          botSubmitted = chosenIndex;
        }

        const timeTaken = delay / 1000;
        let points = 0;
        if (isCorrect) {
          bot.streak++;
          points = calculateScore(currentQ.timeLimit, timeTaken, currentQ.points || 1000) + bot.streak * 50;
          bot.score += points;
        } else {
          bot.streak = 0;
        }

        bot.lastAnswer = { optionIndex: chosenIndex, submittedValue: botSubmitted, isCorrect, pointsAwarded: points };
        if (room.answerStats[chosenIndex] !== undefined) {
          room.answerStats[chosenIndex]++;
        }

        const totalAnswered = Object.values(room.players).filter((p) => p.lastAnswer !== null).length;
        io.to(room.hostSocketId).emit('host:answer_update', {
          answeredCount: totalAnswered,
          totalPlayers: Object.keys(room.players).length,
        });

        if (totalAnswered >= Object.keys(room.players).length) {
          endQuestionEarly(room);
        }
      }, delay);
    });
}

function endQuestionEarly(room) {
  if (room.state !== 'QUESTION') return;
  if (room.timer) clearInterval(room.timer);

  room.state = 'REVEAL';
  const currentQ = room.quiz.questions[room.currentQIndex];
  const qType = currentQ.type || 'choice';
  const correctOptIdx = currentQ.options?.findIndex((o) => o.isCorrect) ?? 0;
  const correctWord = currentQ.correctAnswer || currentQ.options?.[correctOptIdx]?.text || '';

  io.to(room.pin).emit('game:question_reveal', {
    type: qType,
    correctOptionIndex: correctOptIdx,
    correctAnswer: correctWord,
    acceptableAnswers: currentQ.acceptableAnswers || [correctWord],
    originalSentence: currentQ.originalSentence || currentQ.text,
    answerStats: room.answerStats,
    explanation: currentQ.explanation || null,
  });
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

// SPA fallback
app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.send('Server is running. Please run npm run dev or npm run build.');
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 [QuizParty Engine] Server running on http://localhost:${PORT}`);
});
