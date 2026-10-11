// ============================================================================
// V ENGLISH HOUSE - OFFICIAL CURRICULUM, PEDAGOGY & KNOWLEDGE BASE
// ============================================================================
// Platform knowledge repository tailored specifically to V English House:
// 1. Class Profiles (A01 Kids, B01 Pre-IELTS, B02 Foundation, C01 IELTS, Workplace)
// 2. Teaching Style & Gamification (4 Houses: LEADER, FIGHTER, DWELLER, B1)
// 3. Built-in Curriculum Lessons & Units (Vocab, Grammar, Reading, Exercises)
// 4. Custom Unit Management (Teachers can add/edit/save units)

export const VHOUSE_CLASS_PROFILES = {
  'A01': {
    id: 'A01',
    name: 'Lớp A01 (Kids Primary)',
    ageGroup: '6 - 10 tuổi (Học sinh Tiểu học)',
    cefr: 'Pre-A1 to A1 (Cambridge Starters, Movers, Flyers)',
    houseEmphasis: 'Khuyến khích tối đa nỗ lực cá nhân, tích lũy huy hiệu Nhà (LEADER, FIGHTER, DWELLER, B1)',
    teachingPhilosophy: [
      'Gamification tương tác cao: Học qua hình ảnh, con vật và nhân vật hoạt hình.',
      'Khen ngợi nỗ lực: Lời giải thích vui tươi, khuyến khích thay vì bắt lỗi.',
      'Câu ngắn gọn (5-9 từ): Không dùng cấu trúc phức hay từ ngữ trừu tượng.',
      'Vốn từ cụ thể: Động vật, đồ chơi, siêu nhân, robot, gia đình, trường học, thức ăn.',
      'Tuyệt đối không dùng thuật ngữ hàn lâm người lớn (mitigate, sustainable, geopolitical...).'
    ],
    defaultTimePerQuestion: 15,
  },
  'B01': {
    id: 'B01',
    name: 'Lớp B01 (Pre-IELTS)',
    ageGroup: '11 - 15 tuổi (Học sinh THCS)',
    cefr: 'A2 to B1 (Foundation Pre-IELTS)',
    houseEmphasis: 'Thi đua tốc độ & độ chính xác giữa 4 Nhà, xếp hạng Power-Up',
    teachingPhilosophy: [
      'Bám sát giáo trình Family & Friends, Solutions và Destination B1.',
      'Phát triển tư duy logic và nhận diện dấu hiệu ngữ pháp (Signal words).',
      'Độ dài câu trung cấp (10-18 từ) với ngữ cảnh trường học, khoa học, thể thao, môi trường.',
      'Giải thích công thức rõ ràng, chỉ dẫn mẹo làm bài chuẩn đề thi.'
    ],
    defaultTimePerQuestion: 15,
  },
  'B02': {
    id: 'B02',
    name: 'Lớp B02 (Foundation)',
    ageGroup: '13 - 16 tuổi (THCS & Mới vào THPT)',
    cefr: 'B1 (Intermediate General English)',
    houseEmphasis: 'Tập trung phản xạ ngữ pháp và mở rộng vốn từ vựng học thuật cơ bản',
    teachingPhilosophy: [
      'Củng cố nền tảng 12 thì, mệnh đề quan hệ, câu điều kiện, câu bị động.',
      'Đọc hiểu văn bản tin tức khoa học đời sống và công nghệ số.',
      'Phát triển kỹ năng suy luận từ vựng theo ngữ cảnh.'
    ],
    defaultTimePerQuestion: 20,
  },
  'C01': {
    id: 'C01',
    name: 'Lớp C01 (IELTS Intensive)',
    ageGroup: '16+ tuổi (Học sinh THPT & Sinh viên)',
    cefr: 'B2 to C1+ (Advanced Academic)',
    houseEmphasis: 'Đấu trường học thuật đỉnh cao, phân hóa điểm số qua các bẫy ngữ pháp',
    teachingPhilosophy: [
      'Bám sát đề thi Cambridge IELTS 15-19 và tạp chí khoa học quốc tế.',
      'Câu phức hợp học thuật (18-28 từ): Inversion, Cleft sentences, Subjunctive mood.',
      'Phân tích collocations học thuật, sắc thái từ vựng và bẫy đề thi chuyên sâu.',
      'Giải thích sư phạm phân tích gốc từ và cấu trúc ngữ pháp nâng cao.'
    ],
    defaultTimePerQuestion: 20,
  },
  'WORKPLACE': {
    id: 'WORKPLACE',
    name: 'Lớp Giao Tiếp Người Đi Làm',
    ageGroup: 'Người đi làm / Nhân viên văn phòng',
    cefr: 'B1 to B2 (Business & Workplace Communication)',
    houseEmphasis: 'Ứng dụng thực chiến ngay vào công việc hàng ngày',
    teachingPhilosophy: [
      'Tiếng Anh công sở thực chiến: Gửi email, họp hành, thuyết trình, đàm phán hợp đồng.',
      'Văn phong lịch sự (Polite conventions), ngôn ngữ ngoại giao và giải quyết tình huống.',
      'Thực hành phản xạ nhanh, phát âm chuẩn quốc tế để tự tin làm việc với đối tác.'
    ],
    defaultTimePerQuestion: 15,
  }
};

