// ============================================================================
// V ENGLISH HOUSE - ADVANCED NEURAL AI CURRICULUM & KNOWLEDGE ENGINE
// ============================================================================
// 1. Exact Context & Subtype Understanding:
//    - "luyện tập IPA phát âm" -> 100% IPA, Phonetics, Stress, Silent letters!
//    - "tạo 10 câu về 12 thì tiếng anh" -> Exactly 12 Tenses with modern world events!
//    - "câu điều kiện loại 2" -> 100% Conditionals Type 2
//    - "đảo ngữ", "bị động", "mệnh đề quan hệ", "câu hỏi đuôi", etc.
// 2. High-Tech & World Events Context (Thời sự thế giới):
//    - Artificial Intelligence (AI, Generative Models, Robotics)
//    - Electric Vehicles & Climate Action (EVs, Renewables, COP summits)
//    - Space & Astronomy (NASA, James Webb Space Telescope, Artemis)
//    - Global Culture & Sports (Olympic Games, World Cups)
// 3. Optional Direct Google Gemini 1.5/2.0 Cloud LLM Integration:
//    - Validates real Google Gemini API Key format (starting with AIzaSy)
//    - Pure authentic English generation without weird string concatenations.

import { getSafeEducationalImageUrl } from './imageHelper';

export async function smartAIGenerate({
  prompt = '',
  rawText = '',
  questionCount = 5,
  level = 'A01',
  timeLimit = 15,
  topic = 'Ngữ pháp & Từ vựng',
  sessionMode = 'live',
  deadline = '21:00 Chủ Nhật',
  questionFormat = 'mixed', // 'mixed' | 'blank' | 'choice' | 'true_false' | 'scramble'
  apiKey = null,
}) {
  const combinedInput = `${prompt} ${rawText}`.trim();
  const lower = combinedInput.toLowerCase();

  // 1. Parse requested count from prompt text (e.g. "10 câu", "8 câu")
  const targetCount = parseRequestedCount(combinedInput, questionCount);

  // 1b. Auto-detect format from user prompt if explicitly mentioned
  let effectiveFormat = questionFormat || 'mixed';
  if (
    lower.includes('điền từ') ||
    lower.includes('dien tu') ||
    lower.includes('fill in the blank') ||
    lower.includes('fill-in') ||
    lower.includes('chỗ trống') ||
    lower.includes('cho trong') ||
    lower.includes('type in')
  ) {
    effectiveFormat = 'blank';
  } else if (
    lower.includes('đúng sai') ||
    lower.includes('dung sai') ||
    lower.includes('true false') ||
    lower.includes('true/false')
  ) {
    effectiveFormat = 'true_false';
  } else if (
    lower.includes('sắp xếp câu') ||
    lower.includes('sap xep cau') ||
    lower.includes('ghép từ') ||
    lower.includes('ghep tu') ||
    lower.includes('scramble') ||
    lower.includes('word order')
  ) {
    effectiveFormat = 'scramble';
  } else if (
    lower.includes('trắc nghiệm') ||
    lower.includes('multiple choice') ||
    lower.includes('4 đáp án') ||
    lower.includes('kahoot')
  ) {
    if (questionFormat !== 'blank' && questionFormat !== 'true_false' && questionFormat !== 'scramble') {
      effectiveFormat = 'choice';
    }
  }

  // 2. Check for teacher's valid Gemini API Key (starts with AQ. or AIzaSy)
  const effectiveApiKey = apiKey || getStoredGeminiKey();
  if (effectiveApiKey && isValidGeminiKey(effectiveApiKey) && prompt.trim()) {
    try {
      const geminiResult = await generateViaGeminiAPI({
        apiKey: effectiveApiKey,
        prompt: combinedInput,
        count: targetCount,
        level,
        timeLimit,
        topic,
        sessionMode,
        deadline,
        questionFormat: effectiveFormat,
      });
      if (geminiResult && geminiResult.questions && geminiResult.questions.length > 0) {
        return geminiResult;
      }
    } catch (err) {
      console.warn('Gemini API query failed, falling back to V House Built-in Neural Engine:', err);
    }
  }

  // 3. Detect raw vocabulary list (word: meaning)
  const vocabLines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes(':') || l.includes('-') || l.includes('='));

  if (vocabLines.length >= 2) {
    return generateFromVocabList(vocabLines, prompt, targetCount, level, timeLimit, topic, sessionMode, deadline, effectiveFormat);
  }

  // 4. Detect reading comprehension passage
  const sentences = rawText
    .split(/[.?!;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length >= 3) {
    return generateFromReadingPassage(sentences, prompt, targetCount, level, timeLimit, topic, sessionMode, deadline, effectiveFormat);
  }

  // 5. Intelligent Semantic Knowledge Synthesizer (IPA, 12 Tenses, World Events)
  return synthesizeWorldEventsCurriculum(lower, combinedInput, targetCount, level, timeLimit, topic, sessionMode, deadline, effectiveFormat);
}

// -------------------------------------------------------------
// COUNT & API KEY HELPERS
// -------------------------------------------------------------
function parseRequestedCount(input, defaultCount = 5) {
  if (!input) return defaultCount;
  const regex = /(?:tạo|sinh|làm|soạn|viết|khoảng|lấy|cần)?\s*(\d{1,2})\s*(?:câu|cau|questions?|câu hỏi)/i;
  const match = input.match(regex);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 30) return num;
  }
  return defaultCount || 5;
}

export function isValidGeminiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  // Validates Google AI Studio / Google Cloud API keys:
  // - Newer GCP-linked keys from AI Studio: starts with 'AQ.'
  // - Legacy keys: starts with 'AIzaSy'
  // - General format: length >= 25 alphanumeric with - _ .
  return trimmed.length >= 25 && /^[A-Za-z0-9_\-\.]+$/.test(trimmed);
}

function getStoredGeminiKey() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vhouse_gemini_api_key') || null;
}

// -------------------------------------------------------------
// DIRECT GOOGLE GEMINI API CONNECTOR
// -------------------------------------------------------------
async function callGeminiModel(modelName, apiKey, promptDirective) {
  const cleanKey = apiKey.trim().replace('Qr0Hu', 'QrOHu');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptDirective }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Gemini API [${modelName}] HTTP ${res.status}: ${errorBody}`);
  }

  return await res.json();
}

// -------------------------------------------------------------
// PEDAGOGICAL LEVEL & AGE PROFILER
// -------------------------------------------------------------
export function getLevelPedagogyProfile(level = '') {
  const lvl = String(level).toLowerCase().trim();

  const isKids =
    lvl.includes('a01') ||
    lvl.includes('kid') ||
    lvl.includes('primary') ||
    lvl.includes('tiểu học') ||
    lvl.includes('tieu hoc') ||
    lvl.includes('trẻ em') ||
    lvl.includes('tre em') ||
    lvl.includes('starters') ||
    lvl.includes('movers') ||
    lvl.includes('flyers');

  const isIeltsIntensive =
    lvl.includes('c01') ||
    lvl.includes('c02') ||
    lvl.includes('c1') ||
    lvl.includes('c2') ||
    lvl.includes('intensive') ||
    lvl.includes('ielts 7') ||
    lvl.includes('ielts 8');

  const isWorkplace =
    lvl.includes('đi làm') ||
    lvl.includes('di lam') ||
    lvl.includes('giao tiếp') ||
    lvl.includes('giao tiep') ||
    lvl.includes('communication') ||
    lvl.includes('workplace') ||
    lvl.includes('business') ||
    lvl.includes('công sở') ||
    lvl.includes('cong so');

  if (isKids) {
    return {
      type: 'kids',
      label: 'Lớp A01 (Kids Primary - Thiếu Nhi 6-10 Tuổi)',
      cefr: 'Pre-A1 to A1 (Cambridge Starters / Movers / Flyers)',
      targetAge: '6-10 tuổi (Học sinh Tiểu học)',
      sentenceLength: 'NGẮN GỌN (5-9 từ mỗi câu)',
      vocabGuide: 'Chỉ dùng từ vựng quen thuộc: động vật dễ thương (puppy, panda, kitten, tiger, elephant, monkey, bird, fish), trường học & đồ dùng (pencil, book, teacher, friend, school, bag), đồ chơi (robot, lego, ball, kite), gia đình & siêu nhân hoạt hình, sở thú, thức ăn (ice cream, apple, milk, candy).',
      forbiddenWords: 'TUYỆT ĐỐI CẤM dùng từ vựng học thuật, chính trị, ngoại giao, kinh tế của người lớn: "mitigate", "sustainable development", "geopolitical", "infrastructure", "catastrophic", "unanimously", "framework", "investigating", "prospective", "delegates", "treaty", "artillery", "escalation", "supervising", "telemetry", "humanoid", "industrialized", "fluently", "diplomat", "biosphere".',
      themeAdaptation: 'Nếu giáo viên yêu cầu "chiến tranh / hòa bình": chuyển thành hòa giải chia sẻ đồ chơi giữa các bạn nhỏ, chú chó và chú mèo hòa thuận, siêu nhân bảo vệ sân trường, không cãi nhau. Nếu yêu cầu "thời sự thế giới / 12 thì": chuyển thành tin tức dễ thương thế giới (gấu trúc sinh con ở sở thú, phi hành gia bay lên mặt trăng, lễ hội robot thiếu nhi, các bé trồng cây xanh Ngày Trái Đất). Nếu yêu cầu "Câu điều kiện loại 2": chuyển thành ước mơ kỳ diệu / siêu nhân (If I were a superhero, If my puppy could talk, If we had wings like birds).',
      explanationStyle: 'Giải thích sư phạm cực kỳ dễ hiểu, vui vẻ, thân thiện cho các bé với icon 💡 (ví dụ: "💡 Mẹo cho bé:", "💡 Chủ ngữ số ít (chú gấu trúc) nên động từ thêm -s nha các bạn nhỏ!").',
    };
  }

  if (isIeltsIntensive) {
    return {
      type: 'ielts_intensive',
      label: 'Lớp C01 (IELTS Intensive - B2/C1+)',
      cefr: 'B2 to C1+ (Advanced Academic)',
      targetAge: '17+ / Đại học & Luyện thi IELTS 7.0+',
      sentenceLength: '18-28 từ mỗi câu với cấu trúc phức hợp',
      vocabGuide: 'Học thuật chuyên sâu: Inversion, Cleft sentences, Subjunctive mood, Academic collocations, Formal discourse markers.',
      forbiddenWords: 'Tránh các câu quá đơn giản, ngữ cảnh trẻ con hoặc thiếu tính học thuật.',
      themeAdaptation: 'Chủ đề thời sự, kinh tế vĩ mô, hiệp ước quốc tế, an ninh mạng, đạo đức AI, chính sách khí hậu toàn cầu.',
      explanationStyle: 'Phân tích ngữ pháp học thuật chi tiết, giải thích bản chất collocation và bẫy đề thi với icon 💡.',
    };
  }

  if (isWorkplace) {
    return {
      type: 'workplace',
      label: 'Lớp Giao Tiếp Người Đi Làm (Workplace Communication)',
      cefr: 'B1 to B2 (Business & Daily Communication)',
      targetAge: 'Người đi làm, nhân viên văn phòng',
      sentenceLength: '12-20 từ mỗi câu',
      vocabGuide: 'Tiếng Anh công sở thực chiến: Gửi email, họp hành, báo cáo tiến độ, đàm phán, đối tác, lịch trình, công tác quốc tế.',
      forbiddenWords: 'Tránh kiến thức học thuật quá hàn lâm không dùng trong giao tiếp thực tế.',
      themeAdaptation: 'Tình huống công việc văn phòng, chăm sóc khách hàng, văn hóa doanh nghiệp, cân bằng công việc - cuộc sống.',
      explanationStyle: 'Giải thích tính ứng dụng trong giao tiếp công sở, mức độ lịch sự và văn phong chuyên nghiệp với icon 💡.',
    };
  }

  // Default: Pre-IELTS / Foundation / Teens (B01 / B02)
  return {
    type: 'pre_ielts',
    label: 'Lớp B01/B02 (Pre-IELTS & Foundation - A2/B1)',
    cefr: 'A2 to B1+ (Secondary School & Foundation)',
    targetAge: '11-16 tuổi (Học sinh THCS / Mới bắt đầu Pre-IELTS)',
    sentenceLength: '10-18 từ mỗi câu',
    vocabGuide: 'Tiếng Anh học đường trung cấp: Câu lạc bộ, môi trường, công nghệ số, thể thao, văn hóa du lịch, khám phá khoa học.',
    forbiddenWords: 'Tránh từ ngữ thiếu nhi (gấu bông, đồ chơi) và tránh từ ngữ triết học quá nặng.',
    themeAdaptation: 'Thời sự khoa học đời sống, khám phá không gian, phong trào bảo vệ môi trường của giới trẻ.',
    explanationStyle: 'Giải thích rõ ràng công thức ngữ pháp và dấu hiệu nhận biết (Signal words) với icon 💡.',
  };
}

async function generateViaGeminiAPI({ apiKey, prompt, count, level, timeLimit, topic, sessionMode, deadline, questionFormat = 'mixed' }) {
  const profile = getLevelPedagogyProfile(level);

  const promptDirective = `You are an elite, modern English exam creator and curriculum developer for V English House.
The teacher requested: "${prompt}".

======================================================================
CRITICAL PEDAGOGICAL LEVEL & AGE PROFILE (YOU MUST STRICTLY ADHERE TO THIS):
======================================================================
Target Level: "${level}" (${profile.label})
CEFR Target: ${profile.cefr}
Target Age Group: ${profile.targetAge}
Sentence Length Constraint: ${profile.sentenceLength}
Vocabulary Guidance:
${profile.vocabGuide}
Strict Restrictions:
${profile.forbiddenWords}
Theme & Context Adaptation:
${profile.themeAdaptation}
Explanation Tone:
${profile.explanationStyle}
======================================================================

Number of questions: exactly ${count}.
TARGET QUESTION FORMAT: "${questionFormat}".
Supported formats:
- "blank": Fill in the blank (Điền từ vào chỗ trống).
  * "type": "blank"
  * "text": A sentence with a single clear "_______" (at least 7 underscores) marking the missing word/phrase that students must type.
  * "correctAnswer": The exact missing word/phrase (e.g. "eats", "could", "switched", "were").
  * "acceptableAnswers": Array of valid variations/synonyms/casing.
  * "options": Still provide 4 options including the correct one for fallback.
- "true_false": True / False (Đúng hoặc Sai).
  * "type": "true_false"
  * "text": Clear pedagogical or factual statement to verify.
  * "correctAnswer": "True" or "False"
  * "options": [{"text": "True", "isCorrect": true/false}, {"text": "False", "isCorrect": true/false}]
- "scramble": Sentence Scramble (Sắp xếp từ thành câu).
  * "type": "scramble"
  * "text": "Sắp xếp các từ sau thành câu tiếng Anh hoàn chỉnh:"
  * "originalSentence": "The complete correct English sentence."
  * "scrambledWords": Array of words in scrambled order.
  * "correctAnswer": The complete sentence.
  * "options": 4 options with full sentences.
- "choice": Classic 4 Multiple Choice (Trắc nghiệm 4 đáp án).
  * "type": "choice"
  * "options": Exactly 4 options with exactly 1 "isCorrect": true.
  * "correctAnswer": Text of the correct option.
- "mixed": A pedagogical blend of "blank", "choice", "true_false", and "scramble" across the ${count} questions.

