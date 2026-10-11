import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Trash2, Copy, Check, Volume2, Clock, Award,
  Sparkles, Save, Layers, BookOpen, AlertCircle, HelpCircle,
  CheckCircle2, Image as ImageIcon, Wand2, Upload, RefreshCw, Link as LinkIcon
} from 'lucide-react';
import { KAHOOT_COLORS } from '../data/defaultQuizzes';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import { getSafeEducationalImageUrl } from '../utils/imageHelper';

export default function QuizEditorModal({ isOpen, onClose, onSaveQuiz, quizToEdit = null }) {
  const [title, setTitle] = useState('');
  const [targetClass, setTargetClass] = useState('Lớp B01 (Pre-IELTS)');
  const [skillTopic, setSkillTopic] = useState('Ngữ pháp (Grammar)');
  const [defaultTime, setDefaultTime] = useState(15);
  const [sessionMode, setSessionMode] = useState('live');
  const [activeIdx, setActiveIdx] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const fileInputRef = useRef(null);

  const [questions, setQuestions] = useState([
    {
      id: `q_${Date.now()}_0`,
      text: '',
      image: '',
      timeLimit: 15,
      points: 1000,
      type: 'choice',
      correctAnswer: '',
      acceptableAnswers: [],
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      explanation: '',
      originalSentence: '',
      scrambledWords: [],
    },
  ]);

  // Load quizToEdit when modal opens or quizToEdit changes
  useEffect(() => {
    if (quizToEdit) {
      setTitle(quizToEdit.title || '');
      setTargetClass(quizToEdit.gradeLevel || 'Lớp B01 (Pre-IELTS)');
      setSkillTopic(quizToEdit.topic || 'Ngữ pháp (Grammar)');
      setDefaultTime(quizToEdit.timeLimit || 15);
      setSessionMode(quizToEdit.sessionMode || 'live');
      if (Array.isArray(quizToEdit.questions) && quizToEdit.questions.length > 0) {
        setQuestions(
          quizToEdit.questions.map((q, idx) => ({
            id: q.id || `q_${Date.now()}_${idx}`,
            text: q.text || '',
            image: q.image || '',
            timeLimit: q.timeLimit || quizToEdit.timeLimit || 15,
            points: q.points || 1000,
            type: q.type || 'choice',
            correctAnswer: q.correctAnswer || q.options?.find((o) => o.isCorrect)?.text || '',
            acceptableAnswers: q.acceptableAnswers || [],
            options: (q.options && q.options.length > 0)
              ? q.options.map((o) => ({ text: String(o.text || ''), isCorrect: Boolean(o.isCorrect) }))
              : [
                  { text: '', isCorrect: true },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                ],
            explanation: q.explanation || '',
            originalSentence: q.originalSentence || '',
            scrambledWords: q.scrambledWords || [],
          }))
        );
      }
      setActiveIdx(0);
    } else {
      setTitle('');
      setQuestions([
        {
          id: `q_${Date.now()}_0`,
          text: '',
          image: '',
          timeLimit: 15,
          points: 1000,
          type: 'choice',
          correctAnswer: '',
          acceptableAnswers: [],
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
          explanation: '',
          originalSentence: '',
          scrambledWords: [],
        },
      ]);
      setActiveIdx(0);
    }
  }, [quizToEdit, isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[activeIdx] || questions[0];

  const handleAddQuestion = () => {
    sound.playClick();
    const newQ = {
      id: `q_${Date.now()}_${questions.length}`,
      text: '',
      image: '',
      timeLimit: defaultTime,
      points: 1000,
      type: 'choice',
      correctAnswer: '',
      acceptableAnswers: [],
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      explanation: '',
      originalSentence: '',
      scrambledWords: [],
    };
    setQuestions([...questions, newQ]);
    setActiveIdx(questions.length);
  };

  const handleDuplicateQuestion = (idx, e) => {
    e.stopPropagation();
    sound.playClick();
    const target = questions[idx];
    const duplicated = {
      ...target,
      id: `q_${Date.now()}_dup`,
      text: target.text ? `${target.text} (Bản sao)` : '',
      options: target.options.map((o) => ({ ...o })),
    };
    const updated = [...questions];
    updated.splice(idx + 1, 0, duplicated);
    setQuestions(updated);
    setActiveIdx(idx + 1);
  };

  const handleRemoveQuestion = (idx, e) => {
    e.stopPropagation();
    if (questions.length <= 1) return;
    sound.playClick();
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
    if (activeIdx >= updated.length) {
      setActiveIdx(updated.length - 1);
    }
  };

  const handleUpdateCurrentQ = (field, value) => {
    const updated = [...questions];
    updated[activeIdx] = {
      ...updated[activeIdx],
      [field]: value,
    };
    setQuestions(updated);
  };

  const handleOptionChange = (optIdx, text) => {
    const updated = [...questions];
    updated[activeIdx].options[optIdx].text = text;
    setQuestions(updated);
  };

  const handleSetCorrectOption = (optIdx) => {
    sound.playClick();
    const updated = [...questions];
    updated[activeIdx].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optIdx;
    });
    // If choice has text, also set correctAnswer
    if (updated[activeIdx].options[optIdx]?.text) {
      updated[activeIdx].correctAnswer = updated[activeIdx].options[optIdx].text;
    }
    setQuestions(updated);
  };

  // Image manipulation handlers
  const handleGenerateAIImage = () => {
    sound.playClick();
    const cleanWords = currentQ.text
      ? currentQ.text.replace(/_______/g, '').replace(/[^a-zA-Z\s]/g, ' ').slice(0, 60).trim()
      : 'modern english classroom';
    const seed = Date.now();
    const aiImageUrl = getSafeEducationalImageUrl(cleanWords || 'modern english classroom', { width: 800, height: 450, seed });
    handleUpdateCurrentQ('image', aiImageUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        sound.playCorrect();
        handleUpdateCurrentQ('image', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    sound.playClick();
    handleUpdateCurrentQ('image', '');
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề cho bộ câu hỏi!');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Câu hỏi số ${i + 1} chưa có nội dung! Vui lòng nhập câu hỏi.`);
        setActiveIdx(i);
        return;
      }

      if (q.type === 'blank') {
        if (!q.correctAnswer?.trim()) {
          const firstOpt = q.options?.find((o) => o.isCorrect)?.text || q.options?.[0]?.text;
          if (!firstOpt?.trim()) {
            alert(`Câu hỏi số ${i + 1} (Điền từ) cần nhập từ chính xác để học sinh gõ!`);
            setActiveIdx(i);
            return;
          }
          q.correctAnswer = firstOpt.trim();
        }
      } else if (q.type === 'choice' || !q.type) {
        const filledOptions = q.options.filter((o) => o.text.trim());
        if (filledOptions.length < 2) {
          alert(`Câu hỏi số ${i + 1} phải có ít nhất 2 đáp án!`);
          setActiveIdx(i);
          return;
        }
        const hasCorrect = q.options.some((o) => o.isCorrect && o.text.trim());
        if (!hasCorrect) {
          alert(`Câu hỏi số ${i + 1} chưa chọn đáp án đúng hợp lệ!`);
          setActiveIdx(i);
          return;
        }
      }
    }

    sound.playClick();
    const savedQuiz = {
      id: quizToEdit?.id || `custom_${Date.now()}`,
      title: title.trim(),
      description: quizToEdit?.description || `Lớp: ${targetClass} | Chủ đề: ${skillTopic} | Thời lượng: ${defaultTime}s/câu`,
      author: quizToEdit?.author || 'Giáo viên V English House',
      gradeLevel: targetClass,
      topic: skillTopic,
      timeLimit: defaultTime,
      sessionMode,
      questions,
    };

    onSaveQuiz(savedQuiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="bg-[#1C2024] border-2 border-vhouse-gold/60 rounded-3xl w-full max-w-7xl h-[94vh] shadow-2xl flex flex-col text-white overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-5 py-3 border-b border-gray-800 bg-[#14171A] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="w-9 h-9 bg-vhouse-gold text-vhouse-dark rounded-xl flex items-center justify-center font-black shadow-duo-yellow flex-shrink-0">
              <Layers className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bộ đề thi (VD: Kiểm Tra Ngữ Pháp Lớp B01)..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-vhouse-gold rounded-xl px-3 py-1.5 text-sm font-black text-white outline-none"
              />
            </div>
          </div>

          {/* Quick Settings Chips */}
          <div className="flex items-center gap-2">
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs font-bold text-gray-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-vhouse-gold"
            >
              <option value="Lớp A01 (Kids Primary)">🏫 Lớp A01 (Kids)</option>
              <option value="Lớp B01 (Pre-IELTS)">🏫 Lớp B01 (Pre-IELTS)</option>
              <option value="Lớp B02 (Foundation)">🏫 Lớp B02 (Foundation)</option>
              <option value="Lớp C01 (IELTS Intensive)">🏫 Lớp C01 (IELTS)</option>
              <option value="Lớp Giao Tiếp Người Đi Làm">🏫 Lớp Giao Tiếp</option>
            </select>

            <select
              value={skillTopic}
              onChange={(e) => setSkillTopic(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs font-bold text-gray-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-vhouse-gold"
            >
              <option value="Ngữ pháp (Grammar)">✍️ Ngữ pháp</option>
              <option value="Từ vựng (Vocabulary)">📖 Từ vựng</option>
              <option value="Phát âm & Speaking">🗣️ Phát âm IPA</option>
              <option value="Đọc hiểu & Cloze">👓 Đọc hiểu</option>
              <option value="Đảo ngữ (Inversion)">⚡ Đảo ngữ</option>
            </select>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 active:translate-y-1 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 fill-current" />
              <span>{quizToEdit ? 'Lưu Thay Đổi' : 'Lưu Bộ Đề'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Column Kahoot-Grade Canvas */}
        <div className="flex-1 flex overflow-hidden">
          {/* COLUMN 1: Left Slides Sidebar */}
          <div className="w-56 sm:w-64 border-r border-gray-800 bg-[#16191D] p-3 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block px-1">
                Danh Sách Câu Hỏi ({questions.length})
              </span>

              {questions.map((q, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`p-3 rounded-2xl border cursor-pointer transition relative group ${
                      isActive
                        ? 'bg-vhouse-gold/15 border-vhouse-gold shadow-md'
                        : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-black flex items-center gap-1 ${isActive ? 'text-vhouse-gold' : 'text-gray-400'}`}>
                        <span>{idx + 1}.</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {q.type === 'blank' ? 'Điền từ' : q.type === 'true_false' ? 'Đúng/Sai' : q.type === 'scramble' ? 'Sắp xếp' : 'Trắc nghiệm'}
                        </span>
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={(e) => handleDuplicateQuestion(idx, e)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                          title="Nhân bản"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveQuestion(idx, e)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400"
                            title="Xóa"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-200 line-clamp-2 font-medium">
                      {q.text || 'Chưa nhập nội dung...'}
                    </p>

                    {/* Image indicator badge */}
                    {q.image && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-vhouse-gold font-bold">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>Có ảnh minh họa</span>
                      </div>
                    )}

                    {/* Mini Kahoot 4-box indicator */}
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      <div className="h-1.5 rounded-sm bg-red-500" />
                      <div className="h-1.5 rounded-sm bg-blue-500" />
                      <div className="h-1.5 rounded-sm bg-amber-500" />
                      <div className="h-1.5 rounded-sm bg-emerald-500" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="mt-3 w-full py-2.5 px-3 bg-gray-900 hover:bg-vhouse-gold/20 border-2 border-dashed border-gray-700 hover:border-vhouse-gold text-gray-300 hover:text-vhouse-gold rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Câu Hỏi Mới</span>
            </button>
          </div>

          {/* COLUMN 2: Center Main Workspace */}
          <div className="flex-1 bg-[#14171A] p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-3.5">
            {/* Top: Large Question Input Box */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-vhouse-gold/40 text-gray-900 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-vhouse-dark/60 uppercase tracking-wider">
                  Nội Dung Câu Hỏi Số {activeIdx + 1}:
                </span>
                <button
                  type="button"
                  onClick={() => speech.speak(currentQ.text || 'Vui lòng nhập câu hỏi trước')}
                  className="px-3 py-1 bg-gray-100 hover:bg-vhouse-gold/20 text-gray-800 rounded-full font-bold text-xs flex items-center gap-1.5 transition border border-gray-300"
                  title="Nghe phát âm thử bằng Google Voice"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nghe Google Voice</span>
                </button>
              </div>

              <textarea
                value={currentQ.text}
                onChange={(e) => handleUpdateCurrentQ('text', e.target.value)}
                placeholder="Nhập câu hỏi tiếng Anh ở đây (VD: If nations _______ diplomatic solutions, war would be prevented)..."
                rows={2}
                className="w-full text-base sm:text-lg md:text-xl font-black text-gray-900 placeholder:text-gray-400 bg-transparent outline-none resize-none leading-snug"
              />
            </div>

            {/* Illustration Image Section (Requested by User) */}
            <div className="bg-[#1C2024] border border-gray-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-vhouse-gold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Ảnh Minh Họa Câu Hỏi:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    className="px-3 py-1 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 flex items-center gap-1 transition"
                    title="AI tự động tạo hình ảnh minh họa theo nội dung câu hỏi"
                  >
                    <Wand2 className="w-3 h-3 fill-current" />
                    <span>AI Tạo Ảnh Tự Động</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-xl border border-gray-700 flex items-center gap-1 transition"
                    title="Tải ảnh từ máy tính"
                  >
                    <Upload className="w-3 h-3 text-vhouse-gold" />
                    <span>Tải Từ Máy</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-xl border border-gray-700 flex items-center gap-1 transition"
                    title="Dán link ảnh trực tiếp"
                  >
                    <LinkIcon className="w-3 h-3 text-vhouse-gold" />
                    <span>Dán Link</span>
                  </button>
                  {currentQ.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl border border-red-500/40 flex items-center gap-1 transition"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* URL Input Box if toggled */}
              {showUrlInput && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-gray-900 rounded-xl border border-gray-700">
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="Dán URL hình ảnh (https://...)"
                    className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempImageUrl.trim()) {
                        handleUpdateCurrentQ('image', tempImageUrl.trim());
                        setShowUrlInput(false);
                        setTempImageUrl('');
                      }
                    }}
                    className="px-3 py-1 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-lg shadow-sm"
                  >
                    Áp Dụng
                  </button>
                </div>
              )}

              {/* Image Preview or Placeholder */}
              {currentQ.image ? (
                <div className="relative rounded-xl overflow-hidden border border-vhouse-gold/40 max-h-36 bg-black flex justify-center group">
                  <img
                    src={currentQ.image}
                    alt="Minh họa câu hỏi"
                    className="max-h-36 object-contain rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-vhouse-gold font-bold">
                    Đã gán ảnh minh họa
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-800 rounded-xl p-3 text-center text-xs text-gray-500">
                  Chưa có ảnh minh họa. Nhấn <strong>"AI Tạo Ảnh Tự Động"</strong> hoặc <strong>"Tải Từ Máy"</strong> để thêm hình ảnh sinh động cho câu hỏi này.
                </div>
              )}
            </div>

            {/* Middle Workspace based on question type */}
            {/* TYPE 1: FILL IN THE BLANK */}
            {currentQ.type === 'blank' && (
              <div className="bg-[#1C2024] border-2 border-cyan-500/50 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <span>✍️ ĐÁP ÁN CHÍNH XÁC HỌC VIÊN CẦN GÕ VÀO CHỖ TRỐNG (_______):</span>
                </span>
                <input
                  type="text"
                  value={currentQ.correctAnswer || ''}
                  onChange={(e) => handleUpdateCurrentQ('correctAnswer', e.target.value)}
                  placeholder="Gõ từ đáp án chính xác (VD: prioritized)..."
                  className="w-full bg-gray-900 border-2 border-cyan-500/40 rounded-xl px-4 py-2.5 text-base font-black text-white outline-none focus:border-cyan-400 font-mono"
                />

                <div className="pt-2 border-t border-gray-800">
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">
                    Các biến thể chấp nhận được (ngăn cách bằng dấu phẩy):
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(currentQ.acceptableAnswers) ? currentQ.acceptableAnswers.join(', ') : ''}
                    onChange={(e) => handleUpdateCurrentQ('acceptableAnswers', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                    placeholder="VD: prioritized, prioritised"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* TYPE 2: TRUE / FALSE */}
            {currentQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3.5 flex-1 my-2">
                {[
                  { text: 'True (Đúng)', bg: 'bg-[#1368ce]', border: 'border-blue-700', shape: '✔', val: 'True' },
                  { text: 'False (Sai)', bg: 'bg-[#e21b3c]', border: 'border-red-700', shape: '✖', val: 'False' },
                ].map((tf, optIdx) => {
                  const isCorrect = currentQ.options[optIdx]?.isCorrect;
                  return (
                    <div
                      key={optIdx}
                      className={`${tf.bg} p-4 rounded-2xl shadow-lg border-b-4 ${tf.border} flex items-center justify-between transition cursor-pointer`}
                      onClick={() => handleSetCorrectOption(optIdx)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-white">{tf.shape}</span>
                        <span className="text-lg font-black text-white">{tf.text}</span>
                      </div>
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                          isCorrect ? 'bg-emerald-500 border-white text-white scale-110 shadow-lg' : 'border-white/40 bg-black/20 text-transparent'
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TYPE 3: SENTENCE SCRAMBLE */}
            {currentQ.type === 'scramble' && (
              <div className="bg-[#1C2024] border-2 border-amber-500/50 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <span>🧩 CÂU TIẾNG ANH CHUẨN ĐỂ HỌC VIÊN SẮP XẾP LẠI:</span>
                </span>
                <input
                  type="text"
                  value={currentQ.originalSentence || currentQ.correctAnswer || ''}
                  onChange={(e) => {
                    const textVal = e.target.value;
                    handleUpdateCurrentQ('originalSentence', textVal);
                    handleUpdateCurrentQ('correctAnswer', textVal);
                    const words = textVal.replace(/[.?!,]/g, '').split(/\s+/).filter(Boolean);
                    handleUpdateCurrentQ('scrambledWords', words.sort(() => Math.random() - 0.5));
                  }}
                  placeholder="VD: If I had more time I would learn French..."
                  className="w-full bg-gray-900 border-2 border-amber-500/40 rounded-xl px-4 py-2.5 text-base font-black text-white outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* TYPE 4: MULTIPLE CHOICE (4 KAHOOT BOXES) */}
            {(!currentQ.type || currentQ.type === 'choice') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 my-2">
                {currentQ.options.map((opt, optIdx) => {
                  const color = KAHOOT_COLORS[optIdx];
                  const isCorrect = opt.isCorrect;

                  return (
                    <div
                      key={optIdx}
                      className={`${color.bg} p-3.5 sm:p-4 rounded-2xl shadow-lg border-b-4 ${color.border} flex items-center gap-3 transition relative group`}
                    >
                      {/* Geometric Shape Icon / House Badge */}
                      <div className="w-10 h-10 rounded-xl bg-black/25 flex flex-col items-center justify-center font-black text-white flex-shrink-0">
                        <span className="text-base leading-none">{color.shape}</span>
                        {color.house && (
                          <span className="text-[7.5px] font-black uppercase tracking-wider opacity-90 mt-0.5">
                            {color.house}
                          </span>
                        )}
                      </div>

                      {/* Option Text Input */}
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                        placeholder={`Đáp án ${String.fromCharCode(65 + optIdx)}...`}
                        className="flex-1 bg-transparent text-white placeholder:text-white/60 font-bold text-base outline-none"
                      />

                      {/* Kahoot Circular Checkmark Selector */}
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(optIdx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition flex-shrink-0 shadow-md ${
                          isCorrect
                            ? 'bg-emerald-500 border-white text-white scale-110 ring-4 ring-emerald-400/50'
                            : 'border-white/50 bg-black/20 text-transparent hover:border-white'
                        }`}
                        title={isCorrect ? 'Đáp án đúng' : 'Bấm để chọn làm đáp án đúng'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom: Explanation & Pedagogical Notes */}
            <div className="bg-[#1C2024] border border-gray-800 rounded-2xl p-3">
              <label className="text-[11px] font-black uppercase text-vhouse-gold block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Giải Thích Ngữ Pháp & Dặn Dò Sư Phạm (Hiện khi công bố đáp án):</span>
              </label>
              <input
                type="text"
                value={currentQ.explanation}
                onChange={(e) => handleUpdateCurrentQ('explanation', e.target.value)}
                placeholder="VD: 💡 Câu điều kiện loại 2: Mệnh đề If dùng Quá khứ đơn, mệnh đề chính dùng would + V-bare..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-vhouse-gold rounded-xl px-3 py-2 text-xs font-medium text-white outline-none"
              />
            </div>
          </div>

          {/* COLUMN 3: Right Settings Panel */}
          <div className="w-60 sm:w-64 border-l border-gray-800 bg-[#16191D] p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-vhouse-gold tracking-wider block border-b border-gray-800 pb-2">
                ⚙️ Cài Đặt Câu Hỏi Số {activeIdx + 1}
              </span>

              {/* Question Type */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                  Loại Câu Hỏi:
                </label>
                <select
                  value={currentQ.type === 'truefalse' ? 'true_false' : currentQ.type || 'choice'}
                  onChange={(e) => handleUpdateCurrentQ('type', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-xl px-3 py-2 outline-none focus:border-vhouse-gold"
                >
                  <option value="choice">🎯 Trắc nghiệm 4 đáp án (Quiz)</option>
                  <option value="blank">✍️ Điền từ vào chỗ trống (Fill In The Blank)</option>
                  <option value="true_false">⚖️ Đúng / Sai (True / False)</option>
                  <option value="scramble">🔤 Sắp xếp từ (Duolingo Style)</option>
                </select>
              </div>

              {/* Time Limit per question */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-vhouse-gold" />
                  <span>Thời Gian (Timeline):</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[10, 15, 20, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleUpdateCurrentQ('timeLimit', sec)}
                      className={`py-2 px-2 rounded-xl text-xs font-black border transition ${
                        currentQ.timeLimit === sec
                          ? 'bg-vhouse-gold text-vhouse-dark border-vhouse-gold shadow-duo-yellow'
                          : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {sec} giây
                    </button>
                  ))}
                </div>
              </div>

              {/* Point Value */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-vhouse-gold" />
                  <span>Điểm Thưởng:</span>
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'Chuẩn (1000 điểm)', val: 1000 },
                    { label: 'Nhân đôi (2000 điểm)', val: 2000 },
                    { label: 'Khởi động (0 điểm)', val: 0 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => handleUpdateCurrentQ('points', p.val)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-black border text-left transition flex items-center justify-between ${
                        currentQ.points === p.val
                          ? 'bg-vhouse-gold/20 border-vhouse-gold text-vhouse-gold'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>
                      {currentQ.points === p.val && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-900/80 rounded-2xl border border-gray-800 text-[11px] text-gray-400 leading-relaxed">
              💡 <strong>Mẹo:</strong> Giáo viên có thể bấm nút <strong>"AI Tạo Ảnh Tự Động"</strong> để hệ thống tự động vẽ tranh minh họa cho bài học.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
