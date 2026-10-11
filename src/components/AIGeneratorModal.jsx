import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Upload,
  FileText,
  CheckCircle,
  ArrowRight,
  Zap,
  BookOpen,
  Clock,
  Layers,
  Key,
  Globe,
  Cpu,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  AlertCircle,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { smartAIGenerate, isValidGeminiKey, getLevelPedagogyProfile } from '../utils/aiGenerator';
import { getStoredCurriculumUnits, VHOUSE_CLASS_PROFILES } from '../data/vhouseCurriculum';
import { sound } from '../utils/sound';

export default function AIGeneratorModal({ isOpen, onClose, onQuizGenerated, onOpenEditorWithQuiz }) {
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt', 'curriculum', 'document', 'vocab'
  const [promptInput, setPromptInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');
  const [vocabInput, setVocabInput] = useState('');
  const [curriculumUnits, setCurriculumUnits] = useState(() => getStoredCurriculumUnits());
  const [curriculumClassFilter, setCurriculumClassFilter] = useState('ALL');
  const [questionCount, setQuestionCount] = useState(10);
  const [targetClass, setTargetClass] = useState('Lớp B01 (Pre-IELTS)');
  const [timeLimit, setTimeLimit] = useState(15);
  const [skillTopic, setSkillTopic] = useState('Ngữ Âm IPA & Phát Âm');
  const [sessionMode, setSessionMode] = useState('live'); // 'live' | 'homework'
  const [deadline, setDeadline] = useState('21:00 Chủ Nhật');
  const [questionFormat, setQuestionFormat] = useState('mixed'); // 'mixed' | 'blank' | 'choice' | 'true_false' | 'scramble'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  // Gemini Cloud API Key configuration
  const [geminiKey, setGeminiKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  useEffect(() => {
    let savedKey = localStorage.getItem('vhouse_gemini_api_key') || '';
    // Auto-fix zero vs letter O if previously saved
    if (savedKey.includes('Qr0Hu')) {
      savedKey = savedKey.replace('Qr0Hu', 'QrOHu');
      localStorage.setItem('vhouse_gemini_api_key', savedKey);
    }
    if (!savedKey && localStorage.getItem('vhouse_key_removed') !== 'true') {
      savedKey = '';
    }
    setGeminiKey(savedKey);
    setKeyInput(savedKey);
  }, [isOpen]);

  const handleSaveKey = () => {
    sound.playClick();
    const cleanKey = keyInput.trim();
    if (!cleanKey) {
      handleRemoveKey();
      return;
    }

    if (!isValidGeminiKey(cleanKey)) {
      sound.playWrong();
      alert("❌ Mã API Key không hợp lệ! Vui lòng kiểm tra lại key lấy từ Google AI Studio (aistudio.google.com). Key thường có độ dài trên 30 ký tự (bắt đầu bằng AQ. hoặc AIzaSy...).");
      return;
    }

    setGeminiKey(cleanKey);
    localStorage.setItem('vhouse_gemini_api_key', cleanKey);
    localStorage.removeItem('vhouse_key_removed');
    sound.playCorrect();
    alert("🎉 Đã lưu và kích hoạt Google Gemini API Key thành công!");
  };

  const handleRemoveKey = () => {
    sound.playClick();
    setGeminiKey('');
    setKeyInput('');
    localStorage.removeItem('vhouse_gemini_api_key');
    localStorage.setItem('vhouse_key_removed', 'true');
  };

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt = null, customRaw = null, customFormat = null, customGrade = null) => {
    sound.playClick();
    setIsGenerating(true);

    const promptText = customPrompt !== null ? customPrompt : promptInput;
    const rawText = customRaw !== null ? customRaw : activeTab === 'vocab' ? vocabInput : documentInput;
    const effectiveFmt = customFormat !== null ? customFormat : questionFormat;
    const effectiveGrade = customGrade !== null ? customGrade : targetClass;

    // Detect if teacher requested specific number in prompt (e.g. "tạo 10 câu...")
    const countMatch = promptText.match(/(?:tạo|sinh|làm|soạn|viết|khoảng|lấy|cần)?\s*(\d{1,2})\s*(?:câu|cau|questions?|câu hỏi)/i);
    const effectiveCount = countMatch ? parseInt(countMatch[1], 10) : questionCount;
    if (countMatch && effectiveCount !== questionCount) {
      setQuestionCount(effectiveCount);
    }

    try {
      const result = await smartAIGenerate({
        prompt: promptText,
        rawText,
        questionCount: effectiveCount,
        level: effectiveGrade,
        timeLimit,
        topic: skillTopic,
        sessionMode,
        deadline,
        questionFormat: effectiveFmt,
        apiKey: geminiKey,
      });

      setGeneratedResult(result);
      sound.playCorrect();
    } catch (err) {
      console.error('Lỗi khi sinh đề:', err);
      sound.playWrong();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = (presetPrompt, presetGrade = null, presetFormat = null) => {
    setPromptInput(presetPrompt);
    const effectiveGrade = presetGrade || targetClass || 'Lớp B01 (Pre-IELTS)';
    setTargetClass(effectiveGrade);
    if (presetFormat) setQuestionFormat(presetFormat);
    handleGenerate(presetPrompt, '', presetFormat, effectiveGrade);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setDocumentInput(text);
        setActiveTab('document');
        handleGenerate('Bài tập từ tệp tài liệu tải lên', text);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmAndUse = () => {
    if (!generatedResult) return;
    sound.playClick();
    onQuizGenerated(generatedResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1C2024] border-2 border-vhouse-gold/70 rounded-3xl w-full max-w-3xl my-6 p-5 sm:p-7 shadow-2xl relative text-white max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vhouse-gold text-vhouse-dark rounded-xl flex items-center justify-center shadow-duo-yellow font-black">
              <Wand2 className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-vhouse-gold font-display flex items-center gap-2">
                V HOUSE AI - TẠO GAME TỰ ĐỘNG THÔNG MINH
              </h3>
              <p className="text-xs text-gray-400">
                Hiểu đúng 100% ngữ cảnh (IPA phát âm, 12 thì, đảo ngữ, thời sự thế giới)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Status Banner & Prominent Gemini API Key Configuration Box */}
        <div className="mt-3 bg-gradient-to-r from-gray-900 via-[#23272C] to-gray-900 border-2 border-vhouse-gold/40 rounded-2xl p-3.5 flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs">
              {geminiKey ? (
                <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/50 px-3 py-1 rounded-xl">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-black">
                    ĐÃ KẾT NỐI: Google Gemini AI ({geminiKey.slice(0, 6)}...{geminiKey.slice(-4)})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/40 px-3 py-1 rounded-xl">
                  <Cpu className="w-4 h-4 text-vhouse-gold" />
                  <span className="text-amber-200 font-bold">
                    CHẾ ĐỘ: V House Neural Engine (Chuẩn IPA & 12 Thì - Tích Hợp Sẵn)
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
                showKeyConfig
                  ? 'bg-vhouse-gold text-vhouse-dark border-vhouse-gold'
                  : 'bg-gray-800 text-vhouse-gold border-gray-700 hover:bg-gray-750'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showKeyConfig ? 'Đóng Ô Nhập Key' : '🔑 Hướng Dẫn & Dán Key Gemini'}</span>
              {showKeyConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Step-by-Step API Key Box */}
          {showKeyConfig && (
            <div className="mt-3 pt-3 border-t border-gray-800 text-xs space-y-3 animate-fade-in">
              <div className="bg-black/50 p-3 rounded-xl border border-gray-800 space-y-2">
                <div className="font-black text-vhouse-gold flex items-center gap-1.5">
                  <span>💡 Cách lấy Key Gemini miễn phí từ Google (Chỉ mất 30s):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
                  <li>
                    Mở trang web:{' '}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-vhouse-gold underline font-bold inline-flex items-center gap-0.5 hover:text-white"
                    >
                      <span>Google AI Studio (aistudio.google.com)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    và đăng nhập bằng tài khoản Gmail của bạn.
                  </li>
                  <li>
                    Bấm nút xanh <strong className="text-white">"Get API key"</strong> ở góc trên bên trái ➔ Bấm <strong className="text-white">"Create API key"</strong>.
                  </li>
                  <li>
                    Copy chuỗi Key (bắt đầu bằng <code className="bg-gray-800 px-1 py-0.5 rounded text-emerald-300 font-mono font-bold">AQ...</code> hoặc <code className="bg-gray-800 px-1 py-0.5 rounded text-emerald-300 font-mono font-bold">AIzaSy...</code>) rồi dán vào ô bên dưới:
                  </li>
                </ol>
              </div>

              {/* Paste Input Area */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Dán mã API Key Google AI Studio (bắt đầu bằng AQ. hoặc AIzaSy...)"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      className={`w-full bg-black/80 border-2 font-mono text-xs rounded-xl px-4 py-2.5 outline-none shadow-inner ${
                        keyInput && !isValidGeminiKey(keyInput)
                          ? 'border-red-500 text-red-200'
                          : 'border-vhouse-gold/60 focus:border-vhouse-gold text-white'
                      }`}
                    />
                    {geminiKey && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                        Đang hoạt động
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveKey}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 flex-shrink-0"
                    >
                      <Check className="w-4 h-4" />
                      <span>Lưu & Kích Hoạt</span>
                    </button>

                    {geminiKey && (
                      <button
                        type="button"
                        onClick={handleRemoveKey}
                        className="px-3.5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl border border-red-500/40 transition flex-shrink-0"
                      >
                        Xóa Key
                      </button>
                    )}
                  </div>
                </div>

                {/* Real-time Validation Warning */}
                {keyInput && !isValidGeminiKey(keyInput) && (
                  <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-200 font-black">
                        Mã API Key chưa đúng định dạng của Google AI Studio!
                      </strong>
                      <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                        Key từ Google AI Studio có độ dài từ 30 ký tự trở lên (bắt đầu bằng <code className="bg-black px-1.5 py-0.5 rounded text-emerald-300 font-mono font-bold">AQ.</code> hoặc <code className="bg-black px-1.5 py-0.5 rounded text-emerald-300 font-mono font-bold">AIzaSy...</code>). Bạn vui lòng kiểm tra lại tại <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline text-vhouse-gold">aistudio.google.com</a> nhé.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-3 pb-2 border-b border-gray-800/80 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1 Lệnh Ra Ngay (Prompt Tự Do)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('curriculum');
              setCurriculumUnits(getStoredCurriculumUnits());
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📚 Kho Học Liệu V House</span>
            <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-black">
              1-CHẠM
            </span>
          </button>

          <button
            onClick={() => setActiveTab('document')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'document'
                ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Từ Giáo Án / Đoạn Văn Bản</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vocab'
                ? 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dán Từ Vựng Thô (Wordlist)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1 pr-1">
          {/* Top Global Quiz Configuration Card */}
          <div className="bg-[#14171A] border border-vhouse-gold/40 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-xs font-black text-vhouse-gold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Cấu Hình Đề Thi Sư Phạm (Lớp, Timeline, Kỹ Năng)</span>
              </div>
              <span className="text-[10px] bg-vhouse-gold/15 text-vhouse-gold px-2.5 py-0.5 rounded-full font-bold">
                V House Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* 1. Chọn Lớp */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                  🏫 Lớp Áp Dụng:
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-xl px-2.5 py-2 outline-none focus:border-vhouse-gold"
                >
                  <option value="Lớp A01 (Kids Primary)">Lớp A01 (Kids Primary)</option>
                  <option value="Lớp B01 (Pre-IELTS)">Lớp B01 (Pre-IELTS)</option>
                  <option value="Lớp B02 (Foundation)">Lớp B02 (Foundation)</option>
                  <option value="Lớp C01 (IELTS Intensive)">Lớp C01 (IELTS Intensive)</option>
                  <option value="Lớp Giao Tiếp Người Đi Làm">Lớp Giao Tiếp Người Đi Làm</option>
                </select>
              </div>

              {/* 2. Timeline Mỗi Câu */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                  ⏱️ Timeline / Câu:
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 text-xs font-bold text-vhouse-gold rounded-xl px-2.5 py-2 outline-none focus:border-vhouse-gold"
                >
                  <option value={10}>10 giây (Siêu Tốc)</option>
                  <option value={15}>15 giây (Chuẩn Kahoot)</option>
                  <option value={20}>20 giây (Sư Phạm)</option>
                  <option value={30}>30 giây (Đọc Hiểu)</option>
                  <option value={60}>60 giây (Thảo Luận)</option>
                </select>
              </div>

              {/* 3. Chủ Đề & Kỹ Năng */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                  🎯 Kỹ Năng / Chủ Đề:
                </label>
                <select
                  value={skillTopic}
                  onChange={(e) => setSkillTopic(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-xl px-2.5 py-2 outline-none focus:border-vhouse-gold"
                >
                  <option value="Ngữ Âm IPA & Phát Âm">🗣️ Ngữ Âm IPA & Phát Âm</option>
                  <option value="12 Thì Tiếng Anh & Thời Sự">🌍 12 Thì Tiếng Anh & Thời Sự</option>
                  <option value="Trí Tuệ Nhân Tạo & Công Nghệ">🤖 Trí Tuệ Nhân Tạo & Công Nghệ</option>
                  <option value="Ngữ pháp (Grammar)">✍️ Ngữ pháp (Grammar)</option>
                  <option value="Từ vựng (Vocabulary)">📖 Từ vựng (Vocabulary)</option>
                  <option value="Đảo ngữ & Bẫy Đề Thi">⚡ Đảo ngữ & Bẫy Đề Thi</option>
                </select>
              </div>

              {/* 4. Hình thức & Số câu */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                  🏆 Số Câu & Hình Thức:
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="flex-1 bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-xl px-2 py-2 outline-none focus:border-vhouse-gold"
                  >
                    <option value={5}>5 Câu</option>
                    <option value={8}>8 Câu</option>
                    <option value={10}>10 Câu</option>
                    <option value={12}>12 Câu</option>
                    <option value={15}>15 Câu</option>
                  </select>
                  <select
                    value={sessionMode}
                    onChange={(e) => setSessionMode(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-xl px-2 py-2 outline-none focus:border-vhouse-gold"
                  >
                    <option value="live">Đấu Trực Tiếp</option>
                    <option value="homework">BTVN (Có Hạn)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Định Dạng Câu Hỏi (Question Format) */}
            <div className="pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black uppercase text-vhouse-gold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Định Dạng Trò Chơi (Game Format):</span>
                </label>
                <span className="text-[11px] text-gray-400 font-medium">
                  {questionFormat === 'blank' && '✍️ Gõ từ trực tiếp vào chỗ trống _______'}
                  {questionFormat === 'choice' && '🔘 4 nút trắc nghiệm (Kahoot kinh điển)'}
                  {questionFormat === 'true_false' && '⚖️ 2 phím Đúng / Sai siêu tốc'}
                  {questionFormat === 'scramble' && '🧩 Chạm ghép từ thành câu hoàn chỉnh'}
                  {questionFormat === 'mixed' && '🎲 Kết hợp thông minh mọi dạng bài'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'mixed', label: 'Hỗn Hợp', icon: '🎲', desc: 'Đầy đủ mọi dạng' },
                  { id: 'blank', label: 'Điền Chỗ Trống', icon: '✍️', desc: 'Gõ từ vào _______' },
                  { id: 'choice', label: 'Trắc Nghiệm', icon: '🔘', desc: '4 đáp án Kahoot' },
                  { id: 'true_false', label: 'Đúng / Sai', icon: '⚖️', desc: 'True / False' },
                  { id: 'scramble', label: 'Sắp Xếp Từ', icon: '🧩', desc: 'Ghép từ thành câu' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setQuestionFormat(fmt.id);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                      questionFormat === fmt.id
                        ? 'bg-vhouse-gold text-vhouse-dark border-vhouse-gold shadow-duo-yellow font-black scale-[1.02]'
                        : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 font-bold'
                    }`}
                  >
                    <span className="text-base">{fmt.icon}</span>
                    <span className="text-xs font-black">{fmt.label}</span>
                    <span className={`text-[9px] ${questionFormat === fmt.id ? 'text-black/80 font-bold' : 'text-gray-400'}`}>
                      {fmt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Dynamic Pedagogical Level Banner */}
            {(() => {
              const profile = getLevelPedagogyProfile(targetClass);
              const isKids = profile.type === 'kids';
              const isIelts = profile.type === 'ielts_intensive';
              const isWorkplace = profile.type === 'workplace';
              return (
                <div className={`pt-3 border-t border-gray-800 flex items-start gap-2.5 transition-all ${
                  isKids
                    ? 'text-emerald-200'
                    : isIelts
                    ? 'text-purple-200'
                    : isWorkplace
                    ? 'text-blue-200'
                    : 'text-amber-200'
                }`}>
                  <div className={`p-2 rounded-xl text-lg flex-shrink-0 border ${
                    isKids
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : isIelts
                      ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                      : isWorkplace
                      ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  }`}>
                    {isKids ? '🐾' : isIelts ? '🎓' : isWorkplace ? '💼' : '🏫'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <span className="font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <span>Định Tuyến Sư Phạm:</span>
                        <span className="underline decoration-vhouse-gold decoration-2">{profile.label}</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">({profile.cefr})</span>
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-white/10 border border-white/15">
                        📏 {profile.sentenceLength}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-200">
                      <strong>Từ vựng phù hợp:</strong> {profile.vocabGuide}
                    </p>
                    <p className="text-[11px] text-gray-300">
                      <strong>Thích ứng bối cảnh:</strong> {profile.themeAdaptation}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* TAB 1: 1-CLICK PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-vhouse-gold mb-2">
                  🚀 Các Chủ Đề Chuyên Sâu AI Hiểu Ngay (Bấm 1 chạm):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {/* Preset 1: Kids Primary - Động vật & 12 Thì */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('tạo 10 câu về 12 thì tiếng anh trong thời sự thế giới', 'Lớp A01 (Kids Primary)', 'mixed')}
                    className="p-2.5 bg-gray-900/90 hover:bg-emerald-950/40 hover:border-emerald-400 border-2 border-emerald-500/60 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-emerald-300">
                      <span className="text-emerald-300">🐾 [Kids A01] Động Vật & 12 Thì Vui Nhộn</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Gấu trúc, khỉ con, phi hành gia, robot đá bóng (từ vựng tiểu học 6-10t)
                    </p>
                  </button>

                  {/* Preset 2: Kids Primary - Câu điều kiện loại 2 siêu nhân */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Tạo 10 câu về câu điều kiện loại 2 lồng ghép hòa bình và siêu nhân', 'Lớp A01 (Kids Primary)', 'choice')}
                    className="p-2.5 bg-gray-900/90 hover:bg-emerald-950/40 hover:border-emerald-400 border-2 border-emerald-500/60 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-emerald-300">
                      <span className="text-emerald-300">🦸 [Kids A01] ĐK Loại 2: Siêu Nhân & Ước Mơ</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Giả định siêu anh hùng, cún biết nói, đũa phép, chia sẻ đồ chơi hòa bình
                    </p>
                  </button>

                  {/* Preset 3: Kids Primary - IPA & Phonics */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Hãy tạo 10 câu hỏi để luyện tập IPA phát âm', 'Lớp A01 (Kids Primary)', 'choice')}
                    className="p-2.5 bg-gray-900/90 hover:bg-emerald-950/40 hover:border-emerald-400 border-2 border-emerald-500/60 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-emerald-300">
                      <span className="text-emerald-300">🗣️ [Kids A01] Ngữ Âm Phonics & IPA Cho Bé</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Đuôi -s/es, đuôi -ed, âm th, sheep vs ship, chữ k câm qua từ vựng bé thích
                    </p>
                  </button>

                  {/* Preset 4: Điền từ vào chỗ trống - Conditionals Type 2 & War/Peace (Pre-IELTS) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Điền từ vào chỗ trống về câu điều kiện loại 2 lồng ghép về sự kiện chiến tranh và hòa bình', 'Lớp B01 (Pre-IELTS)', 'blank')}
                    className="p-2.5 bg-gray-900/90 hover:bg-vhouse-gold/20 hover:border-vhouse-gold border border-vhouse-gold/50 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-vhouse-gold">
                      <span className="text-vhouse-gold">✍️ [Pre-IELTS] Điền Từ: ĐK Loại 2 & Hòa Bình</span>
                      <ArrowRight className="w-3.5 h-3.5 text-vhouse-gold" />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Gõ chữ vào chỗ trống: treaties, ceasefire, diplomacy (100% gõ chữ trên phone)
                    </p>
                  </button>

                  {/* Preset 5: IPA & Phát Âm (Pre-IELTS) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Hãy tạo 10 câu hỏi để luyện tập IPA phát âm', 'Lớp B01 (Pre-IELTS)', 'choice')}
                    className="p-2.5 bg-gray-900/90 hover:bg-vhouse-gold/20 hover:border-vhouse-gold border border-vhouse-gold/40 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-vhouse-gold">
                      <span>🗣️ [Pre-IELTS] Bảng Ngữ Âm IPA & Phát Âm</span>
                      <ArrowRight className="w-3.5 h-3.5 text-vhouse-gold" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Đuôi -ed, đuôi -s/es, âm th, nguyên âm dài /i:/, âm câm</p>
                  </button>

                  {/* Preset 6: 12 Thì Tiếng Anh & Thời Sự Toàn Cầu (Pre-IELTS) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('tạo 10 câu về 12 thì tiếng anh trong thời sự thế giới', 'Lớp B01 (Pre-IELTS)')}
                    className="p-2.5 bg-gray-900/90 hover:bg-vhouse-gold/20 hover:border-vhouse-gold border border-gray-800 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-vhouse-gold">
                      <span>🌍 [Pre-IELTS] 12 Thì Tiếng Anh & Thời Sự</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Khảo sát đủ 12 thì qua tin tức AI, NASA, Olympic, Xe điện</p>
                  </button>

                  {/* Preset 7: Đảo ngữ Inversion (IELTS Intensive) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Ngữ pháp Đảo ngữ (Inversion): Hardly had, Never before, Not only...', 'Lớp C01 (IELTS Intensive)')}
                    className="p-2.5 bg-gray-900/90 hover:bg-purple-900/30 hover:border-purple-400 border border-purple-500/40 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-purple-300">
                      <span className="text-purple-300">⚡ [IELTS C01] Đảo Ngữ Chuyên Sâu (Inversion)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Never before, No sooner... than, Only by, Under no circumstances</p>
                  </button>

                  {/* Preset 8: AI & Công nghệ tương lai (IELTS Intensive) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Tạo 10 câu về Trí tuệ nhân tạo (AI) và cách mạng công nghệ', 'Lớp C01 (IELTS Intensive)')}
                    className="p-2.5 bg-gray-900/90 hover:bg-purple-900/30 hover:border-purple-400 border border-purple-500/40 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-purple-300">
                      <span className="text-purple-300">🤖 [IELTS C01] Trí Tuệ Nhân Tạo (AI) & Công Nghệ</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Generative AI, Robotics, Quantum Computing, An ninh mạng</p>
                  </button>

                  {/* Preset 9: Giao tiếp công sở (Người Đi Làm) */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('10 câu tiếng Anh giao tiếp công sở, họp hành và viết email đối tác', 'Lớp Giao Tiếp Người Đi Làm', 'mixed')}
                    className="p-2.5 bg-gray-900/90 hover:bg-blue-900/30 hover:border-blue-400 border border-blue-500/40 rounded-2xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-blue-300">
                      <span className="text-blue-300">💼 [Người Đi Làm] Tiếng Anh Công Sở & Email</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Họp dự án, đàm phán tiến độ, viết email lịch sự với khách hàng</p>
                  </button>
                </div>
              </div>

              {/* Free-form Prompt Input */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-300 mb-1">
                  Hoặc tự gõ yêu cầu của bạn bằng tiếng Việt (AI tự hiểu bất kỳ chủ đề nào):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="VD: Hãy tạo 10 câu hỏi để luyện tập IPA phát âm / tạo 10 câu về 12 thì..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-vhouse-gold outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerate();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !promptInput.trim()}
                    className={`px-6 py-3 rounded-xl font-black text-xs shadow-duo-yellow flex items-center gap-1.5 flex-shrink-0 transition ${
                      isGenerating
                        ? 'bg-amber-400 text-vhouse-dark animate-pulse'
                        : 'bg-vhouse-gold text-vhouse-dark hover:brightness-110 active:translate-y-1'
                    }`}
                  >
                    <Wand2 className="w-4 h-4 fill-current" />
                    <span>{isGenerating ? 'AI Đang Suy Nghĩ...' : 'Tạo Ngay'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: V ENGLISH HOUSE CURRICULUM UNITS (1-CHẠM TỪ GIÁO TRÌNH) */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              {/* Class Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setCurriculumClassFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    curriculumClassFilter === 'ALL'
                      ? 'bg-vhouse-gold text-vhouse-dark font-black shadow-duo-yellow'
                      : 'bg-gray-900 text-gray-400 hover:text-white'
                  }`}
                >
                  Tất Cả Lớp ({curriculumUnits.length})
                </button>
                {Object.entries(VHOUSE_CLASS_PROFILES).map(([cid, prof]) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setCurriculumClassFilter(cid)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      curriculumClassFilter === cid
                        ? 'bg-vhouse-gold text-vhouse-dark font-black shadow-duo-yellow'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {prof.name}
                  </button>
                ))}
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {curriculumUnits
                  .filter((u) => curriculumClassFilter === 'ALL' || u.classId === curriculumClassFilter)
                  .map((unit) => (
                    <div
                      key={unit.id}
                      className="bg-gray-900/90 border border-gray-700/80 hover:border-vhouse-gold rounded-2xl p-3.5 space-y-2.5 transition flex flex-col justify-between group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] bg-black/60 text-vhouse-gold font-black px-2 py-0.5 rounded border border-vhouse-gold/40">
                            {unit.className || unit.classId} • {unit.unitNumber}
                          </span>
                          <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">
                            {unit.level}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-white group-hover:text-vhouse-gold transition">
                          {unit.title}
                        </h4>

                        <p className="text-[11px] text-gray-300">
                          <strong className="text-gray-400">Ngữ pháp:</strong> {unit.grammarFocus}
                        </p>

                        {unit.sampleSentence && (
                          <div className="text-[10px] italic text-amber-200/90 bg-black/40 p-2 rounded-lg font-mono">
                            "{unit.sampleSentence}"
                          </div>
                        )}

                        {Array.isArray(unit.targetVocab) && unit.targetVocab.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {unit.targetVocab.slice(0, 5).map((v, i) => (
                              <span
                                key={i}
                                className="text-[9.5px] bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded border border-gray-700"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetClass(unit.className || `Lớp ${unit.classId}`);
                          setQuestionFormat(unit.recommendedFormat || 'mixed');
                          const unitPrompt = `Tạo bài trắc nghiệm chuẩn sư phạm theo bài học: ${unit.title}. Ngữ pháp: ${unit.grammarFocus}. Chủ đề: ${unit.theme}.`;
                          const rawVocab = (unit.targetVocab || []).join(', ');
                          handleGenerate(
                            unitPrompt,
                            `Từ vựng trọng tâm: ${rawVocab}\nCâu mẫu: ${unit.sampleSentence}`,
                            unit.recommendedFormat,
                            unit.className || `Lớp ${unit.classId}`
                          );
                        }}
                        disabled={isGenerating}
                        className="w-full py-2 bg-vhouse-gold text-vhouse-dark hover:brightness-110 font-black text-xs rounded-xl shadow-duo-yellow flex items-center justify-center gap-1.5 active:scale-95 transition mt-2"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Sinh Đề 1-Chạm Từ Bài Này</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT PASSAGE */}
          {activeTab === 'document' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-vhouse-gold">
                    Dán giáo án hoặc bài đọc tiếng Anh (Reading Passage):
                  </label>
                  <label className="cursor-pointer text-xs text-vhouse-gold hover:underline font-bold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải tệp .txt / .doc</span>
                    <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                <textarea
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  placeholder="Dán đoạn văn bản bài đọc tiếng Anh vào đây. AI sẽ tự động phân tích ngữ pháp, tạo câu hỏi điền từ và đáp án chính xác..."
                  rows={6}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-vhouse-gold outline-none font-medium leading-relaxed"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => handleGenerate('Trắc nghiệm đọc hiểu văn bản')}
                  disabled={isGenerating || !documentInput.trim()}
                  className="px-6 py-3 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 active:translate-y-1 transition inline-flex items-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGenerating ? 'AI Đang Bóc Tách...' : 'Tạo Câu Hỏi Ngữ Cảnh Bằng AI'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RAW VOCABULARY LIST */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-vhouse-gold mb-1">
                  Dán danh sách từ vựng thô dạng "Từ: Nghĩa":
                </label>
                <p className="text-[11px] text-gray-400 mb-2">
                  Ví dụ: <code className="bg-gray-800 px-1 py-0.5 rounded text-vhouse-gold">sustainable: bền vững</code> hoặc <code className="bg-gray-800 px-1 py-0.5 rounded text-vhouse-gold">artificial intelligence - trí tuệ nhân tạo</code>.
                </p>
                <textarea
                  value={vocabInput}
                  onChange={(e) => setVocabInput(e.target.value)}
                  placeholder={`sustainable: bền vững\ninnovation: sự đổi mới\nautonomous: tự hành\nrenewable: tái tạo`}
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-vhouse-gold outline-none font-mono"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => handleGenerate('Kiểm tra từ vựng')}
                  disabled={isGenerating || !vocabInput.trim()}
                  className="px-6 py-3 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 active:translate-y-1 transition inline-flex items-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGenerating ? 'Đang Tạo Câu Hỏi...' : 'Biến Danh Sách Này Thành Game'}</span>
                </button>
              </div>
            </div>
          )}

          {/* RESULTS CARD */}
          {generatedResult && (
            <div className="p-4 sm:p-5 bg-gray-900/90 border-2 border-vhouse-gold rounded-2xl animate-bounce-short">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <h4 className="text-base font-black text-vhouse-gold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {generatedResult.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">{generatedResult.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {generatedResult.isGeminiLive && (
                    <span className="bg-purple-900/60 text-purple-300 text-xs font-black px-3 py-1 rounded-full border border-purple-500/40 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      Google Gemini Live
                    </span>
                  )}
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
                    {generatedResult.questions.length} câu đã sẵn sàng
                  </span>
                </div>
              </div>

              {/* Preview generated questions */}
              <div className="space-y-2.5 mt-3 max-h-52 overflow-y-auto pr-1">
                {generatedResult.questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-gray-800/80 rounded-xl text-xs border border-gray-700">
                    <div className="flex items-center justify-between text-gray-400 font-bold mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-vhouse-gold font-black">Câu {idx + 1} ({q.timeLimit}s)</span>
                        {q.type === 'blank' && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-black">
                            ✍️ ĐIỀN TỪ
                          </span>
                        )}
                        {q.type === 'true_false' && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-black">
                            ⚖️ ĐÚNG/SAI
                          </span>
                        )}
                        {q.type === 'scramble' && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black">
                            🧩 SẮP XẾP CÂU
                          </span>
                        )}
                        {(!q.type || q.type === 'choice') && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-black">
                            🔘 TRẮC NGHIỆM
                          </span>
                        )}
                      </div>
                      <span className="text-emerald-400 font-black">
                        {q.type === 'blank' ? 'Đáp án gõ: ' : 'Đáp án: '}
                        {q.correctAnswer || q.options?.find((o) => o.isCorrect)?.text}
                      </span>
                    </div>
                    <p className="font-bold text-white mb-1.5 leading-relaxed">{q.text}</p>
                    
                    {/* Image illustration preview */}
                    {q.image && (
                      <div className="my-2 flex items-center gap-3 bg-black/50 p-2 rounded-xl border border-gray-700/80">
                        <img
                          src={q.image}
                          alt="Minh họa AI"
                          className="h-14 w-24 object-cover rounded-lg border border-vhouse-gold/40 flex-shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="flex-1 overflow-hidden">
                          <span className="text-[10px] text-vhouse-gold font-bold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>Ảnh minh họa AI tự động</span>
                          </span>
                          <span className="text-[10px] text-gray-400 truncate block font-mono">
                            {q.image}
                          </span>
                        </div>
                      </div>
                    )}

                    {q.explanation && (
                      <p className="text-[11px] text-amber-200/90 bg-black/60 p-2 rounded-lg font-medium leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                {onOpenEditorWithQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenEditorWithQuiz(generatedResult);
                    }}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-vhouse-gold font-black text-xs rounded-xl border border-vhouse-gold/40 flex items-center gap-2 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>MỞ TRONG BỘ SOẠN THẢO (SỬA & TÙY BIẾN)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleConfirmAndUse}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition ml-auto"
                >
                  <span>ĐƯA VÀO LỚP DẠY NGAY (1-CLICK)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
