
import React, { useState, useEffect } from 'react';
import QuizSetup from './components/QuizSetup';
import QuizRunner from './components/QuizRunner';
import PMSLogo from './components/PMSLogo';
import { QuizSettings, Question } from './types';
import { generateQuizSet } from './utils/mathGenerator';
import { getMathTip } from './services/geminiService';

type View = 'setup' | 'quiz' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('setup');
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    const fetchTip = async () => {
      const newTip = await getMathTip('abacus mental math and multiplication');
      setTip(newTip);
    };
    fetchTip();
  }, []);

  const handleStartQuiz = (newSettings: QuizSettings) => {
    const quizSet = generateQuizSet({
      category: newSettings.category,
      rule: newSettings.rule,
      multLevel: newSettings.multLevel,
      count: newSettings.questionCount,
      rowCount: newSettings.rowCount,
      digitType: newSettings.digitType
    });
    setSettings(newSettings);
    setQuestions(quizSet);
    setView('quiz');
  };

  const handleComplete = () => {
    setView('results');
  };

  const resetQuiz = () => {
    setView('setup');
    setSettings(null);
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 overflow-x-hidden">
      {view === 'setup' && (
        <div className="pb-20 px-4 sm:px-0">
          <QuizSetup onStart={handleStartQuiz} />
          <div className="max-w-md mx-auto px-2 mt-8">
            <div className="bg-orange-50 border border-orange-100 p-5 rounded-[2rem]">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-orange-800 font-black text-[0.65rem] uppercase tracking-widest">Nadia Malik's Insight</h4>
                  <p className="text-orange-600 text-sm italic mt-1 leading-relaxed font-bold">
                    "{tip || 'Ready to master the abacus today?'}"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-slate-300 font-black text-[0.6rem] uppercase tracking-[0.3em]">
              Official Branch App
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && settings && (
        <QuizRunner
          questions={questions}
          settings={settings}
          onComplete={handleComplete}
          onExit={resetQuiz}
        />
      )}

      {view === 'results' && (
        <div className="max-w-md mx-auto p-6 mt-12 text-center">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
            <div className="mb-8">
              <PMSLogo size={100} className="mx-auto" />
            </div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-1 uppercase tracking-tight">Success!</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[0.6rem] mb-10">Competition complete</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="text-3xl font-black text-slate-800 tabular-nums">{questions.length}</div>
                <div className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mt-1">Questions</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="text-3xl font-black text-slate-800 tabular-nums">{settings?.timePerQuestion}s</div>
                <div className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mt-1">Speed</div>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-orange-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-sm"
            >
              Restart Session
            </button>
            
            <div className="mt-6 text-[0.6rem] text-slate-300 font-bold uppercase tracking-widest">
              Nadia Malik • PMS Safya Home
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
