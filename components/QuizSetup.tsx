
import React from 'react';
import { QuizSettings, DigitType, QuizCategory, AbacusRule, MultiplicationLevel } from '../types';
import PMSLogo from './PMSLogo';

interface QuizSetupProps {
  onStart: (settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart }) => {
  const [settings, setSettings] = React.useState<QuizSettings>({
    category: 'addition',
    rule: 'standard',
    multLevel: '1x1',
    questionCount: 20,
    timePerQuestion: 3,
    digitType: 'single',
    rowCount: 6,
    enableAudio: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(settings);
  };

  const addRules: { id: AbacusRule; label: string; desc: string }[] = [
    { id: 'standard', label: 'Basic', desc: 'Direct' },
    { id: 'small-friends', label: 'Small Fr.', desc: '±5' },
    { id: 'big-friends', label: 'Big Fr.', desc: '±10' },
    { id: 'mixed-friends', label: 'Mixed', desc: 'Family' },
  ];

  const multLevels: { id: MultiplicationLevel; label: string; desc: string }[] = [
    { id: '1x1', label: '1 x 1', desc: 'Basic' },
    { id: '2x1', label: '2 x 1', desc: 'Inter' },
    { id: '3x1', label: '3 x 1', desc: 'Adv' },
    { id: '2x2', label: '2 x 2', desc: 'Expert' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mt-4 border border-slate-100">
      <div className="bg-orange-600 px-8 py-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500 rounded-full opacity-20" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-400 rounded-full opacity-10" />
        
        <div className="relative z-10 flex flex-col items-center">
          <PMSLogo size={70} className="mb-2" />
          <h1 className="text-lg font-black tracking-tighter uppercase text-center">
            Abacus Competition
          </h1>
          <span className="text-[0.6rem] font-bold text-orange-200 uppercase tracking-[0.2em]">Safya Home Branch</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div>
          <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Competition Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {(['addition', 'multiplication'] as QuizCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSettings({ ...settings, category: cat })}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                  settings.category === cat
                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                    : 'border-slate-100 text-slate-400 grayscale hover:grayscale-0'
                }`}
              >
                <span className="text-[0.65rem] font-black uppercase tracking-widest">
                  {cat === 'addition' ? 'Addition' : 'Multiply'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {settings.category === 'addition' ? (
          <div>
            <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Abacus Logic</label>
            <div className="grid grid-cols-4 gap-2">
              {addRules.map((rule) => (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, rule: rule.id })}
                  className={`flex flex-col p-2 rounded-xl border-2 transition-all text-center ${
                    settings.rule === rule.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-slate-100'
                  }`}
                >
                  <span className={`text-[0.6rem] font-black ${settings.rule === rule.id ? 'text-orange-600' : 'text-slate-700'}`}>
                    {rule.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Level</label>
            <div className="grid grid-cols-4 gap-2">
              {multLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, multLevel: lvl.id })}
                  className={`flex flex-col p-2 rounded-xl border-2 transition-all text-center ${
                    settings.multLevel === lvl.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-slate-100'
                  }`}
                >
                  <span className={`text-[0.6rem] font-black ${settings.multLevel === lvl.id ? 'text-orange-600' : 'text-slate-700'}`}>
                    {lvl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Quantity</label>
            <select
              value={settings.questionCount}
              onChange={(e) => setSettings({ ...settings, questionCount: parseInt(e.target.value) })}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
            >
              {[5, 10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n} Questions</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Digits</label>
            <select
              value={settings.digitType}
              onChange={(e) => setSettings({ ...settings, digitType: e.target.value as DigitType })}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs capitalize outline-none"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {settings.category === 'addition' && (
          <div>
            <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Rows (Operations)</label>
            <div className="flex flex-wrap gap-2">
              {[3, 5, 7, 10, 15, 20].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSettings({ ...settings, rowCount: r })}
                  className={`flex-1 min-w-[3rem] py-2 rounded-lg font-black text-[0.65rem] border-2 transition-all ${
                    settings.rowCount === r 
                      ? 'border-orange-600 text-orange-600 bg-orange-50' 
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Pace (Seconds)</label>
            <span className="text-orange-600 font-black text-sm">{settings.timePerQuestion}s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={settings.timePerQuestion}
            onChange={(e) => setSettings({ ...settings, timePerQuestion: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[0.6rem] font-black text-slate-700 uppercase tracking-widest">Voice Over</span>
            <span className="text-[0.5rem] text-slate-400 font-bold uppercase">AI Narration</span>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, enableAudio: !settings.enableAudio })}
            className={`w-10 h-5 rounded-full transition-colors relative ${settings.enableAudio ? 'bg-orange-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.enableAudio ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-orange-100 transition-all transform active:scale-95 uppercase tracking-[0.2em] text-xs"
        >
          Begin Competition
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;