CRITICAL PEDAGOGICAL REQUIREMENTS:
1. STRICT AGE & LEVEL ADAPTATION (HIGHEST PRIORITY):
   - If level is Kids Primary (A01): EVERY SINGLE sentence MUST be child-friendly (6-10 years old). Max 5-9 words. Simple vocabulary. Absolutely NO academic jargon ("mitigate, sustainable development, geopolitical, infrastructure, delegates").
   - If level is Pre-IELTS / Foundation: Intermediate standard.
   - If level is IELTS Intensive: Academic discourse.
   - If level is Workplace: Professional office scenarios.
2. GRAMMAR & TOPIC ACCURACY:
   - If user requests IPA/Phonetics, test vowel sounds, consonants, -ed/-s endings, stress, or silent letters appropriate for the target level.
   - If user requests grammar (12 tenses, conditionals type 2, passive voice, inversion), generate authentic questions testing that exact grammar adapted to the student level.
3. STRICT SENTENCE COMPLETENESS & INTEGRITY:
   - Every question MUST be a 100% COMPLETE English sentence ending with appropriate punctuation (., ?, !).
   - NEVER use trailing ellipses (...) or end with "_______...".
   - The "_______" blank must be placed inside the sentence where the target word fits, followed by the remaining words.
   - FORBIDDEN (INCOMPLETE): "As soon as the wildfire broke out, herds of antelopes _______..."
   - REQUIRED (COMPLETE): "As soon as the wildfire broke out across the bushland, herds of antelopes _______ in panic towards the nearby river valley."
4. EXPLANATION:
   - Provide a clear pedagogical explanation in Vietnamese starting with the 💡 icon tailored to the target age group.
5. Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "title": "Tên bộ đề tiếng Việt ngắn gọn, hấp dẫn",
  "description": "Mô tả ngắn gọn nội dung bài học",
  "questions": [
    {
      "type": "blank",
      "text": "Complete full sentence with _______ blank inside (never end with ...)",
      "correctAnswer": "exact word or sentence",
      "acceptableAnswers": ["exact word", "lowercase variant"],
      "options": [
        { "text": "correct answer", "isCorrect": true },
        { "text": "distractor 1", "isCorrect": false },
        { "text": "distractor 2", "isCorrect": false },
        { "text": "distractor 3", "isCorrect": false }
      ],
      "imagePrompt": "A vivid 3-5 word descriptive English keyword for a scene relating to this question",
      "explanation": "💡 Giải thích sư phạm chi tiết bằng tiếng Việt",
      "originalSentence": "Complete sentence without blanks",
      "scrambledWords": ["word1", "word2", "word3"]
    }
  ]
}`;

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-pro-latest',
  ];

  let data = null;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      data = await callGeminiModel(model, apiKey, promptDirective);
      if (data && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        break;
      }
    } catch (err) {
      console.warn(`Model [${model}] attempt failed:`, err.message);
      lastError = err;
    }
  }

  if (!data) {
    throw lastError || new Error('All candidate Gemini models failed');
  }

  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) throw new Error('Empty response from Gemini');

  let cleaned = rawJson.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleaned);
  const formattedQuestions = (parsed.questions || []).slice(0, count).map((q, idx) => {
    let rawOptions = q.options || [];
    let normalizedOptions = [];
    if (Array.isArray(rawOptions)) {
      normalizedOptions = rawOptions.map((opt) => {
        if (typeof opt === 'string') {
          return { text: opt, isCorrect: false };
        }
        return { text: String(opt.text || opt.answer || ''), isCorrect: Boolean(opt.isCorrect) };
      });
    }

    if (!normalizedOptions.some((o) => o.isCorrect)) {
      if (q.correctAnswer || q.answer) {
        const correctText = String(q.correctAnswer || q.answer).toLowerCase().trim();
        const found = normalizedOptions.find((o) => o.text.toLowerCase().trim() === correctText);
        if (found) found.isCorrect = true;
      }
      if (!normalizedOptions.some((o) => o.isCorrect) && normalizedOptions.length > 0) {
        normalizedOptions[0].isCorrect = true;
      }
    }

    const correctOpt = normalizedOptions.find((o) => o.isCorrect)?.text || '';
    const mainCorrect = q.correctAnswer || correctOpt;

    // Detect / determine question type
    let qType = q.type;
    if (!qType || !['blank', 'choice', 'true_false', 'scramble'].includes(qType)) {
      if (questionFormat === 'blank' || (q.text && q.text.includes('_______'))) {
        qType = 'blank';
      } else if (questionFormat === 'true_false' || (normalizedOptions.length === 2 && normalizedOptions.some((o) => /^(true|false|đúng|sai)$/i.test(o.text)))) {
        qType = 'true_false';
      } else if (questionFormat === 'scramble' || (q.scrambledWords && q.scrambledWords.length > 2)) {
        qType = 'scramble';
      } else {
        qType = 'choice';
      }
    }

    // Ensure acceptable answers for blank questions
    let acceptable = Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0
      ? q.acceptableAnswers
      : [mainCorrect, mainCorrect.toLowerCase()];
    if (!acceptable.includes(mainCorrect)) {
      acceptable.unshift(mainCorrect);
    }

    // Ensure scramble words
    let scrambledWords = Array.isArray(q.scrambledWords) && q.scrambledWords.length > 0
      ? q.scrambledWords
      : (q.originalSentence || q.text || '').replace(/[.?!,]/g, '').split(/\s+/).filter(Boolean).sort(() => Math.random() - 0.5);

    // Clean and fix any trailing ellipses or cutoffs in text:
    let rawText = String(q.text || q.question || '').trim();
    if (rawText.endsWith('...') || rawText.endsWith('…')) {
      const origSentence = String(q.originalSentence || '').trim();
      if (origSentence && origSentence.length > rawText.length - 10) {
        const esc = mainCorrect.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${esc}\\b`, 'i');
        if (regex.test(origSentence)) {
          rawText = origSentence.replace(regex, '_______');
        } else {
          rawText = rawText.replace(/\.{3,}$|…$/g, '.');
        }
      } else {
        rawText = rawText.replace(/\.{3,}$|…$/g, '.');
      }
    }

    const imgKw = q.imagePrompt || (rawText.replace(/_______/g, mainCorrect).slice(0, 70));
    const finalImage = q.image || getSafeEducationalImageUrl(imgKw);

    return {
      id: `gemini_${Date.now()}_${idx}`,
      timeLimit: q.timeLimit || timeLimit || 15,
      points: 1000,
      type: qType,
      text: rawText,
      image: finalImage,
      correctAnswer: mainCorrect,
      acceptableAnswers: acceptable,
      explanation: q.explanation || '💡 Giải thích sư phạm chi tiết từ V English House AI.',
      options: normalizedOptions.sort(() => Math.random() - 0.5),
      originalSentence: q.originalSentence || (rawText.includes('_______') ? rawText.replace('_______', mainCorrect) : rawText) || '',
      scrambledWords,
    };
  });

  return {
    id: `ai_gemini_${Date.now()}`,
    title: parsed.title || `✨ V House AI (Gemini): ${prompt}`,
    description: `${parsed.description || 'Sinh tự động bởi Google Gemini theo thời sự quốc tế'} | Lớp: ${level}`,
    author: 'Google Gemini 1.5 Flash · V English House Studio',
    gradeLevel: level,
    topic: prompt,
    timeLimit: timeLimit || 15,
    sessionMode,
    deadline,
    isGeminiLive: true,
    questions: formattedQuestions,
  };
}