// ============================================================================
// BUILT-IN V ENGLISH HOUSE CURRICULUM UNITS (GIÁO TRÌNH CHUẨN NỘI BỘ)
// ============================================================================
export const DEFAULT_VHOUSE_UNITS = [
  // --------------------------------------------------------------------------
  // LỚP A01: KIDS PRIMARY (6-10T)
  // --------------------------------------------------------------------------
  {
    id: 'unit_a01_1',
    classId: 'A01',
    className: 'Lớp A01 (Kids Primary)',
    unitNumber: 'Unit 1',
    title: '🐼 The Magic Zoo (Sở Thú Kỳ Thú & Động Vật)',
    theme: 'Động vật hoang dã & Thói quen hàng ngày',
    level: 'Pre-A1 / Starters',
    targetVocab: ['giant panda', 'baby monkey', 'cute puppy', 'little kitten', 'brave lion', 'friendly elephant', 'fresh bamboo'],
    grammarFocus: 'Hiện tại đơn (S + V-s/es) & Hiện tại tiếp diễn (Look! S + is/are V-ing)',
    sentenceLength: '5 - 8 từ / câu',
    sampleSentence: 'Every morning, the cute giant panda at the zoo eats fresh green bamboo.',
    recommendedFormat: 'mixed',
    description: 'Học sinh làm quen với các con vật đáng yêu, phân biệt thì hiện tại đơn chỉ thói quen và hiện tại tiếp diễn với dấu hiệu Look!'
  },
  {
    id: 'unit_a01_2',
    classId: 'A01',
    className: 'Lớp A01 (Kids Primary)',
    unitNumber: 'Unit 2',
    title: '🦸 Superhero Academy (Học Viện Siêu Nhân & Ước Mơ)',
    theme: 'Siêu anh hùng, phép thuật & tình bạn hòa bình',
    level: 'Pre-A1 / Movers',
    targetVocab: ['superhero', 'magic wand', 'cheerful birds', 'playground', 'peaceful', 'flying rocket', 'time machine'],
    grammarFocus: 'Câu điều kiện loại 2 giả định siêu nhân: If I were a superhero, I would fly...',
    sentenceLength: '6 - 9 từ / câu',
    sampleSentence: 'If I were a brave superhero, I would fly across the blue sky to help people.',
    recommendedFormat: 'choice',
    description: 'Thực hành câu điều kiện loại 2 vui nhộn: To be chia were cho mọi ngôi, động từ vế chính dùng would + V-bare.'
  },
  {
    id: 'unit_a01_3',
    classId: 'A01',
    className: 'Lớp A01 (Kids Primary)',
    unitNumber: 'Unit 3',
    title: '🗣️ Phonics Party (Lễ Hội Phát Âm & Ký Hiệu IPA Cho Bé)',
    theme: 'Quy tắc phát âm đuôi -ed, đuôi -s/es, âm th và chữ cái câm',
    level: 'Phonics & Basic IPA',
    targetVocab: ['wanted', 'played', 'watches', 'sheep vs ship', 'three vs tree', 'knee (k câm)', 'write (w câm)'],
    grammarFocus: 'Nhận diện phát âm chuẩn IPA: /ɪd/ vs /d/, /ɪz/ vs /s/, nguyên âm dài /i:/',
    sentenceLength: 'Câu đố phát âm ngắn',
    sampleSentence: 'Từ "wanted" có đuôi -ed phát âm là /ɪd/, còn "played" phát âm là /d/.',
    recommendedFormat: 'choice',
    description: 'Bé luyện phản xạ phát âm chuẩn quốc tế qua các từ vựng thân thuộc, nhận diện mẹo nhớ âm nhanh.'
  },
  {
    id: 'unit_a01_4',
    classId: 'A01',
    className: 'Lớp A01 (Kids Primary)',
    unitNumber: 'Unit 4',
    title: '🏫 Happy School & Sharing Toys (Trường Học Thân Yêu & Chia Sẻ Đồ Chơi)',
    theme: 'Đồ dùng học tập, hòa đồng bạn bè & chống bắt nạt',
    level: 'A1 / Flyers',
    targetVocab: ['yellow pencil', 'heavy backpack', 'lego castle', 'peace club', 'sharing toys', 'friendship card'],
    grammarFocus: 'Tính từ sở hữu (his, her, our) & Thì Quá khứ đơn (Yesterday we made cards...)',
    sentenceLength: '6 - 9 từ / câu',
    sampleSentence: 'If all children shared their toys together, the playground would always be peaceful.',
    recommendedFormat: 'blank',
    description: 'Giáo dục kỹ năng chia sẻ, không tranh giành đồ chơi và xây dựng tình bạn gắn kết trong lớp học.'
  },

  // --------------------------------------------------------------------------
  // LỚP B01: PRE-IELTS (11-15T)
  // --------------------------------------------------------------------------
  {
    id: 'unit_b01_1',
    classId: 'B01',
    className: 'Lớp B01 (Pre-IELTS)',
    unitNumber: 'Unit 1',
    title: '🌍 12 Tenses & Modern World Events (12 Thì Tiếng Anh & Thời Sự)',
    theme: 'Công nghệ, Kính thiên văn James Webb, Olympic & Năng lượng xanh',
    level: 'A2 - B1',
    targetVocab: ['transmits', 'autonomous taxis', 'climate summit', 'solar energy', 'monitoring', 'achieved'],
    grammarFocus: 'Khảo sát toàn diện 12 thì tiếng Anh bám sát dấu hiệu nhận biết (since, by 2030, at 8 PM)',
    sentenceLength: '12 - 16 từ / câu',
    sampleSentence: 'Global investment in electric vehicles has grown by over 40% since the 2023 climate summit.',
    recommendedFormat: 'mixed',
    description: 'Khảo sát 12 thì qua các sự kiện khoa học và môi trường thời sự, giúp học sinh nắm vững công thức chia động từ.'
  },
  {
    id: 'unit_b01_2',
    classId: 'B01',
    className: 'Lớp B01 (Pre-IELTS)',
    unitNumber: 'Unit 2',
    title: '🕊️ Second Conditional & Global Diplomacy (ĐK Loại 2 & Hòa Bình)',
    theme: 'Ngoại giao quốc tế, hiệp định đình chiến và viện trợ nhân đạo',
    level: 'B1 Pre-IELTS',
    targetVocab: ['diplomatic dialogue', 'ceasefire order', 'humanitarian convoys', 'refugees', 'consensus'],
    grammarFocus: 'If + Past Simple, S + would/could + V-bare & Đảo ngữ loại 2 (Were + S + to V...)',
    sentenceLength: '12 - 18 từ / câu',
    sampleSentence: 'If nations prioritized diplomatic dialogues instead of escalation, civilian lives would be saved.',
    recommendedFormat: 'blank',
    description: 'Rèn luyện câu điều kiện loại 2 chuyên sâu kết hợp điền từ vào chỗ trống, chuẩn bị kiến thức nền cho IELTS Writing Task 2.'
  },
  {
    id: 'unit_b01_3',
    classId: 'B01',
    className: 'Lớp B01 (Pre-IELTS)',
    unitNumber: 'Unit 3',
    title: '🗣️ Advanced Phonetics & Word Stress (IPA & Trọng Âm Nâng Cao)',
    theme: 'Quy tắc trọng âm từ 2-3 âm tiết, cặp nguyên âm đôi và âm câm',
    level: 'B1 Phonetics',
    targetVocab: ['environment', 'technology', 'diplomat', 'economic', 'decided vs stopped', 'sugar /ʃ/'],
    grammarFocus: 'Trọng âm từ có đuôi -ic, -tion, -ity; Phân biệt phụ âm /θ/ vs /ð/, /s/ vs /ʃ/',
    sentenceLength: 'Câu hỏi trắc nghiệm ngữ âm',
    sampleSentence: 'The word "technology" has the main stress on the second syllable: tech-NOL-o-gy.',
    recommendedFormat: 'choice',
    description: 'Nâng cao điểm số phần phát âm và trọng âm trong các kỳ thi học sinh giỏi và kỳ thi vào lớp 10.'
  },

  // --------------------------------------------------------------------------
  // LỚP C01: IELTS INTENSIVE (16+T)
  // --------------------------------------------------------------------------
  {
    id: 'unit_c01_1',
    classId: 'C01',
    className: 'Lớp C01 (IELTS Intensive)',
    unitNumber: 'Unit 1',
    title: '⚡ Inversion & High-Scoring Grammar (Đảo Ngữ Chuyên Sâu C1)',
    theme: 'Đảo ngữ trạng từ phủ định, No sooner... than, Hardly, Under no circumstances',
    level: 'B2 - C1+',
    targetVocab: ['exponential advancements', 'artificial intelligence', 'mitigate', 'autonomous weapons', 'unprecedented'],
    grammarFocus: 'Never before / Hardly / Only by + Aux + S + V',
    sentenceLength: '18 - 25 từ / câu',
    sampleSentence: 'Never before has humanity witnessed such exponential advancements in artificial intelligence.',
    recommendedFormat: 'choice',
    description: 'Nâng cấp band điểm ngữ pháp Grammar Range & Accuracy (GRA) lên 7.0 - 8.0 trong bài thi IELTS.'
  },
  {
    id: 'unit_c01_2',
    classId: 'C01',
    className: 'Lớp C01 (IELTS Intensive)',
    unitNumber: 'Unit 2',
    title: '🤖 Artificial Intelligence & Ethical Governance (AI & Đạo Đức Công Nghệ)',
    theme: 'Generative AI, Large Language Models, Quantum Computing & Thuật toán',
    level: 'C1 Academic',
    targetVocab: ['ethical legal rights', 'cryptographic encryption', 'algorithm auditing', 'quantum computers'],
    grammarFocus: 'Thức giả định (Subjunctive), Câu điều kiện hỗn hợp (Mixed conditionals)',
    sentenceLength: '18 - 26 từ / câu',
    sampleSentence: 'Were software engineers to solve AGI safely, humanity could achieve unimaginable scientific breakthroughs.',
    recommendedFormat: 'mixed',
    description: 'Trang bị vốn từ vựng học thuật C1 cho chủ đề Science & Technology trong IELTS Writing và Speaking.'
  },

  // --------------------------------------------------------------------------
  // LỚP GIAO TIẾP NGƯỜI ĐI LÀM
  // --------------------------------------------------------------------------
  {
    id: 'unit_wp_1',
    classId: 'WORKPLACE',
    className: 'Lớp Giao Tiếp Người Đi Làm',
    unitNumber: 'Unit 1',
    title: '💼 Professional Emailing & Status Updates (Email Công Sở & Báo Cáo Tiến Độ)',
    theme: 'Viết email trang trọng, cập nhật tiến độ dự án và xử lý phát sinh với đối tác',
    level: 'B1 - B2 Workplace',
    targetVocab: ['follow up on', 'project deadline', 'streamline communication', 'schedule a call', 'as per our agreement'],
    grammarFocus: 'Câu đề nghị lịch sự (Could you please... / Would you mind...), Hiện tại hoàn thành',
    sentenceLength: '12 - 18 từ / câu',
    sampleSentence: 'Could you please confirm if the revised project schedule aligns with your team\'s timeline?',
    recommendedFormat: 'mixed',
    description: 'Thực hành phản xạ viết email và trao đổi công việc chuyên nghiệp, giúp học viên tự tin làm việc tại các công ty đa quốc gia.'
  },
  {
    id: 'unit_wp_2',
    classId: 'WORKPLACE',
    className: 'Lớp Giao Tiếp Người Đi Làm',
    unitNumber: 'Unit 2',
    title: '🤝 Client Pitching & Negotiation (Thuyết Trình Ý Tưởng & Đàm Phán)',
    theme: 'Họp hội nghị trực tuyến, đàm phán hợp đồng và bảo vệ quan điểm',
    level: 'B2 Business',
    targetVocab: ['value proposition', 'mutual benefit', 'reach an agreement', 'flexible terms', 'stakeholders'],
    grammarFocus: 'Modal verbs (might, would, should) để diễn đạt quan điểm ngoại giao mềm mỏng',
    sentenceLength: '12 - 20 từ / câu',
    sampleSentence: 'If your company approved the revised proposal, we could launch the joint campaign next Monday.',
    recommendedFormat: 'choice',
    description: 'Nâng cao khả năng diễn đạt logic và phong thái chuyên nghiệp trong các buổi họp với khách hàng quốc tế.'
  }
];

// ============================================================================
// LOCAL STORAGE PERSISTENCE HELPERS
// ============================================================================
const STORAGE_KEY = 'vhouse_curriculum_units_v1';

export function getStoredCurriculumUnits() {
  if (typeof window === 'undefined') return DEFAULT_VHOUSE_UNITS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VHOUSE_UNITS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VHOUSE_UNITS;
  } catch (err) {
    console.error('Error loading stored curriculum units:', err);
    return DEFAULT_VHOUSE_UNITS;
  }
}

export function saveCurriculumUnit(newOrUpdatedUnit) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredCurriculumUnits();
    const idx = existing.findIndex((u) => u.id === newOrUpdatedUnit.id);
    let updated;
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = newOrUpdatedUnit;
    } else {
      updated = [newOrUpdatedUnit, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving curriculum unit:', err);
    return null;
  }
}

export function deleteCurriculumUnit(unitId) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredCurriculumUnits();
    const filtered = existing.filter((u) => u.id !== unitId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Error deleting curriculum unit:', err);
    return null;
  }
}

export function resetCurriculumToDefault() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_VHOUSE_UNITS;
}
