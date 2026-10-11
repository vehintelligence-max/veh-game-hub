import React, { useState, useEffect } from 'react';
import { Volume2, X, Check, Play, Settings, Sparkles, ShieldCheck, Sliders, Radio } from 'lucide-react';
import { speech } from '../utils/speech';
import { sound } from '../utils/sound';

export default function VoiceSettingsModal({ isOpen, onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(0.93);
  const [autoRead, setAutoRead] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const list = speech.getEnglishVoices();
    setVoices(list);

    const savedVoice = speech.getPreferredVoice();
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    } else {
      const best = speech.pickBestVoice('en-US');
      if (best) setSelectedVoice(best.name);
    }

    setRate(speech.getRate());
    setAutoRead(speech.isAutoReadEnabled());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = (voiceName = selectedVoice) => {
    sound.playClick();
    setIsPlayingTest(true);
    speech.testVoice(voiceName);
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 2500);
  };

  const handleSelectVoice = (name) => {
    setSelectedVoice(name);
    speech.setPreferredVoice(name);
    handleTestVoice(name);
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    speech.setRate(newRate);
  };

  const handleToggleAutoRead = () => {
    const newVal = !autoRead;
    setAutoRead(newVal);
    speech.setAutoRead(newVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1C2024] border-2 border-vhouse-gold/70 rounded-3xl w-full max-w-2xl my-6 p-5 sm:p-7 shadow-2xl relative text-white max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vhouse-gold text-vhouse-dark rounded-xl flex items-center justify-center shadow-duo-yellow font-black">
              <Volume2 className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-vhouse-gold font-display flex items-center gap-2">
                BỘ VOICE GOOGLE & PHÁT ÂM TIẾNG ANH
              </h3>
              <p className="text-xs text-gray-400">
                Tối ưu giọng đọc tự nhiên, chuẩn bản xứ dành riêng cho giáo viên V English House
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {/* Google Voice Priority Badge */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                Đã Kích Hoạt Bộ Voice Google & Khử Triệt Để Giọng Robot
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Hệ thống tự động ưu tiên giọng đọc <strong className="text-vhouse-gold">Google US / Google UK English</strong> ấm áp, rõ nguyên âm và chuẩn trọng âm. Đã loại trừ hoàn toàn các giọng đọc kim loại, âm méo hoặc giọng biến dạng hệ thống.
              </p>
            </div>
          </div>

          {/* Voice Selection List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase text-vhouse-gold flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Chọn Giọng Đọc Bản Xứ:</span>
              </label>
              <button
                type="button"
                onClick={() => handleTestVoice()}
                className={`text-xs px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition ${
                  isPlayingTest
                    ? 'bg-amber-400 text-vhouse-dark animate-pulse'
                    : 'bg-vhouse-gold text-vhouse-dark shadow-duo-yellow hover:brightness-110'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingTest ? 'Đang phát mẫu...' : 'Nghe Thử Ngay'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {voices.length === 0 ? (
                <div className="p-4 bg-gray-900 rounded-xl text-center text-xs text-gray-400">
                  Đang tải danh sách giọng đọc từ trình duyệt...
                </div>
              ) : (
                voices.map((v) => {
                  const isSelected = selectedVoice === v.name;
                  const isGoogle = v.name.includes('Google');
                  const isNatural = v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Samantha');

                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => handleSelectVoice(v.name)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-vhouse-gold/15 border-vhouse-gold shadow-md'
                          : 'bg-gray-900/90 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-vhouse-gold bg-vhouse-gold' : 'border-gray-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-vhouse-dark" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${isSelected ? 'text-vhouse-gold' : 'text-white'}`}>
                              {v.name}
                            </span>
                            {isGoogle && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                                ⭐ Google Voice
                              </span>
                            )}
                            {isNatural && !isGoogle && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                                Natural
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">{v.lang}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestVoice(v.name);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-vhouse-gold transition"
                          title="Nghe thử giọng này"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Speech Rate (Tốc độ đọc) */}
          <div className="bg-gray-900/70 p-4 rounded-2xl border border-gray-800">
            <label className="text-xs font-black uppercase text-gray-300 block mb-2">
              Tốc Độ Giọng Đọc Sư Phạm:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '0.8x (Chậm - Kids A01)', val: 0.8 },
                { label: '0.93x (Khuyên Dùng)', val: 0.93 },
                { label: '1.0x (Tự Nhiên)', val: 1.0 },
                { label: '1.15x (IELTS)', val: 1.15 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleRateChange(item.val)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-black border transition ${
                    Math.abs(rate - item.val) < 0.05
                      ? 'bg-vhouse-gold text-vhouse-dark border-vhouse-gold shadow-duo-yellow'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-read Toggle */}
          <div className="bg-gray-900/70 p-4 rounded-2xl border border-gray-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-white block">
                Tự Động Phát Âm Khi Chuyển Câu Hỏi
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Khi tắt (mặc định), giáo viên hoặc học sinh chỉ cần bấm nút Loa khi muốn nghe để không bị bất ngờ phát tiếng.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleAutoRead}
              className={`w-12 h-6 rounded-full transition relative p-0.5 flex-shrink-0 ${
                autoRead ? 'bg-vhouse-gold' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-vhouse-dark transition transform ${
                  autoRead ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-gray-400">
            Giọng đọc được lưu tự động trên trình duyệt.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-vhouse-gold text-vhouse-dark font-black text-xs rounded-xl shadow-duo-yellow hover:brightness-110 active:translate-y-1 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Xong & Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