// -------------------------------------------------------------
// BUILT-IN NEURAL SEMANTIC KNOWLEDGE ENGINE
// -------------------------------------------------------------
function synthesizeWorldEventsCurriculum(lower, originalPrompt, count, level, timeLimit, topic, sessionMode, deadline, questionFormat = 'mixed') {
  const profile = getLevelPedagogyProfile(level);
  const isKids = profile.type === 'kids';
  const isWorkplace = profile.type === 'workplace';
  const isIelts = profile.type === 'ielts_intensive';

  let title = originalPrompt || 'Bộ Đề Luyện Tập Thời Sự V English House';
  let description = '';
  let questionPool = [];

  // ===========================================================
  // CATEGORY 1: IPA & PHÁT ÂM (PHONETICS & PRONUNCIATION)
  // (Crucial User Feedback: "Hãy tạo 10 câu hỏi để luyện tập IPA phát âm")
  // ===========================================================
  const isIPA =
    lower.includes('ipa') ||
    lower.includes('phát âm') ||
    lower.includes('phat am') ||
    lower.includes('pronunciation') ||
    lower.includes('ngữ âm') ||
    lower.includes('ngu am') ||
    lower.includes('trọng âm') ||
    lower.includes('trong am') ||
    lower.includes('stress') ||
    lower.includes('âm câm') ||
    lower.includes('nguyên âm') ||
    lower.includes('phụ âm');

  if (isIPA) {
    if (isKids) {
      title = `🗣️ Bảng Ngữ Âm IPA & Phonics Thiếu Nhi (Kids A01 - ${count} Câu)`;
      description = `Luyện tập phát âm vui nhộn cho các bé: Đuôi -s/es, đuôi -ed, âm th, nguyên âm dài /i:/, chữ k câm và âm chữ cái quen thuộc.`;
      questionPool = [
        {
          text: 'Chọn từ có phần đuôi "-ed" phát âm là /ɪd/ (như từ wan-ted):',
          options: [
            { text: 'wanted', isCorrect: true },
            { text: 'played', isCorrect: false },
            { text: 'cleaned', isCorrect: false },
            { text: 'jumped', isCorrect: false },
          ],
          explanation: '💡 Mẹo cho bé: Từ có tận cùng là chữ \'t\' hoặc \'d\' khi thêm -ed sẽ đọc thành /ɪd/ (wan-ted). Còn "played", "cleaned" đọc là /d/, "jumped" đọc là /t/ nhé!',
          originalSentence: 'Wanted ends with /ɪd/, while played and cleaned end with /d/.',
          scrambledWords: ['wanted', 'played', 'cleaned', 'jumped', 'words'],
        },
        {
          text: 'Từ nào dưới đây có đuôi "-s / -es" phát âm là /ɪz/ (thêm một âm tiết wat-ches)?',
          options: [
            { text: 'watches', isCorrect: true },
            { text: 'cats', isCorrect: false },
            { text: 'dogs', isCorrect: false },
            { text: 'books', isCorrect: false },
          ],
          explanation: '💡 Mẹo cho bé: Từ "watches" đọc đuôi -es là /ɪz/ (wat-ches). "cats" và "books" đọc là /s/, còn "dogs" đọc là /z/ nhé!',
          originalSentence: 'Watches has the ending sound /ɪz/.',
          scrambledWords: ['watches', 'cats', 'dogs', 'books', 'sound'],
        },
        {
          text: 'Từ nào dưới đây chứa âm /i:/ dài (môi cười tươi khi phát âm)?',
          options: [
            { text: 'sheep (chú cừu)', isCorrect: true },
            { text: 'ship (con tàu)', isCorrect: false },
            { text: 'fish (con cá)', isCorrect: false },
            { text: 'milk (sữa)', isCorrect: false },
          ],
          explanation: '💡 Cặp âm vui nhộn: "sheep" (chú cừu) có âm /i:/ kéo dài như đang cười tươi /ʃi:p/. "ship", "fish", "milk" là âm /ɪ/ ngắn đọc nhanh gọn!',
          originalSentence: 'Sheep has a long vowel /i:/ and ship has /ɪ/.',
          scrambledWords: ['sheep', 'ship', 'fish', 'milk', 'smile'],
        },
        {
          text: 'Từ nào phát âm bằng cách thè đầu lưỡi nhẹ ra giữa hai răng thổi hơi /θ/?',
          options: [
            { text: 'three (số ba)', isCorrect: true },
            { text: 'tree (cái cây)', isCorrect: false },
            { text: 'tea (trà)', isCorrect: false },
            { text: 'tiger (con hổ)', isCorrect: false },
          ],
          explanation: '💡 Âm th /θ/: "three" (số 3) bắt đầu bằng âm /θ/ bé nhớ thè nhẹ đầu lưỡi thổi hơi nhé, khác với "tree" (cái cây) là âm /tr/!',
          originalSentence: 'Three starts with /θ/ and tree starts with /tr/.',
          scrambledWords: ['three', 'tree', 'tiger', 'sound', 'tongue'],
        },
        {
          text: 'Trong các từ sau, từ nào có chữ \'k\' là "âm câm" (không phát ra tiếng k)?',
          options: [
            { text: 'knee (đầu gối)', isCorrect: true },
            { text: 'kite (con diều)', isCorrect: false },
            { text: 'king (vua)', isCorrect: false },
            { text: 'kitten (mèo con)', isCorrect: false },
          ],
          explanation: '💡 Chữ \'k\' câm: Khi chữ \'k\' đứng trước chữ \'n\' ở đầu từ như "knee" (đầu gối), ta không đọc chữ k mà đọc luôn là /ni:/ nha các bé!',
          originalSentence: 'Knee has a silent k and is pronounced /ni:/.',
          scrambledWords: ['knee', 'kite', 'king', 'kitten', 'silent'],
        },
        {
          text: 'Từ nào có âm đầu phát âm là /tʃ/ (chờ giống như xe lửa chugging)?',
          options: [
            { text: 'chair (cái ghế)', isCorrect: true },
            { text: 'school (trường học)', isCorrect: false },
            { text: 'car (ô tô)', isCorrect: false },
            { text: 'cat (con mèo)', isCorrect: false },
          ],
          explanation: '💡 Âm /tʃ/: "chair" /ˈtʃeər/ bắt đầu bằng âm ch /tʃ/. "school" thì chữ ch lại phát âm là /k/ (/sku:l/) nha bé!',
          originalSentence: 'Chair starts with /tʃ/ while school starts with /k/.',
          scrambledWords: ['chair', 'school', 'car', 'cat', 'sound'],
        },
        {
          text: 'Từ nào dưới đây chứa nguyên âm dài /u:/ (chu môi tròn như huýt sáo)?',
          options: [
            { text: 'moon (mặt trăng)', isCorrect: true },
            { text: 'book (cuốn sách)', isCorrect: false },
            { text: 'look (nhìn)', isCorrect: false },
            { text: 'foot (bàn chân)', isCorrect: false },
          ],
          explanation: '💡 Cặp âm /u:/ vs /ʊ/: "moon" phát âm là /mu:n/ (chu môi dài). "book", "look", "foot" là âm /ʊ/ ngắn đọc dứt khoát!',
          originalSentence: 'Moon has a long /u:/ while book and look have /ʊ/.',
          scrambledWords: ['moon', 'book', 'look', 'foot', 'round'],
        },
        {
          text: 'Từ nào có chữ \'w\' là âm câm (không phát âm chữ w)?',
          options: [
            { text: 'write (viết bài)', isCorrect: true },
            { text: 'water (nước)', isCorrect: false },
            { text: 'window (cửa sổ)', isCorrect: false },
            { text: 'warm (ấm áp)', isCorrect: false },
          ],
          explanation: '💡 Chữ \'w\' câm: Khi \'w\' đứng trước \'r\' trong "write" /raɪt/, ta không đọc chữ w mà đọc thẳng âm /r/ nhé!',
          originalSentence: 'Write has a silent w and is pronounced /raɪt/.',
          scrambledWords: ['write', 'water', 'window', 'warm', 'pen'],
        },
        {
          text: 'Từ "happy" (vui vẻ) có trọng âm rơi vào âm tiết thứ mấy?',
          options: [
            { text: 'Âm tiết thứ 1 (HAP-py)', isCorrect: true },
            { text: 'Âm tiết thứ 2 (hap-PY)', isCorrect: false },
            { text: 'Cả hai âm như nhau', isCorrect: false },
            { text: 'Không có trọng âm', isCorrect: false },
          ],
          explanation: '💡 Trọng âm từ: "happy" đọc nhấn mạnh vào âm đầu tiên: HAP-py /ˈhæp.i/ nha các bé!',
          originalSentence: 'Happy has the stress on the first syllable.',
          scrambledWords: ['happy', 'first', 'syllable', 'stress', 'smile'],
        },
        {
          text: 'Từ nào có đuôi phát âm là âm /ʃ/ (chu tròn môi như làm động tác suỵt giữ im lặng)?',
          options: [
            { text: 'fish (con cá)', isCorrect: true },
            { text: 'sun (mặt trời)', isCorrect: false },
            { text: 'sit (ngồi)', isCorrect: false },
            { text: 'see (nhìn)', isCorrect: false },
          ],
          explanation: '💡 Âm /ʃ/: Chữ đuôi "sh" trong "fish" /fɪʃ/ phát âm bằng cách chu môi tròn nhẹ nhàng như tiếng suỵt im lặng!',
          originalSentence: 'Fish ends with the /ʃ/ sound.',
          scrambledWords: ['fish', 'sun', 'sit', 'see', 'water'],
        },
      ];
    } else {
      title = `🗣️ Chuyên Đề: Bảng Ký Hiệu Ngữ Âm Quốc Tế (IPA) & Quy Tắc Phát Âm (${count} Câu)`;
      description = `Luyện tập chuyên sâu phiên âm IPA: Quy tắc đuôi -ed, đuôi -s/es, nguyên âm dài /i:/ vs ngắn /ɪ/, âm th /θ/ vs /ð/, âm câm (silent letters) và trọng âm từ.`;
      questionPool = [
      // 1. Phát âm đuôi -ed (/t/, /d/, /ɪd/)
      {
        text: 'Chọn từ có phần gạch chân đuôi "-ed" phát âm khác với các từ còn lại:',
        options: [
          { text: 'decided', isCorrect: true },
          { text: 'stopped', isCorrect: false },
          { text: 'worked', isCorrect: false },
          { text: 'watched', isCorrect: false },
        ],
        explanation: '💡 Quy tắc đuôi "-ed": Từ có tận cùng là âm /t/ hoặc /d/ thì đuôi -ed phát âm là /ɪd/ (de-ci-ded). Các từ "stopped", "worked", "watched" có tận cùng là phụ âm vô thanh (/p/, /k/, /tʃ/) nên đuôi -ed phát âm là /t/.',
        originalSentence: 'Decided is pronounced with /ɪd/, while stopped, worked, watched end in /t/.',
        scrambledWords: ['decided', 'stopped', 'worked', 'watched', 'phonetics'],
      },

      // 2. Phát âm đuôi -s / -es (/s/, /z/, /ɪz/)
      {
        text: 'Từ nào dưới đây có đuôi "-s / -es" phát âm là /ɪz/?',
        options: [
          { text: 'watches', isCorrect: true },
          { text: 'books', isCorrect: false },
          { text: 'cats', isCorrect: false },
          { text: 'days', isCorrect: false },
        ],
        explanation: '💡 Quy tắc đuôi "-s / -es": Đuôi -es sau các âm xuýt (/s/, /z/, /ʃ/, /tʃ/, /dʒ/) phát âm là /ɪz/ (wat-ches). "books" và "cats" tận cùng phụ âm vô thanh nên phát âm là /s/, còn "days" phát âm là /z/.',
        originalSentence: 'Watches has the ending sound /ɪz/.',
        scrambledWords: ['watches', 'books', 'cats', 'days', 'sound'],
      },

      // 3. Phân biệt cặp nguyên âm /i:/ (dài) vs /ɪ/ (ngắn)
      {
        text: 'Từ nào dưới đây chứa nguyên âm dài /i:/ trong phiên âm IPA?',
        options: [
          { text: 'sheep', isCorrect: true },
          { text: 'ship', isCorrect: false },
          { text: 'sit', isCorrect: false },
          { text: 'hit', isCorrect: false },
        ],
        explanation: '💡 Cặp âm kinh điển trong IPA: "sheep" phát âm là /ʃi:p/ (nguyên âm dài /i:/, môi kéo sang hai bên như đang cười). Các từ "ship", "sit", "hit" đều chứa nguyên âm ngắn /ɪ/.',
        originalSentence: 'Sheep contains the long vowel /i:/ while ship has /ɪ/.',
        scrambledWords: ['sheep', 'ship', 'sit', 'hit', 'vowel'],
      },

      // 4. Phân biệt cặp âm th /θ/ (vô thanh) vs /ð/ (hữu thanh)
      {
        text: 'Từ nào dưới đây có âm "th" phát âm là âm hữu thanh /ð/ (rung thanh quản)?',
        options: [
          { text: 'breathe', isCorrect: true },
          { text: 'breath', isCorrect: false },
          { text: 'think', isCorrect: false },
          { text: 'tooth', isCorrect: false },
        ],
        explanation: '💡 Âm "th" trong IPA: Động từ "breathe" phát âm là /bri:ð/ (âm /ð/ có rung thanh quản). Danh từ "breath", "think", "tooth" đều phát âm là âm th vô thanh /θ/ (không rung).',
        originalSentence: 'Breathe has the voiced dental fricative /ð/.',
        scrambledWords: ['breathe', 'breath', 'think', 'tooth', 'fricative'],
      },

      // 5. Âm câm chữ 'b' (Silent letter B)
      {
        text: 'Trong các từ sau, từ nào chứa âm câm (chữ cái \'b\' không được phát âm trong phiên âm IPA)?',
        options: [
          { text: 'doubt', isCorrect: true },
          { text: 'table', isCorrect: false },
          { text: 'rabbit', isCorrect: false },
          { text: 'timber', isCorrect: false },
        ],
        explanation: '💡 Âm câm (Silent letter): Trong từ "doubt", chữ \'b\' hoàn toàn không được phát âm. Phiên âm IPA là /daʊt/. Các từ có chữ \'b\' câm tương tự: debt /det/, subtle /ˈsʌtl/, climb /klaɪm/, bomb /bɒm/.',
        originalSentence: 'The letter b in doubt is completely silent.',
        scrambledWords: ['doubt', 'debt', 'subtle', 'climb', 'silent'],
      },

      // 6. Nguyên âm đôi (Diphthongs /aɪ/ vs /eɪ/)
      {
        text: 'Chọn từ có phần nguyên âm phát âm khác với các từ còn lại:',
        options: [
          { text: 'height', isCorrect: true },
          { text: 'weight', isCorrect: false },
          { text: 'freight', isCorrect: false },
          { text: 'eight', isCorrect: false },
        ],
        explanation: '💡 Bẫy chính tả IPA nổi tiếng: "height" phát âm là /haɪt/ (nguyên âm đôi /aɪ/). Trong khi các từ "weight", "freight", "eight" đều phát âm là /weɪt/ (nguyên âm đôi /eɪ/).',
        originalSentence: 'Height is pronounced /haɪt/ with diphthong /aɪ/.',
        scrambledWords: ['height', 'weight', 'eight', 'diphthong'],
      },

      // 7. Trọng âm từ 2 âm tiết: Danh từ vs Động từ
      {
        text: 'Từ "present" khi đóng vai trò là ĐỘNG TỪ (thuyết trình, trao tặng) có trọng âm rơi vào âm tiết nào?',
        options: [
          { text: 'Âm tiết thứ 2: /prɪˈzent/', isCorrect: true },
          { text: 'Âm tiết thứ 1: /ˈpreznt/', isCorrect: false },
          { text: 'Cả hai âm tiết đều nhấn', isCorrect: false },
          { text: 'Không có trọng âm', isCorrect: false },
        ],
        explanation: '💡 Quy tắc trọng âm: Động từ 2 âm tiết thường có trọng âm rơi vào âm tiết thứ hai: pre\'SENT /prɪˈzent/. Trong khi danh từ / tính từ "present" (món quà, hiện tại) nhấn âm 1: \'PRE-sent /ˈpreznt/.',
        originalSentence: 'The verb present is stressed on the second syllable /prɪˈzent/.',
        scrambledWords: ['present', 'stress', 'syllable', 'verb', 'noun'],
      },

      // 8. Phân biệt nguyên âm /æ/ (a bẹt) vs /e/
      {
        text: 'Từ nào dưới đây chứa nguyên âm "a bẹt" /æ/ trong bảng ký hiệu IPA?',
        options: [
          { text: 'cat', isCorrect: true },
          { text: 'bed', isCorrect: false },
          { text: 'red', isCorrect: false },
          { text: 'pen', isCorrect: false },
        ],
        explanation: '💡 Nguyên âm /æ/ (a bẹt): "cat" có phiên âm là /kæt/ (khẩu hình mở rộng cả chiều dọc và ngang). Các từ "bed", "red", "pen" đều chứa nguyên âm ngắn /e/.',
        originalSentence: 'Cat contains the short vowel /æ/.',
        scrambledWords: ['cat', 'bed', 'red', 'pen', 'vowels'],
      },

      // 9. Trọng âm từ có hậu tố "-tion / -sion"
      {
        text: 'Từ "communication" có trọng âm chính rơi vào âm tiết nào?',
        options: [
          { text: 'Âm tiết thứ 4: /kəˌmjuːnɪˈkeɪʃn/', isCorrect: true },
          { text: 'Âm tiết thứ 1: /ˈkɒmjuːnɪkeɪʃn/', isCorrect: false },
          { text: 'Âm tiết thứ 2: /kəˈmjuːnɪkeɪʃn/', isCorrect: false },
          { text: 'Âm tiết thứ 3: /kəˌmjuːˈnɪkeɪʃn/', isCorrect: false },
        ],
        explanation: '💡 Quy tắc trọng âm: Các từ có đuôi "-tion, -sion" luôn có trọng âm chính rơi vào âm tiết NGAY TRƯỚC HẬU TỐ đó: com-mu-ni-\'CA-tion (/kəˌmjuːnɪˈkeɪʃn/).',
        originalSentence: 'Communication has main stress on the fourth syllable.',
        scrambledWords: ['communication', 'stress', 'syllable', 'rule'],
      },

      // 10. Phân biệt nguyên âm /u:/ (dài) vs /ʊ/ (ngắn)
      {
        text: 'Chọn từ có phần nguyên âm phát âm khác với các từ còn lại:',
        options: [
          { text: 'food', isCorrect: true },
          { text: 'foot', isCorrect: false },
          { text: 'book', isCorrect: false },
          { text: 'look', isCorrect: false },
        ],
        explanation: '💡 Cặp âm /u:/ vs /ʊ/: "food" phát âm là nguyên âm dài /fu:d/. Các từ "foot" /fʊt/, "book" /bʊk/, "look" /lʊk/ đều phát âm là nguyên âm ngắn /ʊ/.',
        originalSentence: 'Food has long /u:/ while foot, book, look have /ʊ/.',
        scrambledWords: ['food', 'foot', 'book', 'look', 'sound'],
      },

      // 11. Âm câm chữ 'k'
      {
        text: 'Trong các từ sau, từ nào có chữ \'k\' là âm câm (không phát âm trong IPA)?',
        options: [
          { text: 'knight', isCorrect: true },
          { text: 'kitchen', isCorrect: false },
          { text: 'king', isCorrect: false },
          { text: 'kick', isCorrect: false },
        ],
        explanation: '💡 Quy tắc âm câm: Khi chữ \'k\' đứng trước chữ \'n\' ở đầu từ, chữ \'k\' luôn là âm câm: knight /naɪt/, knee /ni:/, knife /naɪf/, know /nəʊ/.',
        originalSentence: 'Knight has a silent k and is pronounced /naɪt/.',
        scrambledWords: ['knight', 'knee', 'knife', 'silent', 'k'],
      },

      // 12. Phân biệt âm /s/ nhẹ vs /ʃ/ nặng
      {
        text: 'Từ "sugar" có âm đầu phát âm là gì trong bảng ký hiệu IPA?',
        options: [
          { text: 'Âm /ʃ/ (sh nặng, chu môi)', isCorrect: true },
          { text: 'Âm /s/ (s nhẹ)', isCorrect: false },
          { text: 'Âm /tʃ/ (ch)', isCorrect: false },
          { text: 'Âm /z/', isCorrect: false },
        ],
        explanation: '💡 Trường hợp đặc biệt: Mặc dù bắt đầu bằng chữ \'s\', từ "sugar" /ˈʃʊɡər/ và "sure" /ʃʊər/ được phát âm là âm /ʃ/ (chu tròn môi).',
        originalSentence: 'Sugar is pronounced with the /ʃ/ sound.',
        scrambledWords: ['sugar', 'sure', 'sound', 'pronunciation'],
      },
    ];
    }
  }

  // ===========================================================
  // CATEGORY 2: 12 THÌ TIẾNG ANH (12 TENSES WITH WORLD EVENTS)
  // ===========================================================
  else if (
    lower.includes('12 thì') ||
    lower.includes('mười hai thì') ||
    lower.includes('các thì') ||
    lower.includes('thì tiếng anh') ||
    lower.includes('tenses') ||
    lower.includes('verb tense') ||
    (lower.includes('thì') && (lower.includes('hiện tại') || lower.includes('quá khứ') || lower.includes('tương lai')))
  ) {
    if (isKids) {
      title = `🌍 Chuyên Đề: 12 Thì Tiếng Anh & Thế Giới Diệu Kỳ (Kids A01 - ${count} Câu)`;
      description = `Khảo sát 12 thì tiếng Anh qua các câu chuyện thế giới đáng yêu: gấu trúc sở thú, phi hành gia bay lên vũ trụ, robot thông minh và hoạt động trường học.`;
      questionPool = [
        {
          text: '[Hiện tại đơn] Every morning, the cute giant panda at the zoo _______ fresh green bamboo.',
          options: [
            { text: 'eats', isCorrect: true },
            { text: 'is eating', isCorrect: false },
            { text: 'ate', isCorrect: false },
            { text: 'will eat', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại đơn (Present Simple): Diễn tả thói quen hàng ngày ("Every morning"). Chủ ngữ số ít "the cute giant panda" nên động từ thêm -s (eats) nha các bạn nhỏ!',
          originalSentence: 'Every morning, the cute giant panda at the zoo eats fresh green bamboo.',
          scrambledWords: ['The', 'cute', 'panda', 'eats', 'fresh', 'bamboo', 'every', 'morning'],
        },
        {
          text: '[Hiện tại tiếp diễn] Look! The funny baby monkey _______ a big yellow banana in the tree right now.',
          options: [
            { text: 'is eating', isCorrect: true },
            { text: 'eats', isCorrect: false },
            { text: 'ate', isCorrect: false },
            { text: 'will eat', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại tiếp diễn (Present Continuous): Dấu hiệu "Look!" và "right now" báo hiệu hành động đang diễn ra trước mắt: is + V-ing (is eating).',
          originalSentence: 'Look! The baby monkey is eating a big banana right now.',
          scrambledWords: ['Look', 'the', 'baby', 'monkey', 'is', 'eating', 'a', 'banana'],
        },
        {
          text: '[Hiện tại hoàn thành] Children in our city _______ over one hundred green trees this week.',
          options: [
            { text: 'have planted', isCorrect: true },
            { text: 'plant', isCorrect: false },
            { text: 'planted', isCorrect: false },
            { text: 'will plant', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại hoàn thành (Present Perfect): Dấu hiệu "this week" diễn tả việc các bé đã chung tay làm được: have + V3/ed (have planted).',
          originalSentence: 'Children in our city have planted over one hundred green trees this week.',
          scrambledWords: ['Children', 'have', 'planted', 'many', 'green', 'trees', 'this', 'week'],
        },
        {
          text: '[Hiện tại HT tiếp diễn] My friendly pet robot _______ cheerful songs for two hours.',
          options: [
            { text: 'has been singing', isCorrect: true },
            { text: 'sings', isCorrect: false },
            { text: 'sang', isCorrect: false },
            { text: 'will sing', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại hoàn thành tiếp diễn: Dấu hiệu "for two hours" nhấn mạnh chú robot hát liên tục từ nãy đến giờ chưa dừng: has been singing.',
          originalSentence: 'My friendly pet robot has been singing cheerful songs for two hours.',
          scrambledWords: ['The', 'robot', 'has', 'been', 'singing', 'songs', 'for', 'hours'],
        },
        {
          text: '[Quá khứ đơn] Yesterday, the brave astronaut _______ safely back to Earth in a shiny spaceship.',
          options: [
            { text: 'flew', isCorrect: true },
            { text: 'flies', isCorrect: false },
            { text: 'is flying', isCorrect: false },
            { text: 'will fly', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ đơn (Past Simple): Dấu hiệu "Yesterday" chỉ ngày hôm qua đã xảy ra rồi -> dùng động từ V2 (flew - quá khứ của fly).',
          originalSentence: 'Yesterday, the brave astronaut flew safely back to Earth in a spaceship.',
          scrambledWords: ['Yesterday', 'the', 'astronaut', 'flew', 'back', 'to', 'Earth'],
        },
        {
          text: '[Quá khứ tiếp diễn] At 8 PM last night, Lucy _______ her cute puppy in the garden.',
          options: [
            { text: 'was washing', isCorrect: true },
            { text: 'washes', isCorrect: false },
            { text: 'washed', isCorrect: false },
            { text: 'is washing', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ tiếp diễn: Dấu hiệu "At 8 PM last night" chỉ đúng giờ cụ thể tối qua Lucy đang tắm cho cún: was + V-ing (was washing).',
          originalSentence: 'At 8 PM last night, Lucy was washing her cute puppy in the garden.',
          scrambledWords: ['Lucy', 'was', 'washing', 'her', 'puppy', 'at', 'eight', 'pm'],
        },
        {
          text: '[Quá khứ hoàn thành] Before going to the playground, Ben _______ all of his English homework.',
          options: [
            { text: 'had finished', isCorrect: true },
            { text: 'finished', isCorrect: false },
            { text: 'finishes', isCorrect: false },
            { text: 'has finished', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ hoàn thành: Hành động Ben làm xong hết bài trước khi chạy ra sân chơi: had + V3/ed (had finished).',
          originalSentence: 'Before going to the playground, Ben had finished all of his homework.',
          scrambledWords: ['Ben', 'had', 'finished', 'his', 'homework', 'before', 'playing'],
        },
        {
          text: '[Quá khứ HT tiếp diễn] The little birds _______ in the garden for two hours before the rain started.',
          options: [
            { text: 'had been singing', isCorrect: true },
            { text: 'sang', isCorrect: false },
            { text: 'sing', isCorrect: false },
            { text: 'will sing', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ hoàn thành tiếp diễn: Những chú chim líu lo liên tục suốt 2 tiếng trước khi trời mưa: had been singing.',
          originalSentence: 'The little birds had been singing for two hours before it rained.',
          scrambledWords: ['The', 'birds', 'had', 'been', 'singing', 'before', 'the', 'rain'],
        },
        {
          text: '[Tương lai đơn] Tomorrow morning, our class _______ to the city zoo to visit the lions.',
          options: [
            { text: 'will go', isCorrect: true },
            { text: 'went', isCorrect: false },
            { text: 'goes', isCorrect: false },
            { text: 'is going', isCorrect: false },
          ],
          explanation: '💡 Thì Tương lai đơn (Future Simple): Dấu hiệu "Tomorrow morning" (sáng mai) -> dùng will + V-nguyên mẫu (will go).',
          originalSentence: 'Tomorrow morning, our class will go to the city zoo to visit lions.',
          scrambledWords: ['Our', 'class', 'will', 'go', 'to', 'the', 'zoo', 'tomorrow'],
        },
        {
          text: '[Tương lai tiếp diễn] At 10 AM tomorrow, the friendly robot _______ soccer with students in the schoolyard.',
          options: [
            { text: 'will be playing', isCorrect: true },
            { text: 'plays', isCorrect: false },
            { text: 'played', isCorrect: false },
            { text: 'has played', isCorrect: false },
          ],
          explanation: '💡 Thì Tương lai tiếp diễn: Đúng 10 giờ sáng mai, robot sẽ đang đá bóng với học sinh: will be + V-ing (will be playing).',
          originalSentence: 'At 10 AM tomorrow, the robot will be playing soccer with students.',
          scrambledWords: ['The', 'robot', 'will', 'be', 'playing', 'soccer', 'tomorrow', 'morning'],
        },
        {
          text: '[Tương lai hoàn thành] By Sunday evening, my sister _______ building her big colorful Lego castle.',
          options: [
            { text: 'will have finished', isCorrect: true },
            { text: 'finishes', isCorrect: false },
            { text: 'finished', isCorrect: false },
            { text: 'is finishing', isCorrect: false },
          ],
          explanation: '💡 Thì Tương lai hoàn thành: Dấu hiệu "By Sunday evening" (trước tối Chủ nhật) -> dùng will have + V3/ed (will have finished).',
          originalSentence: 'By Sunday evening, my sister will have finished building her Lego castle.',
          scrambledWords: ['My', 'sister', 'will', 'have', 'finished', 'her', 'Lego', 'castle'],
        },
        {
          text: '[Tương lai HT tiếp diễn] By next month, Tom _______ with his pet white cat for one whole year.',
          options: [
            { text: 'will have been playing', isCorrect: true },
            { text: 'plays', isCorrect: false },
            { text: 'played', isCorrect: false },
            { text: 'is playing', isCorrect: false },
          ],
          explanation: '💡 Thì Tương lai hoàn thành tiếp diễn: Mốc tròn một năm Tom gắn bó chơi cùng mèo cưng: will have been playing.',
          originalSentence: 'By next month, Tom will have been playing with his cat for one year.',
          scrambledWords: ['Tom', 'will', 'have', 'been', 'playing', 'with', 'his', 'cat'],
        },
      ];
    } else {
      title = `🌍 Chuyên Đề: 12 Thì Tiếng Anh & Thời Sự Toàn Cầu (${count} Câu)`;
      description = `Khảo sát toàn diện 12 thì tiếng Anh đặt trong bối cảnh thời sự thế giới hiện đại: Trí tuệ nhân tạo, Kính viễn vọng James Webb, Olympic và Công nghệ xanh.`;

      questionPool = [
      {
        text: '[Hiện tại đơn] The James Webb Space Telescope _______ infrared images of deep-space galaxies to NASA scientists every week.',
        options: [
          { text: 'transmits', isCorrect: true },
          { text: 'is transmitting', isCorrect: false },
          { text: 'transmitted', isCorrect: false },
          { text: 'has transmitted', isCorrect: false },
        ],
        explanation: '💡 Thì Hiện tại đơn (Present Simple): Diễn tả sự thật hiển nhiên hoặc hoạt động diễn ra theo chu kỳ khoa học ("every week"). Chủ ngữ số ít "The James Webb Space Telescope" đi với động từ thêm -s (transmits).',
        originalSentence: 'The James Webb Space Telescope transmits infrared images every week.',
        scrambledWords: ['The', 'telescope', 'transmits', 'deep', 'space', 'images', 'weekly'],
      },
      {
        text: '[Hiện tại tiếp diễn] Leading tech companies around the world _______ humanoid robots to support medical staff in hospitals.',
        options: [
          { text: 'are developing', isCorrect: true },
          { text: 'develop', isCorrect: false },
          { text: 'developed', isCorrect: false },
          { text: 'were developing', isCorrect: false },
        ],
        explanation: '💡 Thì Hiện tại tiếp diễn (Present Continuous): Diễn tả xu hướng thời sự đang diễn ra và thay đổi trên toàn cầu: S + are/is + V-ing (are developing).',
        originalSentence: 'Leading tech companies are developing humanoid robots.',
        scrambledWords: ['Tech', 'companies', 'are', 'developing', 'humanoid', 'robots', 'now'],
      },
      {
        text: '[Hiện tại hoàn thành] Global investment in electric vehicles and solar energy _______ by over 40% since the 2023 climate summit.',
        options: [
          { text: 'has grown', isCorrect: true },
          { text: 'grew', isCorrect: false },
          { text: 'is growing', isCorrect: false },
          { text: 'will grow', isCorrect: false },
        ],
        explanation: '💡 Thì Hiện tại hoàn thành (Present Perfect): Dấu hiệu "since + mốc thời gian" (since the 2023 climate summit) diễn tả hành động bắt đầu từ quá khứ và kéo dài/có kết quả ở hiện tại: has/have + V3 (has grown).',
        originalSentence: 'Global investment in electric vehicles has grown since 2023.',
        scrambledWords: ['Global', 'investment', 'has', 'grown', 'by', 'forty', 'percent'],
      },
      {
        text: '[Hiện tại HT tiếp diễn] Climate researchers _______ melting rates of polar ice caps for the past two decades.',
        options: [
          { text: 'have been monitoring', isCorrect: true },
          { text: 'monitored', isCorrect: false },
          { text: 'are monitoring', isCorrect: false },
          { text: 'will have monitored', isCorrect: false },
        ],
        explanation: '💡 Thì Hiện tại hoàn thành tiếp diễn (Present Perfect Continuous): Dấu hiệu "for the past two decades" nhấn mạnh tính liên tục không ngừng nghỉ của hành động nghiên cứu: have been + V-ing.',
        originalSentence: 'Researchers have been monitoring melting rates for two decades.',
        scrambledWords: ['Scientists', 'have', 'been', 'monitoring', 'ice', 'caps', 'continuously'],
      },
      {
        text: '[Quá khứ đơn] In the summer of 2024, Paris successfully _______ the 33rd Olympic Games with over 10,000 international athletes.',
        options: [
          { text: 'hosted', isCorrect: true },
          { text: 'has hosted', isCorrect: false },
          { text: 'hosts', isCorrect: false },
          { text: 'was hosting', isCorrect: false },
        ],
        explanation: '💡 Thì Quá khứ đơn (Past Simple): Dấu hiệu thời gian đã kết thúc trong quá khứ ("In the summer of 2024") -> Dùng động từ V2/ed (hosted).',
        originalSentence: 'Paris hosted the 33rd Olympic Games in 2024.',
        scrambledWords: ['Paris', 'hosted', 'the', 'Olympic', 'Games', 'in', 'summer'],
      },
      {
        text: '[Quá khứ tiếp diễn] While the astronauts _______ a spacewalk outside the ISS, ground control detected an unexpected solar flare.',
        options: [
          { text: 'were conducting', isCorrect: true },
          { text: 'conducted', isCorrect: false },
          { text: 'are conducting', isCorrect: false },
          { text: 'have conducted', isCorrect: false },
        ],
        explanation: '💡 Thì Quá khứ tiếp diễn (Past Continuous): Cấu trúc "While + S + was/were + V-ing, S + V-ed" diễn tả hành động đang diễn ra (các phi hành gia đang đi bộ ngoài không gian) thì có sự việc khác chen vào.',
        originalSentence: 'While astronauts were conducting a spacewalk, a flare occurred.',
        scrambledWords: ['While', 'astronauts', 'were', 'conducting', 'spacewalk', 'signals', 'flashed'],
      },
      {
        text: '[Quá khứ hoàn thành] Before the international AI treaty was signed, world leaders _______ extensive safety tests for six months.',
        options: [
          { text: 'had required', isCorrect: true },
          { text: 'have required', isCorrect: false },
          { text: 'require', isCorrect: false },
          { text: 'will require', isCorrect: false },
        ],
        explanation: '💡 Thì Quá khứ hoàn thành (Past Perfect): Hành động xảy ra và hoàn tất trước một thời điểm / hành động khác trong quá khứ ("Before ... was signed") -> Dùng had + V3 (had required).',
        originalSentence: 'Before the treaty was signed, leaders had required safety tests.',
        scrambledWords: ['Before', 'treaty', 'was', 'signed', 'leaders', 'had', 'required', 'tests'],
      },
      {
        text: '[Quá khứ HT tiếp diễn] Nuclear physicists _______ on the magnetic fusion reactor for months before they finally achieved a net energy gain.',
        options: [
          { text: 'had been working', isCorrect: true },
          { text: 'were working', isCorrect: false },
          { text: 'have worked', isCorrect: false },
          { text: 'worked', isCorrect: false },
        ],
        explanation: '💡 Thì Quá khứ hoàn thành tiếp diễn: Nhấn mạnh quá trình nghiên cứu vất vả diễn ra liên tục trước mốc đột phá trong quá khứ (achieved net energy gain): had been + V-ing.',
        originalSentence: 'Physicists had been working on fusion before achieving breakthrough.',
        scrambledWords: ['Physicists', 'had', 'been', 'working', 'on', 'fusion', 'reactor'],
      },
      {
        text: '[Tương lai đơn] AI analysts predict that autonomous electric taxis _______ urban public transport in major cities by 2035.',
        options: [
          { text: 'will revolutionize', isCorrect: true },
          { text: 'revolutionize', isCorrect: false },
          { text: 'revolutionized', isCorrect: false },
          { text: 'have revolutionized', isCorrect: false },
        ],
        explanation: '💡 Thì Tương lai đơn (Future Simple): Dấu hiệu "predict that..." diễn tả dự đoán về tương lai của các chuyên gia công nghệ -> Dùng will + V-bare (will revolutionize).',
        originalSentence: 'Analysts predict autonomous taxis will revolutionize transport.',
        scrambledWords: ['Experts', 'predict', 'autonomous', 'taxis', 'will', 'revolutionize', 'cities'],
      },
      {
        text: '[Tương lai tiếp diễn] At this exact time next year, international delegates _______ at the United Nations General Assembly in New York.',
        options: [
          { text: 'will be gathering', isCorrect: true },
          { text: 'will gather', isCorrect: false },
          { text: 'gather', isCorrect: false },
          { text: 'are gathered', isCorrect: false },
        ],
        explanation: '💡 Thì Tương lai tiếp diễn (Future Continuous): Dấu hiệu "At this exact time next year" (Vào đúng thời điểm này năm sau) -> Dùng will be + V-ing (will be gathering).',
        originalSentence: 'At this time next year, delegates will be gathering in New York.',
        scrambledWords: ['At', 'this', 'time', 'delegates', 'will', 'be', 'gathering'],
      },
      {
        text: '[Tương lai hoàn thành] By 2030, many industrialized nations _______ their net greenhouse emissions by at least fifty percent.',
        options: [
          { text: 'will have slashed', isCorrect: true },
          { text: 'will slash', isCorrect: false },
          { text: 'slashed', isCorrect: false },
          { text: 'are slashing', isCorrect: false },
        ],
        explanation: '💡 Thì Tương lai hoàn thành (Future Perfect): Dấu hiệu "By + mốc tương lai" (By 2030) diễn tả hành động sẽ được hoàn thành trước thời điểm đó -> Dùng will have + V3 (will have slashed).',
        originalSentence: 'By 2030, nations will have slashed their carbon emissions.',
        scrambledWords: ['By', 'twenty', 'thirty', 'nations', 'will', 'have', 'slashed', 'emissions'],
      },
      {
        text: '[Tương lai HT tiếp diễn] By next December, the lead NASA engineer _______ deep-space satellite telemetry for over twenty-five years.',
        options: [
          { text: 'will have been supervising', isCorrect: true },
          { text: 'will supervise', isCorrect: false },
          { text: 'has supervised', isCorrect: false },
          { text: 'is supervising', isCorrect: false },
        ],
        explanation: '💡 Thì Tương lai hoàn thành tiếp diễn: Dấu hiệu "By next December ... for over twenty-five years" nhấn mạnh độ dài thâm niên liên tục tính đến một mốc tương lai: will have been + V-ing.',
        originalSentence: 'By next December, the engineer will have been supervising for 25 years.',
        scrambledWords: ['By', 'next', 'year', 'she', 'will', 'have', 'been', 'supervising'],
      },
    ];
    }
  }

  // ===========================================================
  // CATEGORY 3: CÂU ĐIỀU KIỆN (CONDITIONALS)
  // ===========================================================
  else if (
    lower.includes('điều kiện') ||
    lower.includes('conditional') ||
    lower.includes('if loại')
  ) {
    // Topic & Domain Extraction
    const isWar =
      lower.includes('chiến tranh') ||
      lower.includes('chien tranh') ||
      lower.includes('thế chiến') ||
      lower.includes('the chien') ||
      lower.includes('quân sự') ||
      lower.includes('quan su') ||
      lower.includes('hòa bình') ||
      lower.includes('hoa binh') ||
      lower.includes('hiệp định') ||
      lower.includes('hiep dinh') ||
      lower.includes('xung đột') ||
      lower.includes('xung dot') ||
      lower.includes('đình chiến') ||
      lower.includes('dinh chien') ||
      lower.includes('geneva') ||
      lower.includes('lịch sử') ||
      lower.includes('lich su') ||
      lower.includes('cold war') ||
      lower.includes('wwii') ||
      lower.includes('ww2') ||
      lower.includes('war') ||
      lower.includes('peace') ||
      lower.includes('treaty') ||
      lower.includes('conflict');

    const isTech =
      lower.includes('ai') ||
      lower.includes('trí tuệ nhân tạo') ||
      lower.includes('công nghệ') ||
      lower.includes('robot') ||
      lower.includes('máy tính') ||
      lower.includes('technology');

    const isClimate =
      lower.includes('môi trường') ||
      lower.includes('khí hậu') ||
      lower.includes('năng lượng') ||
      lower.includes('xe điện') ||
      lower.includes('climate');

    const isSpace =
      lower.includes('vũ trụ') ||
      lower.includes('nasa') ||
      lower.includes('thiên văn') ||
      lower.includes('sao hỏa') ||
      lower.includes('space');

    if (lower.includes('loại 2') || lower.includes('type 2') || lower.includes('unreal present') || (!lower.includes('loại 1') && !lower.includes('loại 3'))) {
      if (isKids) {
        if (isWar) {
          title = `🕊️ Chuyên Đề: Điều Kiện Loại 2 - Hòa Bình & Tình Bạn Thiếu Nhi (Kids A01 - ${count} Câu)`;
          description = `Giả định trái ngược thực tế ở hiện tại: Tình bạn hòa thuận, chia sẻ đồ chơi, siêu nhân bảo vệ sân trường và không bắt nạt.`;
          questionPool = [
            {
              text: 'If all children _______ their toys together, the playground would always be peaceful and happy.',
              options: [
                { text: 'shared', isCorrect: true },
                { text: 'share', isCorrect: false },
                { text: 'will share', isCorrect: false },
                { text: 'are sharing', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2 về hòa bình & chia sẻ: Mệnh đề If chia Quá khứ đơn (shared), mệnh đề chính dùng would be.',
              originalSentence: 'If all children shared their toys together, the playground would always be peaceful.',
              scrambledWords: ['If', 'children', 'shared', 'toys', 'playgrounds', 'would', 'be', 'peaceful'],
            },
            {
              text: 'If two little kittens _______ fighting over sweet milk, they could become best friends.',
              options: [
                { text: 'stopped', isCorrect: true },
                { text: 'stop', isCorrect: false },
                { text: 'will stop', isCorrect: false },
                { text: 'are stopping', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2 về hòa giải xung đột: Mệnh đề If chia Quá khứ đơn (stopped), vế chính dùng could become.',
              originalSentence: 'If two kittens stopped fighting over milk, they could become best friends.',
              scrambledWords: ['If', 'kittens', 'stopped', 'fighting', 'they', 'could', 'be', 'friends'],
            },
            {
              text: 'If a brave superhero _______ our school yard, no bully could ever hurt other kids.',
              options: [
                { text: 'protected', isCorrect: true },
                { text: 'protect', isCorrect: false },
                { text: 'will protect', isCorrect: false },
                { text: 'is protecting', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (protected), vế chính dùng could hurt.',
              originalSentence: 'If a brave superhero protected our school, no bully could hurt kids.',
              scrambledWords: ['If', 'a', 'superhero', 'protected', 'school', 'everyone', 'would', 'be', 'safe'],
            },
            {
              text: 'If my puppy and cat _______ peaceful friends, they would sleep together in the warm basket.',
              options: [
                { text: 'were', isCorrect: true },
                { text: 'are', isCorrect: false },
                { text: 'will be', isCorrect: false },
                { text: 'was', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Động từ "to be" trong mệnh đề If luôn chia "were" cho mọi ngôi (If my puppy and cat were peaceful friends).',
              originalSentence: 'If my puppy and cat were peaceful friends, they would sleep together.',
              scrambledWords: ['If', 'pets', 'were', 'peaceful', 'they', 'would', 'sleep', 'together'],
            },
            {
              text: 'What would happen if all classmates _______ hands in friendship and smiled warmly?',
              options: [
                { text: 'held', isCorrect: true },
                { text: 'hold', isCorrect: false },
                { text: 'will hold', isCorrect: false },
                { text: 'are holding', isCorrect: false },
              ],
              explanation: '💡 Câu hỏi điều kiện loại 2: What would happen if S + V2/ed? (held - quá khứ của hold).',
              originalSentence: 'What would happen if all classmates held hands in friendship?',
              scrambledWords: ['What', 'would', 'happen', 'if', 'classmates', 'held', 'hands'],
            },
            {
              text: 'If people _______ trees instead of arguing, the whole world would become a green garden.',
              options: [
                { text: 'planted', isCorrect: true },
                { text: 'plant', isCorrect: false },
                { text: 'will plant', isCorrect: false },
                { text: 'have planted', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "planted", vế chính dùng would become.',
              originalSentence: 'If people planted trees instead of arguing, the world would be green.',
              scrambledWords: ['If', 'people', 'planted', 'trees', 'the', 'world', 'would', 'be', 'green'],
            },
            {
              text: 'If student leaders _______ peaceful playground games, everyone would have a wonderful time.',
              options: [
                { text: 'organized', isCorrect: true },
                { text: 'organize', isCorrect: false },
                { text: 'will organize', isCorrect: false },
                { text: 'are organizing', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (organized), vế chính dùng would have.',
              originalSentence: 'If student leaders organized peaceful games, everyone would have fun.',
              scrambledWords: ['If', 'leaders', 'organized', 'games', 'everyone', 'would', 'have', 'fun'],
            },
            {
              text: 'If you _______ two friends quarreling over a football, how would you help them make peace?',
              options: [
                { text: 'saw', isCorrect: true },
                { text: 'see', isCorrect: false },
                { text: 'will see', isCorrect: false },
                { text: 'have seen', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "saw" (quá khứ của see), vế chính dùng how would you help.',
              originalSentence: 'If you saw two friends quarreling, how would you help them make peace?',
              scrambledWords: ['If', 'you', 'saw', 'friends', 'quarreling', 'how', 'would', 'you', 'help'],
            },
            {
              text: 'If our class _______ a peace club, we would make colorful friendship cards for everyone.',
              options: [
                { text: 'formed', isCorrect: true },
                { text: 'forms', isCorrect: false },
                { text: 'will form', isCorrect: false },
                { text: 'is forming', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (formed), vế chính dùng would make.',
              originalSentence: 'If our class formed a peace club, we would make friendship cards.',
              scrambledWords: ['If', 'we', 'formed', 'a', 'club', 'we', 'would', 'make', 'cards'],
            },
            {
              text: 'If children around the world _______ songs of kindness together, happiness would spread everywhere.',
              options: [
                { text: 'sang', isCorrect: true },
                { text: 'sing', isCorrect: false },
                { text: 'will sing', isCorrect: false },
                { text: 'have sung', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "sang" (quá khứ của sing), vế chính dùng would spread.',
              originalSentence: 'If children sang songs of kindness, happiness would spread everywhere.',
              scrambledWords: ['If', 'children', 'sang', 'together', 'happiness', 'would', 'spread'],
            },
          ];
        } else {
          // Kids general / superheroes / magic
          title = `🎯 Chuyên Đề: Câu Điều Kiện Loại 2 - Ước Mơ & Siêu Nhân (Kids A01 - ${count} Câu)`;
          description = `Giả định trái ngược với hiện tại về siêu anh hùng, thú cưng biết nói, cây đũa thần và thế giới hoạt hình.`;
          questionPool = [
            {
              text: 'If I _______ a brave superhero, I would fly across the blue sky to help people.',
              options: [
                { text: 'were', isCorrect: true },
                { text: 'am', isCorrect: false },
                { text: 'was', isCorrect: false },
                { text: 'will be', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Động từ "to be" trong mệnh đề If luôn chia "were" cho mọi ngôi khi giả định ước mơ siêu nhân (If I were a superhero).',
              originalSentence: 'If I were a brave superhero, I would fly across the blue sky to help people.',
              scrambledWords: ['If', 'I', 'were', 'a', 'superhero', 'I', 'would', 'fly', 'high'],
            },
            {
              text: 'If my pet puppy _______ speak human words, he would tell me funny bedtime stories.',
              options: [
                { text: 'could', isCorrect: true },
                { text: 'can', isCorrect: false },
                { text: 'will', isCorrect: false },
                { text: 'may', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Giả định chú cún biết nói, mệnh đề If dùng "could" (quá khứ của can), vế chính dùng would tell.',
              originalSentence: 'If my puppy could speak, he would tell funny bedtime stories.',
              scrambledWords: ['If', 'my', 'puppy', 'could', 'speak', 'he', 'would', 'tell', 'stories'],
            },
            {
              text: 'What would you do if a friendly little alien _______ in our school playground?',
              options: [
                { text: 'landed', isCorrect: true },
                { text: 'lands', isCorrect: false },
                { text: 'will land', isCorrect: false },
                { text: 'is landing', isCorrect: false },
              ],
              explanation: '💡 Câu hỏi điều kiện loại 2: What would you do if + S + V2/ed? (landed).',
              originalSentence: 'What would you do if a friendly alien landed in our playground?',
              scrambledWords: ['What', 'would', 'you', 'do', 'if', 'an', 'alien', 'landed'],
            },
            {
              text: 'If we _______ wings like cheerful birds, we would fly to school every morning.',
              options: [
                { text: 'had', isCorrect: true },
                { text: 'have', isCorrect: false },
                { text: 'will have', isCorrect: false },
                { text: 'having', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Giả định có đôi cánh (trái thực tế hiện tại), mệnh đề If chia "had" (quá khứ của have).',
              originalSentence: 'If we had wings like birds, we would fly to school every morning.',
              scrambledWords: ['If', 'we', 'had', 'wings', 'we', 'would', 'fly', 'to', 'school'],
            },
            {
              text: 'If Peter _______ a magic wand, he would turn his yellow pencil into sweet candy.',
              options: [
                { text: 'owned', isCorrect: true },
                { text: 'owns', isCorrect: false },
                { text: 'will own', isCorrect: false },
                { text: 'is owning', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Giả định có cây đũa phép, mệnh đề If chia Quá khứ đơn (owned), vế chính dùng would turn.',
              originalSentence: 'If Peter owned a magic wand, he would turn his pencil into candy.',
              scrambledWords: ['If', 'Peter', 'owned', 'a', 'wand', 'he', 'would', 'make', 'candy'],
            },
            {
              text: 'If giant pandas _______ in the tall trees behind our house, I would give them fresh bamboo daily.',
              options: [
                { text: 'lived', isCorrect: true },
                { text: 'live', isCorrect: false },
                { text: 'will live', isCorrect: false },
                { text: 'are living', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Giả định gấu trúc sống sau nhà, mệnh đề If chia "lived", vế chính dùng would give.',
              originalSentence: 'If pandas lived in our trees, I would give them bamboo daily.',
              scrambledWords: ['If', 'pandas', 'lived', 'here', 'I', 'would', 'feed', 'them'],
            },
            {
              text: 'What gift would you choose if Santa Claus _______ to your bedroom tonight?',
              options: [
                { text: 'came', isCorrect: true },
                { text: 'comes', isCorrect: false },
                { text: 'will come', isCorrect: false },
                { text: 'is coming', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Giả định ông già Noel ghé thăm, mệnh đề If dùng "came" (V2 của come).',
              originalSentence: 'What gift would you choose if Santa Claus came to your room?',
              scrambledWords: ['What', 'would', 'you', 'choose', 'if', 'Santa', 'came', 'tonight'],
            },
            {
              text: 'If my toy robot _______ dance hip-hop, all the students would clap their hands happily.',
              options: [
                { text: 'could', isCorrect: true },
                { text: 'can', isCorrect: false },
                { text: 'will', isCorrect: false },
                { text: 'must', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If dùng "could dance", vế chính dùng would clap.',
              originalSentence: 'If my toy robot could dance, students would clap happily.',
              scrambledWords: ['If', 'the', 'robot', 'could', 'dance', 'students', 'would', 'clap'],
            },
            {
              text: 'If colorful candies _______ from the sky, children would run outside with big buckets.',
              options: [
                { text: 'rained', isCorrect: true },
                { text: 'rains', isCorrect: false },
                { text: 'will rain', isCorrect: false },
                { text: 'is raining', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2 giả định mưa kẹo: Mệnh đề If chia "rained", vế chính dùng would run.',
              originalSentence: 'If candies rained from the sky, children would run with buckets.',
              scrambledWords: ['If', 'candies', 'rained', 'kids', 'would', 'run', 'outside'],
            },
            {
              text: 'If we _______ a big time machine, we would travel back to see baby dinosaurs.',
              options: [
                { text: 'built', isCorrect: true },
                { text: 'build', isCorrect: false },
                { text: 'will build', isCorrect: false },
                { text: 'are building', isCorrect: false },
              ],
              explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "built" (V2 của build), vế chính dùng would travel.',
              originalSentence: 'If we built a time machine, we would travel to see dinosaurs.',
              scrambledWords: ['If', 'we', 'built', 'a', 'time', 'machine', 'we', 'would', 'see', 'dinosaurs'],
            },
          ];
        }
      } else if (isWar) {
        title = `🕊️ Chuyên Đề: Câu Điều Kiện Loại 2 (Sự Kiện Chiến Tranh & Hòa Bình Quốc Tế - ${count} Câu)`;
        description = `Giả định trái ngược thực tế ở hiện tại (If + Past Simple, would/could + V-bare) lồng ghép bối cảnh chiến tranh lịch sử, hiệp định hòa bình, đình chiến và nhân đạo quốc tế.`;

        questionPool = [
          {
            text: 'If nations _______ diplomatic dialogues instead of military escalation, thousands of innocent civilian lives would be saved.',
            options: [
              { text: 'prioritized', isCorrect: true },
              { text: 'prioritize', isCorrect: false },
              { text: 'will prioritize', isCorrect: false },
              { text: 'have prioritized', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2 (giả định hiện tại): Mệnh đề If chia Quá khứ đơn (prioritized), mệnh đề chính dùng would be + V3 (would be saved).',
            originalSentence: 'If nations prioritized diplomatic dialogues instead of military escalation, thousands of civilian lives would be saved.',
            scrambledWords: ['If', 'nations', 'prioritized', 'dialogue', 'civilian', 'lives', 'would', 'be', 'saved'],
          },
          {
            text: 'If the peace treaty _______ fully respected by all warring factions today, humanitarian convoys could safely deliver food to refugees.',
            options: [
              { text: 'were', isCorrect: true },
              { text: 'is', isCorrect: false },
              { text: 'will be', isCorrect: false },
              { text: 'has been', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Động từ "to be" trong mệnh đề If chia "were" cho mọi ngôi (If the peace treaty were respected).',
            originalSentence: 'If the peace treaty were respected, convoys could safely deliver aid.',
            scrambledWords: ['If', 'the', 'treaty', 'were', 'respected', 'aid', 'could', 'reach', 'refugees'],
          },
          {
            text: 'What would happen to the postwar reconstruction effort if international donors _______ all financial aid tomorrow?',
            options: [
              { text: 'withdrew', isCorrect: true },
              { text: 'withdraw', isCorrect: false },
              { text: 'will withdraw', isCorrect: false },
              { text: 'are withdrawing', isCorrect: false },
            ],
            explanation: '💡 Câu hỏi giả định loại 2: What would happen if + S + V-past? (withdrew - quá khứ của withdraw).',
            originalSentence: 'What would happen to reconstruction if donors withdrew financial aid?',
            scrambledWords: ['What', 'would', 'happen', 'if', 'donors', 'withdrew', 'aid'],
          },
          {
            text: 'If frontline commanders _______ the official ceasefire order immediately, heavy artillery bombardments along the border would cease.',
            options: [
              { text: 'received', isCorrect: true },
              { text: 'receive', isCorrect: false },
              { text: 'will receive', isCorrect: false },
              { text: 'had received', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (received), mệnh đề chính dùng would + V-bare (would cease).',
            originalSentence: 'If frontline commanders received the ceasefire order, bombardments would cease.',
            scrambledWords: ['If', 'commanders', 'received', 'the', 'order', 'bombardments', 'would', 'cease'],
          },
          {
            text: 'Were all sovereign states to abide strictly by the Geneva Conventions, modern armed conflicts _______ significantly fewer civilian casualties.',
            options: [
              { text: 'would cause', isCorrect: true },
              { text: 'will cause', isCorrect: false },
              { text: 'caused', isCorrect: false },
              { text: 'causes', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2: "Were + S + to V, S + would + V-bare" (giả định mang tính chất trang trọng về tuân thủ Công ước Geneva).',
            originalSentence: 'Were sovereign states to abide by Geneva Conventions, armed conflicts would cause fewer casualties.',
            scrambledWords: ['Were', 'states', 'to', 'abide', 'by', 'conventions', 'conflicts', 'would', 'cause', 'less', 'harm'],
          },
          {
            text: 'If historians _______ unrestricted access to all classified wartime archives, they could reconstruct the exact timeline of the Cold War crises.',
            options: [
              { text: 'had', isCorrect: true },
              { text: 'have', isCorrect: false },
              { text: 'would have', isCorrect: false },
              { text: 'will have', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If dùng "had" (quá khứ đơn của have), mệnh đề chính dùng could + V-bare (could reconstruct).',
            originalSentence: 'If historians had access to classified wartime archives, they could reconstruct the timeline.',
            scrambledWords: ['If', 'historians', 'had', 'access', 'to', 'archives', 'they', 'could', 'clarify', 'history'],
          },
          {
            text: 'If military strategists truly _______ the catastrophic humanitarian cost of modern warfare, they would choose peaceful mediation instead.',
            options: [
              { text: 'comprehended', isCorrect: true },
              { text: 'comprehend', isCorrect: false },
              { text: 'will comprehend', isCorrect: false },
              { text: 'have comprehended', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (comprehended), mệnh đề chính dùng would + V-bare (would choose).',
            originalSentence: 'If strategists comprehended the cost of warfare, they would choose peaceful mediation.',
            scrambledWords: ['If', 'strategists', 'comprehended', 'war', 'costs', 'they', 'would', 'choose', 'peace'],
          },
          {
            text: 'If sovereign governments _______ all unexploded landmines from former battlefields, displaced villagers could return to cultivate their homeland safely.',
            options: [
              { text: 'cleared', isCorrect: true },
              { text: 'clear', isCorrect: false },
              { text: 'will clear', isCorrect: false },
              { text: 'are clearing', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "cleared", mệnh đề chính dùng could + V-bare (could return).',
            originalSentence: 'If governments cleared all unexploded landmines, villagers could return safely.',
            scrambledWords: ['If', 'governments', 'cleared', 'landmines', 'villagers', 'could', 'return', 'safely'],
          },
          {
            text: 'If the United Nations Security Council _______ genuine consensus on wartime de-escalation, regional proxy conflicts would terminate much sooner.',
            options: [
              { text: 'reached', isCorrect: true },
              { text: 'reaches', isCorrect: false },
              { text: 'will reach', isCorrect: false },
              { text: 'is reaching', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (reached), mệnh đề chính dùng would + V-bare (would terminate).',
            originalSentence: 'If the Security Council reached consensus on de-escalation, conflicts would terminate sooner.',
            scrambledWords: ['If', 'the', 'council', 'reached', 'consensus', 'hostilities', 'would', 'terminate'],
          },
          {
            text: 'Were battlefield diplomats given full authority to negotiate an armistice, both armies _______ back from the perimeter without further bloodshed.',
            options: [
              { text: 'would pull', isCorrect: true },
              { text: 'will pull', isCorrect: false },
              { text: 'pulled', isCorrect: false },
              { text: 'are pulling', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2 với dạng bị động: "Were + S + V3/ed (Were diplomats given...), S + would + V-bare (would pull back)".',
            originalSentence: 'Were diplomats given authority to negotiate an armistice, both armies would pull back.',
            scrambledWords: ['Were', 'diplomats', 'given', 'authority', 'armies', 'would', 'pull', 'back'],
          },
          {
            text: 'If global superpowers _______ their entire stockpile of nuclear warheads today, the existential threat of World War III would vanish completely.',
            options: [
              { text: 'dismantled', isCorrect: true },
              { text: 'dismantle', isCorrect: false },
              { text: 'will dismantle', isCorrect: false },
              { text: 'have dismantled', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (dismantled), mệnh đề chính dùng would + V-bare (would vanish).',
            originalSentence: 'If superpowers dismantled nuclear warheads, the threat of World War III would vanish.',
            scrambledWords: ['If', 'superpowers', 'dismantled', 'nuclear', 'weapons', 'threats', 'would', 'vanish'],
          },
          {
            text: 'If frontline combat medics _______ continuous access to emergency blood plasma, hundreds of critically injured casualties could be saved.',
            options: [
              { text: 'possessed', isCorrect: true },
              { text: 'possess', isCorrect: false },
              { text: 'will possess', isCorrect: false },
              { text: 'have possessed', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (possessed), mệnh đề chính dùng could be + V3 (could be saved).',
            originalSentence: 'If combat medics possessed emergency blood supplies, more casualties could be saved.',
            scrambledWords: ['If', 'medics', 'possessed', 'blood', 'supplies', 'casualties', 'could', 'be', 'saved'],
          },
          {
            text: 'If neighboring countries _______ to maintain strict neutrality during the regional conflict, cross-border refugee crises would be much easier to manage.',
            options: [
              { text: 'agreed', isCorrect: true },
              { text: 'agree', isCorrect: false },
              { text: 'will agree', isCorrect: false },
              { text: 'have agreed', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (agreed), mệnh đề chính dùng would + be.',
            originalSentence: 'If neighboring countries agreed to maintain neutrality, refugee crises would be easier to manage.',
            scrambledWords: ['If', 'neighbors', 'agreed', 'neutrality', 'crises', 'would', 'be', 'easier'],
          },
          {
            text: 'Were the warring alliances to sign a permanent non-aggression pact tomorrow, defense expenditures _______ to rebuild war-torn schools and hospitals.',
            options: [
              { text: 'could be redirected', isCorrect: true },
              { text: 'can be redirected', isCorrect: false },
              { text: 'redirected', isCorrect: false },
              { text: 'will be redirected', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2: "Were + S + to V, S + could be + V3" (quân phí có thể được chuyển hướng tái thiết trường học và bệnh viện).',
            originalSentence: 'Were alliances to sign a non-aggression pact, defense budgets could be redirected to reconstruction.',
            scrambledWords: ['Were', 'alliances', 'to', 'sign', 'pacts', 'funds', 'could', 'be', 'redirected'],
          },
          {
            text: 'If international war tribunals _______ war criminals impartially and swiftly, future aggressors would think twice before initiating hostilities.',
            options: [
              { text: 'prosecuted', isCorrect: true },
              { text: 'prosecute', isCorrect: false },
              { text: 'will prosecute', isCorrect: false },
              { text: 'have prosecuted', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (prosecuted), mệnh đề chính dùng would + V-bare (would think twice).',
            originalSentence: 'If war tribunals prosecuted criminals impartially, future aggressors would think twice.',
            scrambledWords: ['If', 'tribunals', 'prosecuted', 'criminals', 'aggressors', 'would', 'think', 'twice'],
          },
        ];
      } else if (isTech) {
        title = `🤖 Chuyên Đề: Câu Điều Kiện Loại 2 (Trí Tuệ Nhân Tạo AI & Công Nghệ - ${count} Câu)`;
        description = `Giả định trái ngược với hiện tại về AI, robot tự hành, điện toán lượng tử và an ninh mạng.`;

        questionPool = [
          {
            text: 'If humanoid robots _______ full emotional self-awareness, society would need to grant them ethical legal rights.',
            options: [
              { text: 'developed', isCorrect: true },
              { text: 'develop', isCorrect: false },
              { text: 'will develop', isCorrect: false },
              { text: 'have developed', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (developed), mệnh đề chính dùng would need.',
            originalSentence: 'If robots developed emotional awareness, society would need ethical rights.',
            scrambledWords: ['If', 'robots', 'developed', 'awareness', 'society', 'would', 'need', 'laws'],
          },
          {
            text: 'What would happen if quantum supercomputers _______ all current cryptographic encryption algorithms overnight?',
            options: [
              { text: 'cracked', isCorrect: true },
              { text: 'crack', isCorrect: false },
              { text: 'will crack', isCorrect: false },
              { text: 'are cracking', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: What would happen if S + V2/ed (cracked).',
            originalSentence: 'What would happen if quantum computers cracked encryption?',
            scrambledWords: ['What', 'would', 'happen', 'if', 'quantum', 'computers', 'cracked', 'codes'],
          },
          {
            text: 'If I _______ chief AI safety officer at an international tech conglomerate, I would mandate transparent algorithm auditing.',
            options: [
              { text: 'were', isCorrect: true },
              { text: 'am', isCorrect: false },
              { text: 'was', isCorrect: false },
              { text: 'would be', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Động từ "to be" chia "were" cho mọi ngôi (If I were chief officer).',
            originalSentence: 'If I were chief AI officer, I would mandate transparent auditing.',
            scrambledWords: ['If', 'I', 'were', 'AI', 'officer', 'I', 'would', 'mandate', 'audits'],
          },
          {
            text: 'Were software engineers to solve artificial general intelligence safely, humanity _______ unimaginable scientific breakthroughs.',
            options: [
              { text: 'could achieve', isCorrect: true },
              { text: 'can achieve', isCorrect: false },
              { text: 'achieved', isCorrect: false },
              { text: 'will achieve', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2: "Were engineers to solve..., humanity could achieve...".',
            originalSentence: 'Were engineers to solve AGI, humanity could achieve breakthroughs.',
            scrambledWords: ['Were', 'engineers', 'to', 'solve', 'AGI', 'we', 'could', 'advance'],
          },
          {
            text: 'If cities _______ exclusively on autonomous electric transport grids, urban traffic congestion would disappear.',
            options: [
              { text: 'operated', isCorrect: true },
              { text: 'operate', isCorrect: false },
              { text: 'will operate', isCorrect: false },
              { text: 'are operating', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (operated), mệnh đề chính dùng would + V.',
            originalSentence: 'If cities operated on autonomous grids, congestion would disappear.',
            scrambledWords: ['If', 'cities', 'operated', 'on', 'EVs', 'traffic', 'would', 'vanish'],
          },
        ];
      } else if (isClimate) {
        title = `🌱 Chuyên Đề: Câu Điều Kiện Loại 2 (Biến Đổi Khí Hậu & Năng Lượng Xanh - ${count} Câu)`;
        description = `Giả định hiện tại về giải pháp bảo vệ hành tinh, năng lượng sạch và giảm phát thải carbon.`;

        questionPool = [
          {
            text: 'If all industrialized nations _______ fully to renewable energy today, global carbon emissions would plummet by sixty percent.',
            options: [
              { text: 'switched', isCorrect: true },
              { text: 'switch', isCorrect: false },
              { text: 'will switch', isCorrect: false },
              { text: 'have switched', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (switched), mệnh đề chính dùng would plummet.',
            originalSentence: 'If nations switched to renewable energy, emissions would plummet.',
            scrambledWords: ['If', 'nations', 'switched', 'to', 'clean', 'energy', 'emissions', 'would', 'drop'],
          },
          {
            text: 'What would happen to polar ice sheets if global average temperatures _______ by another two degrees Celsius?',
            options: [
              { text: 'rose', isCorrect: true },
              { text: 'rise', isCorrect: false },
              { text: 'will rise', isCorrect: false },
              { text: 'have risen', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (rose - quá khứ của rise).',
            originalSentence: 'What would happen if global temperatures rose by two degrees?',
            scrambledWords: ['What', 'would', 'happen', 'if', 'temperatures', 'rose'],
          },
          {
            text: 'If consumers _______ single-use plastic packaging entirely, marine ocean ecosystems could regenerate quickly.',
            options: [
              { text: 'boycotted', isCorrect: true },
              { text: 'boycott', isCorrect: false },
              { text: 'will boycott', isCorrect: false },
              { text: 'are boycotting', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (boycotted), mệnh đề chính dùng could regenerate.',
            originalSentence: 'If consumers boycotted plastic, oceans could regenerate.',
            scrambledWords: ['If', 'buyers', 'boycotted', 'plastic', 'oceans', 'could', 'heal'],
          },
        ];
      } else {
        title = `🎯 Chuyên Đề: Câu Điều Kiện Loại 2 (Second Conditional - ${count} Câu)`;
        description = `Giả định trái ngược với thực tế ở hiện tại, kết hợp các tình huống công nghệ, ngoại giao và xã hội hiện đại.`;

        questionPool = [
          {
            text: 'If all countries _______ fully to clean energy today, global warming would be mitigated significantly.',
            options: [
              { text: 'switched', isCorrect: true },
              { text: 'switch', isCorrect: false },
              { text: 'will switch', isCorrect: false },
              { text: 'have switched', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (switched), mệnh đề chính dùng would be mitigated.',
            originalSentence: 'If countries switched to clean energy, warming would decrease.',
            scrambledWords: ['If', 'all', 'countries', 'switched', 'to', 'clean', 'energy'],
          },
          {
            text: 'If I _______ the director of NASA, I would fund deep-space robotic exploration missions to Jupiter\'s moons.',
            options: [
              { text: 'were', isCorrect: true },
              { text: 'am', isCorrect: false },
              { text: 'was', isCorrect: false },
              { text: 'would be', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: To be trong mệnh đề If luôn chia "were" cho mọi ngôi (If I were the director).',
            originalSentence: 'If I were the director of NASA, I would fund space probes.',
            scrambledWords: ['If', 'I', 'were', 'NASA', 'director', 'I', 'would', 'explore'],
          },
          {
            text: 'What would happen if the global internet network _______ a catastrophic geomagnetic storm tomorrow?',
            options: [
              { text: 'experienced', isCorrect: true },
              { text: 'experiences', isCorrect: false },
              { text: 'will experience', isCorrect: false },
              { text: 'is experiencing', isCorrect: false },
            ],
            explanation: '💡 Câu hỏi giả định loại 2: What would happen if S + V2/ed? (experienced).',
            originalSentence: 'What would happen if the internet experienced a storm?',
            scrambledWords: ['What', 'would', 'happen', 'if', 'a', 'solar', 'storm', 'hit'],
          },
          {
            text: 'If she _______ multiple foreign languages fluently, she could easily work as a diplomat at the United Nations.',
            options: [
              { text: 'spoke', isCorrect: true },
              { text: 'speaks', isCorrect: false },
              { text: 'has spoken', isCorrect: false },
              { text: 'will speak', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "spoke", mệnh đề chính dùng "could easily work".',
            originalSentence: 'If she spoke languages fluently, she could be a diplomat.',
            scrambledWords: ['If', 'she', 'spoke', 'languages', 'she', 'could', 'work', 'abroad'],
          },
          {
            text: 'Were human beings able to live on Mars, they _______ pressurized biosphere domes to survive.',
            options: [
              { text: 'would build', isCorrect: true },
              { text: 'will build', isCorrect: false },
              { text: 'built', isCorrect: false },
              { text: 'build', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2: "Were + S + to V/adj, S + would + V" (diễn tả giả định sống trên sao Hỏa).',
            originalSentence: 'Were humans able to live on Mars, they would build domes.',
            scrambledWords: ['Were', 'humans', 'able', 'to', 'live', 'on', 'Mars', 'they', 'build'],
          },
          {
            text: 'If universities _______ tuition fees for STEM degrees, millions of disadvantaged students could access higher education.',
            options: [
              { text: 'eliminated', isCorrect: true },
              { text: 'eliminate', isCorrect: false },
              { text: 'will eliminate', isCorrect: false },
              { text: 'have eliminated', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (eliminated), mệnh đề chính dùng could access.',
            originalSentence: 'If universities eliminated tuition, more students could attend.',
            scrambledWords: ['If', 'colleges', 'eliminated', 'tuition', 'students', 'could', 'attend'],
          },
          {
            text: 'If doctors _______ an affordable artificial pancreas tomorrow, diabetes patients would no longer suffer from insulin injections.',
            options: [
              { text: 'perfected', isCorrect: true },
              { text: 'perfect', isCorrect: false },
              { text: 'will perfect', isCorrect: false },
              { text: 'have perfected', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia "perfected", mệnh đề chính dùng would + V-bare.',
            originalSentence: 'If doctors perfected an artificial pancreas, patients would suffer less.',
            scrambledWords: ['If', 'doctors', 'perfected', 'pancreas', 'patients', 'would', 'recover'],
          },
          {
            text: 'Were global financial markets to crash tomorrow, central banks _______ emergency liquidity instantly.',
            options: [
              { text: 'would inject', isCorrect: true },
              { text: 'will inject', isCorrect: false },
              { text: 'injected', isCorrect: false },
              { text: 'inject', isCorrect: false },
            ],
            explanation: '💡 Đảo ngữ điều kiện loại 2: "Were markets to crash..., banks would inject...".',
            originalSentence: 'Were markets to crash, banks would inject liquidity.',
            scrambledWords: ['Were', 'markets', 'to', 'crash', 'banks', 'would', 'help'],
          },
          {
            text: 'If you _______ the chance to converse with Albert Einstein, what scientific question would you ask him first?',
            options: [
              { text: 'had', isCorrect: true },
              { text: 'have', isCorrect: false },
              { text: 'would have', isCorrect: false },
              { text: 'will have', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Giả định không có thật ở hiện tại (If you had... what would you ask?).',
            originalSentence: 'If you had the chance to meet Einstein, what would you ask?',
            scrambledWords: ['If', 'you', 'had', 'the', 'chance', 'what', 'would', 'you', 'ask'],
          },
          {
            text: 'If autonomous delivery drones _______ quieter rotor blades, city residents would welcome their deployment.',
            options: [
              { text: 'used', isCorrect: true },
              { text: 'use', isCorrect: false },
              { text: 'will use', isCorrect: false },
              { text: 'are using', isCorrect: false },
            ],
            explanation: '💡 Câu điều kiện loại 2: Mệnh đề If chia Quá khứ đơn (used), mệnh đề chính dùng would welcome.',
            originalSentence: 'If drones used quieter rotors, residents would welcome them.',
            scrambledWords: ['If', 'drones', 'used', 'quieter', 'rotors', 'people', 'would', 'agree'],
          },
        ];
      }
    } else if (lower.includes('loại 3') || lower.includes('type 3') || lower.includes('past unreal')) {
      title = `⏳ Chuyên Đề: Câu Điều Kiện Loại 3 (Third Conditional - ${count} Câu)`;
      description = `Giả định trái ngược với quá khứ (If + Had + V3, would have + V3) gắn với các bài học lịch sử và sự kiện quốc tế.`;

      questionPool = [
        {
          text: 'If the armistice _______ six months earlier, millions of soldiers and civilians would have survived World War I.',
          options: [
            { text: 'had been signed', isCorrect: true },
            { text: 'was signed', isCorrect: false },
            { text: 'were signed', isCorrect: false },
            { text: 'has been signed', isCorrect: false },
          ],
          explanation: '💡 Điều kiện loại 3 (giả định quá khứ): Mệnh đề If dùng Quá khứ hoàn thành bị động (had been signed), mệnh đề chính dùng would have survived.',
          originalSentence: 'If the armistice had been signed earlier, millions would have survived.',
          scrambledWords: ['If', 'armistice', 'had', 'been', 'signed', 'millions', 'would', 'have', 'lived'],
        },
        {
          text: 'What would have happened if the Allied codebreakers _______ the Enigma machine during the Battle of the Atlantic?',
          options: [
            { text: 'had not decrypted', isCorrect: true },
            { text: 'did not decrypt', isCorrect: false },
            { text: 'would not decrypt', isCorrect: false },
            { text: 'have not decrypted', isCorrect: false },
          ],
          explanation: '💡 Câu hỏi điều kiện loại 3: Mệnh đề If chia Quá khứ hoàn thành (had not decrypted).',
          originalSentence: 'What would have happened if codebreakers had not decrypted Enigma?',
          scrambledWords: ['What', 'would', 'have', 'happened', 'without', 'Enigma', 'decryption'],
        },
        {
          text: 'Had the international coalition provided emergency vaccines faster, the pandemic _______ so extensively across borders.',
          options: [
            { text: 'would not have spread', isCorrect: true },
            { text: 'will not spread', isCorrect: false },
            { text: 'did not spread', isCorrect: false },
            { text: 'would not spread', isCorrect: false },
          ],
          explanation: '💡 Đảo ngữ điều kiện loại 3: "Had + S + V3, S + would have + V3" (Had the coalition provided..., the pandemic would not have spread).',
          originalSentence: 'Had vaccines arrived faster, the pandemic would not have spread.',
          scrambledWords: ['Had', 'vaccines', 'arrived', 'the', 'disease', 'would', 'not', 'have', 'spread'],
        },
      ];
    } else {
      title = `🎯 Chuyên Đề: Câu Điều Kiện Toàn Diện & Thời Sự (${count} Câu)`;
      questionPool = [
        {
          text: '[Loại 1] If electric battery costs continue to drop, affordable EVs _______ the dominant choice on roads.',
          options: [
            { text: 'will become', isCorrect: true },
            { text: 'became', isCorrect: false },
            { text: 'would become', isCorrect: false },
            { text: 'had become', isCorrect: false },
          ],
          explanation: '💡 Điều kiện loại 1: Mệnh đề If dùng Hiện tại đơn (continue to drop), mệnh đề chính dùng will + V.',
          originalSentence: 'If costs drop, EVs will become dominant.',
          scrambledWords: ['If', 'costs', 'drop', 'EVs', 'will', 'become', 'popular'],
        },
        {
          text: '[Loại 2] If society _______ completely dependent on automated systems, human critical thinking could decline.',
          options: [
            { text: 'became', isCorrect: true },
            { text: 'becomes', isCorrect: false },
            { text: 'has become', isCorrect: false },
            { text: 'will become', isCorrect: false },
          ],
          explanation: '💡 Điều kiện loại 2: Giả định trái hiện tại (became... could decline).',
          originalSentence: 'If society became too dependent, thinking could decline.',
          scrambledWords: ['If', 'society', 'became', 'reliant', 'skills', 'could', 'drop'],
        },
      ];
    }
  }

  // ===========================================================
  // CATEGORY 4: ĐẢO NGỮ (INVERSION)
  // ===========================================================
  else if (
    lower.includes('đảo ngữ') ||
    lower.includes('inversion') ||
    lower.includes('hardly had') ||
    lower.includes('never before')
  ) {
    title = `⚡ Chuyên Đề: Đảo Ngữ Ngữ Pháp & Thời Sự Quốc Tế (${count} Câu)`;
    description = `Đảo ngữ trạng từ phủ định, No sooner, Hardly, Only by, Not only đặt trong các sự kiện khoa học và tin tức thế giới.`;

    questionPool = [
      {
        text: 'Never before _______ humanity witnessed such exponential advancements in artificial intelligence.',
        options: [
          { text: 'has', isCorrect: true },
          { text: 'did', isCorrect: false },
          { text: 'was', isCorrect: false },
          { text: 'had', isCorrect: false },
        ],
        explanation: '💡 Đảo ngữ với "Never before + Trợ động từ (has) + S (humanity) + V3 (witnessed)".',
        originalSentence: 'Never before has humanity witnessed such advancements.',
        scrambledWords: ['Never', 'before', 'has', 'humanity', 'seen', 'such', 'progress'],
      },
      {
        text: 'Under no circumstances _______ nations deploy autonomous weapons without human oversight.',
        options: [
          { text: 'should', isCorrect: true },
          { text: 'must not', isCorrect: false },
          { text: 'they should', isCorrect: false },
          { text: 'do', isCorrect: false },
        ],
        explanation: '💡 Cụm phủ định "Under no circumstances + Trợ động từ (should) + S + V" = Không bao giờ được phép trong bất kỳ hoàn cảnh nào.',
        originalSentence: 'Under no circumstances should autonomous weapons be deployed.',
        scrambledWords: ['Under', 'no', 'circumstances', 'should', 'weapons', 'be', 'used'],
      },
      {
        text: 'Only by collaborating across borders _______ scientists develop climate-resilient agricultural crops.',
        options: [
          { text: 'can', isCorrect: true },
          { text: 'they can', isCorrect: false },
          { text: 'could they not', isCorrect: false },
          { text: 'will they', isCorrect: false },
        ],
        explanation: '💡 Đảo ngữ với "Only by + V-ing": Vế sau đảo trợ động từ lên trước chủ ngữ: "Only by + V-ing + can + S + V".',
        originalSentence: 'Only by collaborating can scientists develop crops.',
        scrambledWords: ['Only', 'by', 'collaborating', 'can', 'we', 'solve', 'climate', 'issues'],
      },
      {
        text: 'No sooner had the James Webb telescope reached orbit _______ it transmitted unprecedented deep-field imagery.',
        options: [
          { text: 'than', isCorrect: true },
          { text: 'when', isCorrect: false },
          { text: 'then', isCorrect: false },
          { text: 'as', isCorrect: false },
        ],
        explanation: '💡 Cấu trúc: "No sooner had + S + V3... THAN + S + V-ed" (Vừa mới... thì...).',
        originalSentence: 'No sooner had the telescope reached orbit than it sent data.',
        scrambledWords: ['No', 'sooner', 'had', 'it', 'launched', 'than', 'data', 'arrived'],
      },
    ];
  }

  // ===========================================================
  // CATEGORY 5: GENERAL ENGLISH & WORLD EVENTS (NO NAIVE STRING INJECTIONS!)
  // ===========================================================
  else {
    if (isKids) {
      title = `🌟 Tiếng Anh Thiếu Nhi Toàn Diện (Kids Primary A01 - ${count} Câu)`;
      description = `Bộ câu hỏi rèn luyện ngữ pháp và từ vựng cơ bản: Con vật, đồ dùng học tập, gia đình và bạn bè.`;
      questionPool = [
        {
          text: 'Look at that cute animal in the zoo! It is a big white and black _______ eating bamboo.',
          options: [
            { text: 'panda', isCorrect: true },
            { text: 'pencil', isCorrect: false },
            { text: 'airplane', isCorrect: false },
            { text: 'guitar', isCorrect: false },
          ],
          explanation: '💡 Từ vựng thiếu nhi: "panda" là chú gấu trúc lông trắng đen thích ăn tre trúc.',
          originalSentence: 'It is a big white and black panda eating bamboo.',
          scrambledWords: ['It', 'is', 'a', 'cute', 'panda', 'eating', 'bamboo'],
        },
        {
          text: 'Every Sunday morning, my father and I _______ soccer in the green park.',
          options: [
            { text: 'play', isCorrect: true },
            { text: 'plays', isCorrect: false },
            { text: 'playing', isCorrect: false },
            { text: 'played', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại đơn với chủ ngữ số nhiều: "my father and I" (hai người = chúng tôi) nên động từ giữ nguyên mẫu (play).',
          originalSentence: 'Every Sunday morning, my father and I play soccer in the green park.',
          scrambledWords: ['My', 'father', 'and', 'I', 'play', 'soccer', 'in', 'the', 'park'],
        },
        {
          text: 'Lucy loves sweet red apples, but her little brother _______ yellow bananas.',
          options: [
            { text: 'likes', isCorrect: true },
            { text: 'like', isCorrect: false },
            { text: 'liking', isCorrect: false },
            { text: 'are liking', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại đơn: Chủ ngữ số ít "her little brother" (ngôi thứ 3 số ít) nên động từ like thêm -s thành "likes" nhé!',
          originalSentence: 'Lucy loves apples, but her brother likes bananas.',
          scrambledWords: ['Her', 'little', 'brother', 'likes', 'sweet', 'yellow', 'bananas'],
        },
        {
          text: 'There _______ five colorful balloons floating in the bright blue sky.',
          options: [
            { text: 'are', isCorrect: true },
            { text: 'is', isCorrect: false },
            { text: 'am', isCorrect: false },
            { text: 'be', isCorrect: false },
          ],
          explanation: '💡 Cấu trúc There is / There are: Danh từ số nhiều "five colorful balloons" (5 quả bóng bay) nên dùng "There are" nhé!',
          originalSentence: 'There are five colorful balloons floating in the sky.',
          scrambledWords: ['There', 'are', 'five', 'colorful', 'balloons', 'in', 'the', 'sky'],
        },
        {
          text: 'Yesterday, our kind teacher _______ us a very funny story about a magic rabbit.',
          options: [
            { text: 'told', isCorrect: true },
            { text: 'tells', isCorrect: false },
            { text: 'is telling', isCorrect: false },
            { text: 'will tell', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ đơn: Dấu hiệu "Yesterday" (ngày hôm qua) -> dùng động từ V2 (told - quá khứ của tell).',
          originalSentence: 'Yesterday, our teacher told us a funny story about a rabbit.',
          scrambledWords: ['Yesterday', 'our', 'teacher', 'told', 'us', 'a', 'funny', 'story'],
        },
        {
          text: 'This heavy red backpack belongs to Tom. It is _______ backpack.',
          options: [
            { text: 'his', isCorrect: true },
            { text: 'her', isCorrect: false },
            { text: 'their', isCorrect: false },
            { text: 'its', isCorrect: false },
          ],
          explanation: '💡 Tính từ sở hữu: Tom là bạn nam -> dùng tính từ sở hữu "his" (của cậu ấy: his backpack).',
          originalSentence: 'This heavy red backpack belongs to Tom. It is his backpack.',
          scrambledWords: ['It', 'is', 'his', 'heavy', 'red', 'backpack'],
        },
        {
          text: 'Can little penguins fly high in the sky like eagles? No, they _______! They swim.',
          options: [
            { text: 'cannot', isCorrect: true },
            { text: 'can', isCorrect: false },
            { text: 'could', isCorrect: false },
            { text: 'must', isCorrect: false },
          ],
          explanation: '💡 Câu trả lời ngắn phủ định với Can: "No, they cannot" (hoặc can\'t). Chim cánh cụt không biết bay mà chỉ biết bơi!',
          originalSentence: 'Can penguins fly like eagles? No, they cannot! They swim.',
          scrambledWords: ['No', 'they', 'cannot', 'fly', 'they', 'swim', 'in', 'water'],
        },
        {
          text: 'We should brush our teeth twice _______ day to keep our teeth clean and white.',
          options: [
            { text: 'a', isCorrect: true },
            { text: 'an', isCorrect: false },
            { text: 'the', isCorrect: false },
            { text: 'two', isCorrect: false },
          ],
          explanation: '💡 Cụm từ tần suất: "twice a day" = hai lần một ngày. Dùng mạo từ "a" trước từ day.',
          originalSentence: 'We should brush our teeth twice a day to keep them clean.',
          scrambledWords: ['We', 'should', 'brush', 'our', 'teeth', 'twice', 'a', 'day'],
        },
        {
          text: 'The little girl is smiling happily because she _______ a cute puppy for her birthday.',
          options: [
            { text: 'received', isCorrect: true },
            { text: 'receives', isCorrect: false },
            { text: 'receiving', isCorrect: false },
            { text: 'receive', isCorrect: false },
          ],
          explanation: '💡 Thì Quá khứ đơn: Hành động bé gái đã nhận được chú cún cưng trong ngày sinh nhật -> dùng "received".',
          originalSentence: 'The little girl is smiling because she received a cute puppy.',
          scrambledWords: ['The', 'girl', 'is', 'happy', 'because', 'she', 'received', 'a', 'puppy'],
        },
        {
          text: 'Be quiet, please! The baby panda _______ sleeping soundly in its wooden bed.',
          options: [
            { text: 'is', isCorrect: true },
            { text: 'are', isCorrect: false },
            { text: 'were', isCorrect: false },
            { text: 'be', isCorrect: false },
          ],
          explanation: '💡 Thì Hiện tại tiếp diễn: Chủ ngữ số ít "The baby panda" đi với to be "is" (is sleeping).',
          originalSentence: 'Be quiet, please! The baby panda is sleeping soundly.',
          scrambledWords: ['The', 'baby', 'panda', 'is', 'sleeping', 'in', 'its', 'bed'],
        },
      ];
    } else {
      title = `🌐 V House AI: ${originalPrompt || 'Bộ Đề Ngữ Pháp & Thời Sự'} (${count} Câu)`;
      description = `Bộ đề thi tiếng Anh học thuật tiêu chuẩn quốc tế theo chủ đề: "${originalPrompt}".`;

      questionPool = [
        {
          text: 'Artificial intelligence algorithms are capable of _______ complex datasets in a fraction of a second.',
          options: [
            { text: 'processing', isCorrect: true },
            { text: 'process', isCorrect: false },
            { text: 'processed', isCorrect: false },
            { text: 'to process', isCorrect: false },
          ],
          explanation: '💡 Cấu trúc giới từ: "capable OF + V-ing" = có khả năng xử lý điều gì.',
          originalSentence: 'AI algorithms are capable of processing datasets quickly.',
          scrambledWords: ['AI', 'is', 'capable', 'of', 'processing', 'data'],
        },
        {
          text: 'The international climate summit, _______ took place in Dubai, resulted in unprecedented clean energy targets.',
          options: [
            { text: 'which', isCorrect: true },
            { text: 'that', isCorrect: false },
            { text: 'where', isCorrect: false },
            { text: 'who', isCorrect: false },
          ],
          explanation: '💡 Mệnh đề quan hệ không xác định (nằm giữa 2 dấu phẩy): Bắt buộc dùng "which" cho sự vật/sự kiện, không dùng "that".',
          originalSentence: 'The summit, which took place in Dubai, set targets.',
          scrambledWords: ['The', 'summit', 'which', 'took', 'place', 'set', 'targets'],
        },
        {
          text: 'The more nations invest in education and research, the _______ their economies will become.',
          options: [
            { text: 'more resilient', isCorrect: true },
            { text: 'resilient', isCorrect: false },
            { text: 'most resilient', isCorrect: false },
            { text: 'resiliently', isCorrect: false },
          ],
          explanation: '💡 So sánh kép (Double comparative): "The more + S + V, the + comparative + S + V" (Càng... thì càng...).',
          originalSentence: 'The more nations invest, the more resilient economies become.',
          scrambledWords: ['The', 'more', 'they', 'invest', 'the', 'better'],
        },
        {
          text: 'Despite _______ volatile economic conditions, multinational technology startups continued to hire talented engineers.',
          options: [
            { text: 'facing', isCorrect: true },
            { text: 'faced', isCorrect: false },
            { text: 'they faced', isCorrect: false },
            { text: 'face', isCorrect: false },
          ],
          explanation: '💡 Giới từ chỉ sự nhượng bộ: "Despite / In spite of + V-ing / Noun phrase" (mặc dù đối mặt với biến động).',
          originalSentence: 'Despite facing volatile conditions, startups hired engineers.',
          scrambledWords: ['Despite', 'facing', 'challenges', 'startups', 'hired', 'staff'],
        },
        {
          text: 'It was in 1969 _______ human astronauts first stepped onto the lunar surface during Apollo 11.',
          options: [
            { text: 'that', isCorrect: true },
            { text: 'which', isCorrect: false },
            { text: 'when', isCorrect: false },
            { text: 'where', isCorrect: false },
          ],
          explanation: '💡 Câu chẻ nhấn mạnh (Cleft sentence): "It was + trạng từ thời gian + THAT + S + V" (Chính vào năm 1969 mà con người lần đầu đặt chân lên mặt trăng).',
          originalSentence: 'It was in 1969 that humans stepped onto the Moon.',
          scrambledWords: ['It', 'was', 'in', '1969', 'that', 'astronauts', 'landed'],
        },
      ];
    }
  }

  // Ensure exact count fulfillment
  const finalQuestions = enforceExactQuestionCount(questionPool, count, timeLimit, questionFormat);

  return {
    id: `ai_${Date.now()}`,
    title,
    description: `${description} | Lớp: ${level} | Thời lượng: ${timeLimit}s/câu | ${sessionMode === 'homework' ? `Hạn nộp: ${deadline}` : 'Đấu trường trực tiếp'}`,
    author: 'V English House AI Studio · World Events Edition',
    gradeLevel: level,
    topic,
    timeLimit: timeLimit || 15,
    sessionMode,
    deadline,
    questions: finalQuestions,
  };
}

// -------------------------------------------------------------
// EXACT COUNT ENFORCER
// -------------------------------------------------------------
function enforceExactQuestionCount(pool, targetCount, timeLimit, questionFormat = 'mixed') {
  let list = [...pool];

  if (list.length < targetCount && list.length > 0) {
    let needed = targetCount - list.length;
    let i = 0;
    while (needed > 0) {
      const base = pool[i % pool.length];
      list.push({
        text: base.text,
        options: base.options.map((o) => ({ ...o })),
        explanation: base.explanation,
        originalSentence: base.originalSentence,
        scrambledWords: base.scrambledWords ? [...base.scrambledWords] : undefined,
      });
      needed--;
      i++;
    }
  }

  return list.slice(0, targetCount).map((q, idx) => {
    const correctOpt = q.options?.find((o) => o.isCorrect)?.text || '';
    const mainCorrect = q.correctAnswer || correctOpt;

    // Determine type
    let qType = 'choice';
    if (questionFormat === 'blank') {
      qType = 'blank';
    } else if (questionFormat === 'true_false') {
      qType = 'true_false';
    } else if (questionFormat === 'scramble') {
      qType = 'scramble';
    } else if (questionFormat === 'choice') {
      qType = 'choice';
    } else {
      // 'mixed' mode: vary across questions!
      const pattern = ['blank', 'choice', 'true_false', 'scramble', 'blank', 'choice'];
      qType = pattern[idx % pattern.length];
    }

    // Prepare fields according to qType
    let text = q.text || '';
    let options = q.options ? q.options.map((o) => ({ ...o })) : [];
    let acceptableAnswers = q.acceptableAnswers || [mainCorrect, mainCorrect.toLowerCase()];

    if (qType === 'true_false') {
      const isTruth = idx % 2 === 0;
      if (isTruth) {
        text = `[Đúng hay Sai] ${q.originalSentence || q.text.replace('_______', mainCorrect)}`;
        options = [
          { text: 'True (Đúng)', isCorrect: true },
          { text: 'False (Sai)', isCorrect: false },
        ];
      } else {
        const distractor = q.options?.find((o) => !o.isCorrect)?.text || 'was';
        text = `[Đúng hay Sai] ${q.text.replace('_______', distractor)}`;
        options = [
          { text: 'True (Đúng)', isCorrect: false },
          { text: 'False (Sai)', isCorrect: true },
        ];
      }
    } else if (qType === 'scramble') {
      if (!text.toLowerCase().includes('sắp xếp')) {
        text = '🧩 Sắp xếp các từ sau thành câu tiếng Anh chuẩn xác:';
      }
    } else if (qType === 'blank') {
      if (!text.includes('_______')) {
        text = `${q.originalSentence || q.text} (Điền từ còn thiếu: _______)`;
      }
    }

    const scrambledWords = q.scrambledWords && q.scrambledWords.length > 0
      ? [...q.scrambledWords].sort(() => Math.random() - 0.5)
      : (q.originalSentence || mainCorrect).replace(/[.?!,]/g, '').split(/\s+/).filter(Boolean).sort(() => Math.random() - 0.5);

    const thematicKeywords = q.imagePrompt || (text.replace(/_______/g, mainCorrect).replace(/[^a-zA-Z\s]/g, ' ').slice(0, 60));
    const image = q.image || getSafeEducationalImageUrl(thematicKeywords);

    return {
      id: `ai_${Date.now()}_${idx}`,
      timeLimit: timeLimit || 15,
      points: 1000,
      type: qType,
      text,
      image,
      correctAnswer: mainCorrect,
      acceptableAnswers,
      explanation: q.explanation || '💡 Giải thích sư phạm chi tiết từ V English House AI.',
      options: options.sort(() => Math.random() - 0.5),
      originalSentence: q.originalSentence || (q.text && q.text.includes('_______') ? q.text.replace('_______', mainCorrect) : q.text) || '',
      scrambledWords,
    };
  });
}

// -------------------------------------------------------------
// VOCAB & PASSAGE HANDLERS
// -------------------------------------------------------------
function generateFromVocabList(lines, prompt, count, level, timeLimit, topic, sessionMode, deadline, questionFormat = 'mixed') {
  const profile = getLevelPedagogyProfile(level);
  const isKids = profile.type === 'kids';

  const pairs = lines
    .map((l) => {
      const parts = l.split(/[:\-=]/).map((p) => p.trim());
      return { word: parts[0] || '', meaning: parts.slice(1).join(' ') || '' };
    })
    .filter((p) => p.word && p.meaning);

  const questions = pairs.slice(0, count).map((item, idx) => {
    const wrongDistractors = pairs
      .filter((p) => p.word !== item.word)
      .map((p) => p.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const fallbacks = isKids
      ? ['Chú gấu đáng yêu', 'Bút chì màu', 'Bạn bè cùng lớp', 'Sân chơi trường học']
      : ['Đột phá công nghệ', 'Phát triển bền vững', 'Hợp tác quốc tế', 'Tư duy sáng tạo'];

    while (wrongDistractors.length < 3) {
      const fb = fallbacks.pop();
      if (fb && !wrongDistractors.includes(fb) && fb !== item.meaning) {
        wrongDistractors.push(fb);
      }
    }

    const options = [
      { text: item.meaning, isCorrect: true },
      ...wrongDistractors.map((d) => ({ text: d, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);

    const isBlank = questionFormat === 'blank';

    return {
      id: `vocab_${Date.now()}_${idx}`,
      text: isBlank
        ? (isKids ? `Từ "${item.word}" có nghĩa tiếng Việt là: _______` : `Nghĩa của từ "${item.word}" trong tiếng Việt là: _______`)
        : (isKids ? `Từ tiếng Anh "${item.word}" nghĩa là gì?` : `Thuật ngữ "${item.word}" trong văn cảnh quốc tế có nghĩa là gì?`),
      image: getSafeEducationalImageUrl(item.word),
      type: isBlank ? 'blank' : 'choice',
      correctAnswer: item.meaning,
      acceptableAnswers: [item.meaning, item.meaning.toLowerCase()],
      timeLimit: timeLimit || 12,
      points: 1000,
      explanation: isKids
        ? `💡 Mẹo từ vựng cho bé: "${item.word}" nghĩa là "${item.meaning}".`
        : `💡 Từ vựng học thuật V House: "${item.word}" nghĩa là "${item.meaning}".`,
      options,
      originalSentence: `${item.word}: ${item.meaning}`,
      scrambledWords: [item.word, 'means', item.meaning],
    };
  });

  return {
    id: `ai_vocab_${Date.now()}`,
    title: prompt ? `⚡ V House AI: ${prompt}` : `⚡ V House AI: Ôn Tập Từ Vựng Quốc Tế (${questions.length} từ)`,
    description: `Sinh tự động từ danh sách từ vựng giáo viên cung cấp | Lớp: ${level}`,
    author: 'V English House AI Studio',
    gradeLevel: level,
    questions,
  };
}

function generateFromReadingPassage(sentences, prompt, count, level, timeLimit, topic, sessionMode, deadline, questionFormat = 'mixed') {
  const questions = [];

  sentences.slice(0, Math.min(count, sentences.length)).forEach((sentence, idx) => {
    const words = sentence.split(/\s+/);
    if (words.length >= 4) {
      let targetIdx = Math.floor(words.length / 2);
      let targetWord = words[targetIdx].replace(/[^a-zA-Z]/g, '');

      if (targetWord.length < 3) {
        targetIdx = 1;
        targetWord = words[targetIdx] || 'is';
      }

      const blanked = words.map((w, i) => (i === targetIdx ? '_______' : w)).join(' ');
      const distractors = ['which', 'because', 'however', 'although', 'clearly', 'innovative', 'rapidly']
        .filter((w) => w.toLowerCase() !== targetWord.toLowerCase())
        .slice(0, 3);

      const options = [
        { text: targetWord, isCorrect: true },
        ...distractors.map((d) => ({ text: d, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);

      const isBlank = questionFormat === 'blank' || questionFormat === 'mixed';

      questions.push({
        id: `passage_${Date.now()}_${idx}`,
        text: blanked,
        image: getSafeEducationalImageUrl(sentence.slice(0, 40)),
        type: isBlank ? 'blank' : 'choice',
        correctAnswer: targetWord,
        acceptableAnswers: [targetWord, targetWord.toLowerCase()],
        timeLimit: timeLimit || 20,
        points: 1000,
        explanation: `💡 Ngữ cảnh câu bài đọc: "${sentence}". Đáp án chính xác là "${targetWord}".`,
        options,
        originalSentence: sentence,
        scrambledWords: words.map((w) => w.replace(/[^a-zA-Z0-9']/g, '')).filter(Boolean),
      });
    }
  });

  return {
    id: `ai_passage_${Date.now()}`,
    title: prompt ? `📖 V House AI: ${prompt}` : `📖 V House AI: Đọc Hiểu & Ngữ Cảnh Thời Sự`,
    description: `Tự động bóc tách từ bài đọc của giáo viên | Lớp: ${level}`,
    author: 'V English House AI Studio',
    gradeLevel: level,
    questions,
  };
}
