
import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizSettings, QuizStatus } from '../types';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

interface QuizRunnerProps {
  questions: Question[];
  settings: QuizSettings;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ questions, settings, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const [status, setStatus] = useState<QuizStatus>('idle'); // Start in idle for 'Get Ready'
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());

  const currentQuestion = questions[currentIndex];

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Prefetching Logic for both Question and Answer
  useEffect(() => {
    const prefetch = async () => {
      const ctx = initAudio();
      
      // Prefetch up to 5 questions ahead
      const limit = Math.min(questions.length, currentIndex + 5);
      
      for (let i = currentIndex; i < limit; i++) {
        const q = questions[i];
        
        // Fetch Question Audio
        if (!audioCache.current.has(`${q.id}_question`)) {
          let text = "";
          if (q.category === 'addition') {
            text = q.rows.map(r => (r > 0 ? `plus ${r}` : `minus ${Math.abs(r)}`)).join(", ");
          } else {
            text = `${q.rows[0]} times ${q.rows[1]}`;
          }

          try {
            const base64 = await generateSpeech(text);
            if (base64) {
              const decoded = decodeBase64(base64);
              const buffer = await decodeAudioData(decoded, ctx);
              audioCache.current.set(`${q.id}_question`, buffer);
            }
          } catch (e) {
            console.error("Question Prefetch failed", q.id, e);
          }
        }

        // Fetch Answer Audio
        if (!audioCache.current.has(`${q.id}_answer`)) {
          const answerText = `Answer is ${q.answer}`;
          try {
            const base64 = await generateSpeech(answerText);
            if (base64) {
              const decoded = decodeBase64(base64);
              const buffer = await decodeAudioData(decoded, ctx);
              audioCache.current.set(`${q.id}_answer`, buffer);
            }
          } catch (e) {
            console.error("Answer Prefetch failed", q.id, e);
          }
        }

        // Buffer status update
        if (i === currentIndex && audioCache.current.has(`${currentIndex === questions.length ? '' : questions[i].id}_question`)) {
          setIsBuffering(false);
        }
      }
    };

    prefetch();
  }, [currentIndex, questions]);

  // Handle Start (after Get Ready)
  const startQuiz = () => {
    setStatus('running');
    playAudioById(`${currentQuestion.id}_question`);
  };

  const playAudioById = (id: string) => {
    if (!settings.enableAudio || !audioContextRef.current) return;
    const buffer = audioCache.current.get(id);
    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  };

  // Timer Logic
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 0.1;
          return next <= 0 ? 0 : next;
        });
      }, 100);
    } else if (timeLeft <= 0 && status === 'running') {
      setIsTimeUp(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, timeLeft]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setStatus('paused'); 
    playAudioById(`${currentQuestion.id}_answer`);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(settings.timePerQuestion);
      setShowAnswer(false);
      setIsTimeUp(false);
      setStatus('running');
      
      // Play question audio immediately
      playAudioById(`${questions[nextIdx].id}_question`);
    } else {
      setStatus('finished');
      onComplete(0);
    }
  };

  const togglePause = () => {
    setStatus((prev) => (prev === 'running' ? 'paused' : 'running'));
  };

  const getFontSize = () => {
    if (currentQuestion.category === 'multiplication') return 'text-5xl';
    const rowCount = currentQuestion.rows.length;
    if (rowCount > 15) return 'text-xl';
    if (rowCount > 10) return 'text-2xl';
    if (rowCount > 7) return 'text-3xl';
    if (rowCount > 5) return 'text-4xl';
    return 'text-5xl';
  };

  const progressPercentage = (timeLeft / settings.timePerQuestion) * 100;

  if (status === 'idle') {
    return (
      <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col items-center justify-center bg-white text-center">
        <div className="mb-8 relative">
           <div className="w-32 h-32 border-8 border-orange-100 border-t-orange-600 rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-orange-600">
             Ready
           </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Preparing Quiz</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Synchronizing AI Voice & Timer</p>
        
        <button
          disabled={isBuffering}
          onClick={startQuiz}
          className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
            isBuffering 
              ? 'bg-slate-100 text-slate-300 shadow-none' 
              : 'bg-orange-600 text-white shadow-orange-100 hover:scale-105 active:scale-95'
          }`}
        >
          {isBuffering ? 'Buffering Audio...' : 'Start Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-3 flex flex-col min-h-screen max-h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pt-1 shrink-0">
        <button 
          onClick={onExit} 
          className="bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg font-black flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest transition-all active:scale-95 shadow-sm border border-slate-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Quit
        </button>

        <div className="flex items-center gap-3 text-right">
             <div className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Question</div>
             <div className="text-[0.65rem] font-black text-orange-600 tabular-nums">{currentIndex + 1} / {questions.length}</div>
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              timeLeft <= 1 ? 'bg-red-500' : 'bg-orange-600'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={`text-[0.7rem] font-black tabular-nums w-10 text-right ${timeLeft <= 1 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className={`flex-1 flex flex-col bg-white rounded-[2rem] shadow-xl p-5 border border-slate-100 transition-all duration-500 overflow-hidden ${status === 'paused' && !showAnswer ? 'opacity-20 scale-[0.98] blur-sm' : 'opacity-100 scale-100'}`}>
          <div className="flex-1 flex flex-col min-h-0">
            {/* Rows Indicator */}
            {currentQuestion.category === 'addition' && (
              <div className="flex justify-center mb-2 shrink-0">
                <span className="bg-orange-50 text-orange-600 text-[0.6rem] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-orange-100">
                  {currentQuestion.rows.length} Rows
                </span>
              </div>
            )}
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto no-scrollbar py-2">
              {currentQuestion.category === 'addition' ? (
                <div className="flex flex-col items-center space-y-0.5 w-full">
                  {currentQuestion.rows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 w-full justify-center">
                      <span className="text-[0.5rem] font-black text-slate-300 tabular-nums w-4 text-right">{idx + 1}.</span>
                      <div className={`abacus-font ${getFontSize()} font-black text-slate-800 tabular-nums leading-[1.05]`}>
                        {row > 0 ? `+${row}` : row}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center gap-4 w-full text-center">
                  <span className={`abacus-font ${getFontSize()} font-black text-slate-800 tabular-nums`}>{currentQuestion.rows[0]}</span>
                  <span className="text-3xl font-black text-orange-400">×</span>
                  <span className={`abacus-font ${getFontSize()} font-black text-slate-800 tabular-nums`}>{currentQuestion.rows[1]}</span>
                </div>
              )}
            </div>

            <div className="w-full border-t-[6px] border-slate-900 rounded-full my-3 shrink-0 opacity-90 shadow-sm" />
            
            <div className="h-24 flex flex-col items-center justify-center shrink-0">
              {showAnswer ? (
                <div className="text-center animate-in fade-in zoom-in duration-300">
                  <span className="text-[0.55rem] font-black text-orange-500 uppercase tracking-[0.3em] block mb-0.5">Correct Answer</span>
                  <div className="text-6xl font-black text-orange-600 abacus-font drop-shadow-md leading-none">
                    {currentQuestion.answer}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 opacity-25">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
                   </div>
                   <div className="text-[0.55rem] font-black text-slate-500 uppercase tracking-[0.2em]">
                     {isTimeUp ? "TIME EXPIRED" : "CALCULATING"}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {status === 'paused' && !showAnswer && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button 
                onClick={togglePause}
                className="bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(234,88,12,0.3)] transform transition-transform active:scale-95 uppercase tracking-widest"
              >
                RESUME
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 py-4 shrink-0">
        {!showAnswer ? (
          <>
            <button
              onClick={togglePause}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest transition-all text-[0.65rem] border-2 ${
                status === 'paused' 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' 
                  : 'bg-white text-slate-400 border-slate-100'
              }`}
            >
              {status === 'paused' ? 'Go' : 'Pause'}
            </button>
            <button
              onClick={handleShowAnswer}
              className="bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] shadow-xl shadow-orange-100 transition-all active:scale-95"
            >
              Show Answer
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizRunner;
