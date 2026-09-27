import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Key, Map as MapIcon, Grid, Sparkles, Volume2, VolumeX, Maximize, 
  ArrowRight, CheckCircle2, XCircle, Users, Clock, HelpCircle, 
  Play, Award, RotateCcw, Zap, Target, Crown, Eye, Shield, BookOpen, Compass, PhoneCall, RefreshCw, PlusCircle
} from 'lucide-react';

export default function NationalDayPortal() {
  const [isMuted, setIsMuted] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // --- إعدادات لعبة "من سيربح المليون" ---
  const [teams, setTeams] = useState([
    { id: 1, name: 'فريق صقور الوطن', score: 0 },
    { id: 2, name: 'فريق فرسان المجد', score: 0 }
  ]);
  const [customTime, setCustomTime] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const masterQuestions = [
    { question: "في أي عام تم إعلان توحيد المملكة العربية السعودية وتسميتها باسمها المجيد؟", options: ["1332 هـ", "1351 هـ", "1375 هـ", "1400 هـ"], correct: 1 },
    { question: "ما هو شعار المملكة العربية السعودية الرسمي المعبر عن النماء والعدل؟", options: ["اشجار وبحر", "سيفان ونخلة", "صقر وعلم", "جمل ونخلة"], correct: 1 },
    { question: "أي من هذه المدن تعد العاصمة الإدارية والسياسية للمملكة؟", options: ["مكة المكرمة", "المدينة المنورة", "الرياض", "جدة"], correct: 2 },
    { question: "ما هو العام المستهدف لتحقيق مستهدفات الرؤية السعودية الملهمة؟", options: ["2025 م", "2030 م", "2035 م", "2040 م"], correct: 1 },
    { question: "ما هو اسم الصحراء الكبرى التي تقع في جنوب شرق المملكة؟", options: ["الربع الخالي", "صحراء النفود", "صحراء الدهناء", "صحراء سكاكا"], correct: 0 },
    { question: "ما هي الدولة التي تحد المملكة العربية السعودية من جهة الغرب؟", options: ["القطر", "البحر الأحمر", "العراق", "سلطنة عمان"], correct: 1 }
  ];

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // وسائل المساعدة
  const [lifelines, setLifelines] = useState({
    fiftyFifty: false,
    phone: false,
    changeQ: false,
    addTime: false
  });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [ lifelineModal, setLifelineModal ] = useState({ show: false, text: '' });

  // --- مسابقة السرعة ---
  const [lightningIndex, setLightningIndex] = useState(0);
  const [lightningScore, setLightningScore] = useState(0);
  const [lightningFinished, setLightningFinished] = useState(false);
  const lightningQuestions = [
    { q: "علم المملكة العربية السعودية لونه أخضر بالكامل.", ans: true },
    { q: "تأسست الدرعية كمهد أول للدولة السعودية الأولى.", ans: true },
    { q: "تقع العاصمة الرياض على ساحل البحر الأحمر.", ans: false },
    { q: "رؤية المملكة الطموحة تستهدف عام 2030م.", ans: true }
  ];

  // --- المعرض الملكي التفاعلي ---
  const royalQuizData = [
    {
      title: "المؤسس والبطل",
      description: "بطل التوحيد ومؤسس المملكة العربية السعودية الحديثة. أرسى قواعد الأمن والعدل، وجمع قلوب أبناء الوطن تحت راية التوحيد.",
      correctIndex: 0
    },
    {
      title: "رائد التعليم والنظام",
      description: "شهد عهده تأسيس العديد من الوزارات الكبرى، والجامعة الأولى في المملكة (جامعة الملك سعود)، وتوسعة الحرمين الشريفين.",
      correctIndex: 1
    },
    {
      title: "بطل التنمية والدبلوماسية",
      description: "قاد خطط التنمية الاقتصادية الأولى، وعُرف بمواقفه التاريخية الشجاعة وحكمته العميقة في السياسة الدولية.",
      correctIndex: 2
    },
    {
      title: "رائد التوسعة الكبرى",
      description: "حمل لقب خادم الحرمين الشريفين، وشهد عصره أكبر توسعة تاريخية للمسجد الحرام والمسجد النبوي الشريف.",
      correctIndex: 3
    },
    {
      title: "ملك الإنسانية",
      description: "عُرف بملك الإنسانية، وأطلق أضخم برنامج لابتعاث الطلاب والطالبات للخارج، وأنشأ جامعة الملك عبدالله للعلوم والتقنية (كاوست).",
      correctIndex: 4
    },
    {
      title: "ملك الحزم والعزم",
      description: "قائد مسيرة العطاء والازدهار الحالية، يتميز بالحزم والعزم لحماية أمن الوطن وصاحب الرؤية الثاقبة.",
      correctIndex: 5
    },
    {
      title: "مهندس الرؤية والمستقبل",
      description: "مهندس رؤية السعودية 2030، وقائد التغيير والابتكار التقني والاقتصادي العالمي من خلال مشاريع عملاقة مثل نيوم والقدية.",
      correctIndex: 6
    }
  ];

  const allRoyalImages = [
    { name: "الملك عبدالعزيز", image: "/src/assets/kingabduaziz.JPG" },
    { name: "الملك سعود", image: "/src/assets/kingsaud.JPG" },
    { name: "الملك فيصل", image: "/src/assets/kingfaisal.JPG" },
    { name: "الملك فهد", image: "/src/assets/kingfahad.JPG" },
    { name: "الملك عبدالله", image: "/src/assets/kingabdullah.JPG" },
    { name: "الملك سلمان", image: "/src/assets/kingsalman.JPG" },
    { name: "الأمير محمد بن سلمان", image: "/src/assets/MBS.JPG" }
  ];

  const [currentRoyalQuizIndex, setCurrentRoyalQuizIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedRoyalChoice, setSelectedRoyalChoice] = useState(null);
  const [isRoyalAnswered, setIsRoyalAnswered] = useState(false);
  const [royalScore, setRoyalScore] = useState(0);
  const [royalQuizFinished, setRoyalQuizFinished] = useState(false);

  const loadNewRoyalQuestion = (index) => {
    const currentQ = royalQuizData[index];
    const correctImageObj = { ...allRoyalImages[currentQ.correctIndex], originalIndex: currentQ.correctIndex };
    
    const wrongImages = allRoyalImages
      .map((item, idx) => ({ ...item, originalIndex: idx }))
      .filter(item => item.originalIndex !== currentQ.correctIndex)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctImageObj, ...wrongImages].sort(() => 0.5 - Math.random());
    setShuffledOptions(options);
    setSelectedRoyalChoice(null);
    setIsRoyalAnswered(false);
  };

  const startRoyalQuiz = () => {
    setCurrentRoyalQuizIndex(0);
    setRoyalScore(0);
    setRoyalQuizFinished(false);
    loadNewRoyalQuestion(0);
  };

  const handleRoyalChoiceClick = (option) => {
    if (isRoyalAnswered) return;
    setSelectedRoyalChoice(option.originalIndex);
    setIsRoyalAnswered(true);

    const currentQ = royalQuizData[currentRoyalQuizIndex];
    if (option.originalIndex === currentQ.correctIndex) {
      playTone('speed_correct');
      setRoyalScore(prev => prev + 100);
    } else {
      playTone('wrong');
    }
  };

  const nextRoyalQuestion = () => {
    if (currentRoyalQuizIndex + 1 < royalQuizData.length) {
      const nextIdx = currentRoyalQuizIndex + 1;
      setCurrentRoyalQuizIndex(nextIdx);
      loadNewRoyalQuestion(nextIdx);
    } else {
      setRoyalQuizFinished(true);
      playTone('win');
    }
  };

  // --- الذاكرة الوطنية ---
  const initialMemoryCards = [
    { id: 1, name: "🇸🇦", matched: false }, { id: 2, name: "🌴", matched: false },
    { id: 3, name: "⚔️", matched: false }, { id: 4, name: "🦅", matched: false },
    { id: 5, name: "🐪", matched: false }, { id: 6, name: "⭐", matched: false },
    { id: 7, name: "🇸🇦", matched: false }, { id: 8, name: "🌴", matched: false },
    { id: 9, name: "⚔️", matched: false }, { id: 10, name: "🦅", matched: false },
    { id: 11, name: "🐪", matched: false }, { id: 12, name: "⭐", matched: false }
  ];
  const [memoryCards, setMemoryCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [memoryMatches, setMemoryMatches] = useState(0);

  const startMemoryGame = () => {
    const shuffledCards = [...initialMemoryCards].sort(() => Math.random() - 0.5).map(c => ({ ...c, uniqueId: Math.random() }));
    setMemoryCards(shuffledCards);
    setFirstChoice(null); setSecondChoice(null); setMemoryMatches(0);
  };

  const handleCardClick = (card) => {
    if (isChecking || card.matched || card === firstChoice) return;
    playTone('memory_tick');
    if (!firstChoice) {
      setFirstChoice(card);
    } else {
      setSecondChoice(card);
      setIsChecking(true);
      if (firstChoice.name === card.name) {
        playTone('memory_match');
        setMemoryCards(prev => prev.map(c => c.name === card.name ? { ...c, matched: true } : c));
        setMemoryMatches(prev => prev + 1);
        resetTurn();
      } else {
        playTone('wrong');
        setTimeout(() => resetTurn(), 1000);
      }
    }
  };

  const resetTurn = () => { setFirstChoice(null); setSecondChoice(null); setIsChecking(false); };

  const playTone = (type) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'millionaire_correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'speed_correct') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'tick') {
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        if (timeLeft <= 10) {
          playTone('tick');
        }
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && isGameRunning) {
      setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
      setTimeLeft(customTime);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerRunning, timeLeft, isAnswered, isGameRunning]);

  const startMillionaire = () => {
    const shuffled = [...masterQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 5));
    setIsGameRunning(true);
    setIsGameOver(false);
    setCurrentQuestionIndex(0);
    setCurrentTeamIndex(0);
    setTimeLeft(customTime);
    setTimerRunning(true);
    setIsAnswered(false);
    setSelectedOption(null);
    setHiddenOptions([]);
    setLifelines({ fiftyFifty: false, phone: false, changeQ: false, addTime: false });
    setTeams(teams.map(t => ({ ...t, score: 0 })));
  };

  const handleSelectOption = (idx) => {
    if (isAnswered || hiddenOptions.includes(idx)) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setTimerRunning(false);

    if (idx === activeQuestions[currentQuestionIndex].correct) {
      playTone('millionaire_correct');
      setTeams(prev => prev.map((team, i) => i === currentTeamIndex ? { ...team, score: team.score + 100 } : team));
    } else {
      playTone('wrong');
    }
  };

  const handleNextTurn = () => {
    if (currentQuestionIndex + 1 >= activeQuestions.length) {
      setIsGameOver(true);
      setIsGameRunning(false);
      playTone('win');
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setHiddenOptions([]);
      setTimeLeft(customTime);
      setTimerRunning(true);
      setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // وسائل المساعدة التنفيذية
  const useFiftyFifty = () => {
    if (lifelines.fiftyFifty || isAnswered) return;
    const currentQ = activeQuestions[currentQuestionIndex];
    const correctIdx = currentQ.correct;
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== correctIdx);
    
    // إخفاء إجابتين خطأ عشوائياً
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffledWrong[0], shuffledWrong[1]]);
    setLifelines(prev => ({ ...prev, fiftyFifty: true }));
  };

  const usePhone = () => {
    if (lifelines.phone || isAnswered) return;
    const currentQ = activeQuestions[currentQuestionIndex];
    const correctText = currentQ.options[currentQ.correct];
    setLifelineModal({ show: true, text: `الصديق الخبير يقول: "أنا متأكد بنسبة كبيرة أن الإجابة الصحيحة هي: (${correctText})"` });
    setLifelines(prev => ({ ...prev, phone: true }));
  };

  const useChangeQuestion = () => {
    if (lifelines.changeQ || isAnswered) return;
    // جلب سؤال بديل
    const remaining = masterQuestions.filter(q => !activeQuestions.includes(q));
    if (remaining.length > 0) {
      const newQ = remaining[0];
      const updated = [...activeQuestions];
      updated[currentQuestionIndex] = newQ;
      setActiveQuestions(updated);
      setHiddenOptions([]);
      setSelectedOption(null);
    }
    setLifelines(prev => ({ ...prev, changeQ: true }));
  };

  const useAddTime = () => {
    if (lifelines.addTime || isAnswered) return;
    setTimeLeft(prev => prev + 30);
    setLifelines(prev => ({ ...prev, addTime: true }));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // ==========================
  // 1. مسابقة السرعة
  // ==========================
  if (activeGame === 'escape_room') {
    const currentL = lightningQuestions[lightningIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans p-6 select-none flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full bg-blue-900/40 border border-blue-700/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
          <button onClick={() => { setActiveGame(null); setLightningIndex(0); setLightningScore(0); setLightningFinished(false); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer">
            <ArrowRight className="w-5 h-5" /><span>خروج للرئيسية</span>
          </button>
          <h2 className="text-xl font-bold text-amber-300">مسابقة السرعة البرقية ⚡</h2>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-blue-800/60 rounded-xl cursor-pointer">
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-blue-300" />}
          </button>
        </header>

        <main className="max-w-xl mx-auto w-full my-auto bg-blue-900/20 border-2 border-blue-500/40 p-8 rounded-3xl backdrop-blur-md shadow-2xl text-center">
          {!lightningFinished ? (
            <div>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-bold">
                السؤال {lightningIndex + 1} من {lightningQuestions.length} | النقاط: {lightningScore}
              </span>
              <h3 className="text-2xl font-black text-white my-8 leading-relaxed">"{currentL.q}"</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { if(currentL.ans){ playTone('speed_correct'); setLightningScore(s=>s+100); } else { playTone('wrong'); } if(lightningIndex+1 < lightningQuestions.length) setLightningIndex(i=>i+1); else setLightningFinished(true); }} className="p-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl cursor-pointer">صح ✔️</button>
                <button onClick={() => { if(!currentL.ans){ playTone('speed_correct'); setLightningScore(s=>s+100); } else { playTone('wrong'); } if(lightningIndex+1 < lightningQuestions.length) setLightningIndex(i=>i+1); else setLightningFinished(true); }} className="p-5 bg-red-900/80 hover:bg-red-800 text-white font-black text-xl rounded-2xl cursor-pointer">خطأ ❌</button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in py-6">
              <h3 className="text-3xl font-black text-amber-300 mb-2">أنهيت مسابقة السرعة! ⚡</h3>
              <p className="text-slate-200 font-bold text-lg mb-6">مجموع النقاط: {lightningScore}</p>
              <button onClick={() => { setLightningIndex(0); setLightningScore(0); setLightningFinished(false); }} className="px-8 py-3 bg-amber-500 text-slate-950 font-black rounded-2xl cursor-pointer">لعبة جديدة 🔄</button>
            </div>
          )}
        </main>
        <footer className="text-center text-slate-500 text-xs pb-2"><p>مسابقة السرعة</p></footer>
      </div>
    );
  }

  // ==========================
  // 2. المعرض الملكي التفاعلي
  // ==========================
  if (activeGame === 'board_game') {
    if (shuffledOptions.length === 0) startRoyalQuiz();

    const currentQ = royalQuizData[currentRoyalQuizIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 text-white font-sans p-6 select-none flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full bg-amber-950/40 border border-amber-700/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
          <button onClick={() => setActiveGame(null)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer hover:bg-amber-400 transition">
            <ArrowRight className="w-5 h-5" /><span>العودة للرئيسية</span>
          </button>
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-amber-300">تحدي القادة والملوك 👑</h2>
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-amber-900/60 rounded-xl cursor-pointer">
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
          </button>
        </header>

        <main className="max-w-4xl mx-auto w-full my-auto bg-amber-950/30 border-2 border-amber-500/40 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center">
          {!royalQuizFinished ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full border border-amber-500/30 font-bold">
                  السؤال {currentRoyalQuizIndex + 1} من {royalQuizData.length}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-900/40 px-4 py-1.5 rounded-full border border-amber-700">
                  النقاط: {royalScore}
                </span>
              </div>

              <div className="bg-amber-950/60 border border-amber-700/50 p-6 rounded-2xl mb-8">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">من هو الملك أو القائد المعني بهذه الإنجازات؟</h3>
                <p className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
                  "{currentQ.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {shuffledOptions.map((opt, idx) => {
                  let ringStyle = "border-amber-900/60 hover:border-amber-400 hover:scale-102";
                  if (isRoyalAnswered) {
                    if (opt.originalIndex === currentQ.correctIndex) {
                      ringStyle = "border-4 border-emerald-500 bg-emerald-950/60 shadow-lg scale-105";
                    } else if (opt.originalIndex === selectedRoyalChoice) {
                      ringStyle = "border-4 border-red-500 bg-red-950/60 opacity-60";
                    } else {
                      ringStyle = "opacity-40 border-slate-800";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleRoyalChoiceClick(opt)}
                      disabled={isRoyalAnswered}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 h-48 md:h-56 shadow-xl flex flex-col items-center justify-center ${ringStyle}`}
                    >
                      <img src={opt.image} alt="صورة قائد" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-40"></div>
                      {isRoyalAnswered && opt.originalIndex === currentQ.correctIndex && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {isRoyalAnswered && (
                <div className="animate-fade-in">
                  <button onClick={nextRoyalQuestion} className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl cursor-pointer shadow-lg transition">
                    السؤال التالي ➡️
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in py-8">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-black text-amber-300 mb-2">أنهيت التحدي بنجاح! 👑</h3>
              <p className="text-slate-200 font-bold text-lg mb-6">مجموع النقاط: {royalScore} من {royalQuizData.length * 100}</p>
              <button onClick={startRoyalQuiz} className="px-8 py-3.5 bg-amber-500 text-slate-950 font-black rounded-2xl cursor-pointer shadow-lg">إعادة التحدي 🔄</button>
            </div>
          )}
        </main>
        <footer className="text-center text-slate-500 text-xs pb-2"><p>تحدي المعرض الملكي بالصور</p></footer>
      </div>
    );
  }

  // ==========================
  // 3. من سيربح المليون
  // ==========================
  if (activeGame === 'millionaire') {
    const currentTeam = teams[currentTeamIndex];
    const winningTeam = [...teams].sort((a, b) => b.score - a.score)[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white font-sans p-6 select-none flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
          <button onClick={() => { setActiveGame(null); setIsGameRunning(false); setIsGameOver(false); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-emerald-950 font-bold rounded-xl cursor-pointer">
            <ArrowRight className="w-5 h-5" /><span>خروج للرئيسية</span>
          </button>
          <h2 className="text-xl font-bold text-amber-400">من سيربح المليون 🏆</h2>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-emerald-800/60 rounded-xl cursor-pointer">
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
          </button>
        </header>

        {isGameOver ? (
          <main className="max-w-2xl mx-auto w-full my-auto bg-emerald-900/40 border-2 border-amber-500/60 p-10 rounded-3xl text-center">
            <h3 className="text-3xl font-black text-amber-400 mb-2">انتهت المسابقة! 🏆</h3>
            <h4 className="text-2xl font-bold text-white mb-4">الفائز: {winningTeam.name} ({winningTeam.score} نقطة)</h4>
            <button onClick={startMillionaire} className="px-8 py-3.5 bg-amber-500 text-emerald-950 font-black rounded-2xl cursor-pointer">لعبة جديدة 🔄</button>
          </main>
        ) : !isGameRunning ? (
          <main className="max-w-2xl mx-auto w-full my-auto bg-emerald-900/30 border border-emerald-700/50 p-8 rounded-3xl">
            <h3 className="text-2xl font-extrabold text-amber-400 mb-4 text-center">إعدادات المسابقة</h3>
            <div className="space-y-3 mb-6">
              {teams.map((team, idx) => (
                <div key={team.id} className="flex items-center gap-3 bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800">
                  <span className="w-7 h-7 flex items-center justify-center bg-amber-500 text-emerald-950 font-bold rounded-full text-xs">{idx + 1}</span>
                  <input type="text" value={team.name} onChange={(e) => { const n = [...teams]; n[idx].name = e.target.value; setTeams(n); }} className="flex-1 bg-transparent border-b border-emerald-700 text-white font-bold px-2 py-1 outline-none" />
                </div>
              ))}
            </div>
            
            <div className="mb-6 bg-emerald-950/70 p-4 rounded-2xl border border-emerald-800">
              <label className="block text-sm font-bold text-amber-300 mb-2">وقت العد التنازلي للسؤال (بالثواني):</label>
              <input 
                type="number" 
                min="10" 
                max="120" 
                value={customTime} 
                onChange={(e) => setCustomTime(Number(e.target.value))} 
                className="w-full bg-emerald-900/60 border border-emerald-700 text-white font-bold px-4 py-2 rounded-xl outline-none text-center text-lg" 
              />
            </div>

            <button onClick={startMillionaire} className="w-full py-4 bg-amber-500 text-emerald-950 font-extrabold text-lg rounded-2xl cursor-pointer">بدء التحدي الآن</button>
          </main>
        ) : (
          <div className="max-w-6xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* الفريق الأول (يسار / يمين حسب التوزيع) */}
            <div className={`lg:col-span-3 p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center shadow-xl ${currentTeamIndex === 0 ? 'bg-emerald-800/90 border-amber-400 scale-105 shadow-amber-500/20' : 'bg-emerald-950/40 border-emerald-800/40 opacity-50'}`}>
              <Users className={`w-10 h-10 mb-3 ${currentTeamIndex === 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
              <h3 className="text-xl font-black text-white mb-1">{teams[0].name}</h3>
              <p className="text-2xl font-black text-amber-400">{teams[0].score} <span className="text-xs">نقطة</span></p>
              {currentTeamIndex === 0 && <span className="mt-3 text-xs bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-extrabold shadow">دور الفريق الآن 🔥</span>}
            </div>

            {/* منطقة اللعب والأسئلة */}
            <main className="lg:col-span-6 bg-emerald-900/30 border border-emerald-700/50 p-6 rounded-3xl flex flex-col justify-between shadow-2xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-bold">
                  السؤال {currentQuestionIndex + 1} من {activeQuestions.length}
                </span>
                
                {/* العد التنازلي التفاعلي */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-black text-sm transition-colors ${timeLeft <= 10 ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse' : 'bg-emerald-950/80 border-emerald-700 text-amber-400'}`}>
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft} ثانية</span>
                </div>
              </div>

              {/* وسائل المساعدة الأربع */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                <button onClick={useFiftyFifty} disabled={lifelines.fiftyFifty || isAnswered} title="حذف إجابتين" className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${lifelines.fiftyFifty ? 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed' : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-amber-300 cursor-pointer'}`}>
                  <span className="text-lg">✂️</span>
                  <span>50:50</span>
                </button>
                <button onClick={usePhone} disabled={lifelines.phone || isAnswered} title="استعانة بصديق" className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${lifelines.phone ? 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed' : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-amber-300 cursor-pointer'}`}>
                  <PhoneCall className="w-5 h-5" />
                  <span>صديق</span>
                </button>
                <button onClick={useChangeQuestion} disabled={lifelines.changeQ || isAnswered} title="تغيير السؤال" className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${lifelines.changeQ ? 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed' : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-amber-300 cursor-pointer'}`}>
                  <RefreshCw className="w-5 h-5" />
                  <span>تغيير</span>
                </button>
                <button onClick={useAddTime} disabled={lifelines.addTime || isAnswered} title="إضافة 30 ثانية" className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${lifelines.addTime ? 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed' : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-amber-300 cursor-pointer'}`}>
                  <PlusCircle className="w-5 h-5" />
                  <span>+30ث</span>
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-center text-white mb-6 leading-relaxed">
                {activeQuestions[currentQuestionIndex]?.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {activeQuestions[currentQuestionIndex]?.options.map((opt, idx) => {
                  if (hiddenOptions.includes(idx)) {
                    return <div key={idx} className="p-4 rounded-2xl border-2 border-transparent bg-slate-900/40 opacity-20 text-center text-sm font-bold flex items-center justify-center">محذوف</div>;
                  }

                  let btnStyle = "bg-emerald-950/80 border-emerald-700 hover:border-amber-500 text-white";
                  if (isAnswered) {
                    if (idx === activeQuestions[currentQuestionIndex].correct) btnStyle = "bg-emerald-600 border-emerald-400 text-white shadow-lg";
                    else if (idx === selectedOption) btnStyle = "bg-red-900 border-red-600 text-white";
                    else btnStyle = "opacity-50";
                  }
                  return (
                    <button key={idx} onClick={() => handleSelectOption(idx)} disabled={isAnswered} className={`p-4 rounded-2xl border-2 font-bold text-base text-right flex justify-between items-center cursor-pointer transition ${btnStyle}`}>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="text-center animate-fade-in">
                  <button onClick={handleNextTurn} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black rounded-2xl cursor-pointer shadow-lg transition">السؤال التالي ➡️</button>
                </div>
              )}
            </main>

            {/* الفريق الثاني */}
            <div className={`lg:col-span-3 p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center shadow-xl ${currentTeamIndex === 1 ? 'bg-emerald-800/90 border-amber-400 scale-105 shadow-amber-500/20' : 'bg-emerald-950/40 border-emerald-800/40 opacity-50'}`}>
              <Users className={`w-10 h-10 mb-3 ${currentTeamIndex === 1 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
              <h3 className="text-xl font-black text-white mb-1">{teams[1].name}</h3>
              <p className="text-2xl font-black text-amber-400">{teams[1].score} <span className="text-xs">نقطة</span></p>
              {currentTeamIndex === 1 && <span className="mt-3 text-xs bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-extrabold shadow">دور الفريق الآن 🔥</span>}
            </div>

          </div>
        )}

        {/* نافذة استشارة الصديق المنبثقة */}
        {lifelineModal.show && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-emerald-950 border-2 border-amber-500 p-6 rounded-3xl max-w-md w-full text-center shadow-2xl">
              <PhoneCall className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-amber-400 mb-2">مكالمة الصديق</h3>
              <p className="text-white font-medium mb-6">{lifelineModal.text}</p>
              <button onClick={() => setLifelineModal({ show: false, text: '' })} className="px-6 py-2.5 bg-amber-500 text-emerald-950 font-black rounded-xl cursor-pointer">حسناً، شكراً</button>
            </div>
          </div>
        )}

        <footer className="text-center text-slate-500 text-xs pb-2"><p>من سيربح المليون</p></footer>
      </div>
    );
  }

  // ==========================
  // 4. الذاكرة الوطنية
  // ==========================
  if (activeGame === 'memory_game') {
    if (memoryCards.length === 0) startMemoryGame();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white font-sans p-6 select-none flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
          <button onClick={() => { setActiveGame(null); setMemoryCards([]); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-emerald-950 font-bold rounded-xl cursor-pointer">
            <ArrowRight className="w-5 h-5" /><span>خروج للرئيسية</span>
          </button>
          <h2 className="text-xl font-bold text-amber-400">الذاكرة الوطنية التفاعلية 🧠</h2>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-emerald-800/60 rounded-xl cursor-pointer">
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
          </button>
        </header>

        <main className="max-w-3xl mx-auto w-full my-auto bg-emerald-900/30 border border-emerald-700/50 p-8 rounded-3xl text-center">
          {memoryMatches === 6 ? (
            <div className="animate-fade-in py-8">
              <h3 className="text-3xl font-black text-amber-400 mb-2">أبدعت في اختبار الذاكرة! 🇸🇦</h3>
              <button onClick={startMemoryGame} className="px-8 py-3 bg-amber-500 text-emerald-950 font-black rounded-2xl cursor-pointer">لعبة جديدة 🚀</button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {memoryCards.map((card) => {
                const isFlipped = card === firstChoice || card === secondChoice || card.matched;
                return (
                  <button key={card.uniqueId} onClick={() => handleCardClick(card)} className={`h-24 rounded-2xl border-2 text-3xl flex items-center justify-center cursor-pointer transition-all ${isFlipped ? 'bg-emerald-800 border-amber-400 scale-105' : 'bg-emerald-950/80 border-emerald-700/60'}`}>
                    {isFlipped ? card.name : "🇸🇦"}
                  </button>
                );
              })}
            </div>
          )}
        </main>
        <footer className="text-center text-slate-500 text-xs pb-2"><p>الذاكرة الوطنية</p></footer>
      </div>
    );
  }

  // ==========================
  // الصفحة الرئيسية للمنصة
  // ==========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white font-sans p-6 select-none" dir="rtl">
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-10 bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2.5 rounded-xl shadow-md text-emerald-950 font-bold"><Sparkles className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-amber-400">بوابة الفعالية الوطنية</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-emerald-800/60 rounded-xl cursor-pointer">{isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}</button>
          <button onClick={handleFullscreen} className="p-3 bg-emerald-800/60 rounded-xl cursor-pointer flex items-center gap-2 text-sm font-medium"><Maximize className="w-5 h-5 text-amber-400" /><span className="hidden sm:inline">عرض الشاشة كاملة</span></button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-block mb-4 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold">🇸🇦 نجدد الولاء ونحتفي بالوطن</div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">اختر الفعالية وابدأ <span className="text-amber-400 underline"> اللعبة</span> الان!</h2>
      </main>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* من سيربح المليون */}
        <div onClick={() => setActiveGame('millionaire')} className="group bg-gradient-to-br from-emerald-900/80 to-slate-900/90 border-2 border-emerald-700/40 hover:border-amber-500/70 p-6 rounded-3xl shadow-xl cursor-pointer flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-amber-500 w-fit mb-4"><Trophy className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400">من سيربح المليون</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">تحدي المجموعات الحماسي.</p>
          </div>
          <div className="text-amber-400 font-bold text-xs">بدء المسابقة ←</div>
        </div>

        {/* مسابقة السرعة */}
        <div onClick={() => setActiveGame('escape_room')} className="group bg-gradient-to-br from-blue-950/80 to-slate-900/90 border-2 border-blue-700/40 hover:border-amber-400/70 p-6 rounded-3xl shadow-xl cursor-pointer flex flex-col justify-between">
          <div>
            <div className="p-3 bg-blue-950/80 border border-blue-700/60 rounded-2xl text-blue-400 w-fit mb-4"><Zap className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-300 mt-2">مسابقة السرعة</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">أسئلة صح وخطأ خاطفة وسريعة.</p>
          </div>
          <div className="text-blue-300 font-bold text-xs">بدء المسابقة ←</div>
        </div>

        {/* تحدي القادة والملوك */}
        <div onClick={() => setActiveGame('board_game')} className="group bg-gradient-to-br from-amber-950/80 to-slate-900/90 border-2 border-amber-700/40 hover:border-amber-400/70 p-6 rounded-3xl shadow-xl cursor-pointer flex flex-col justify-between">
          <div>
            <div className="p-3 bg-amber-950/80 border border-amber-700/60 rounded-2xl text-amber-400 w-fit mb-4"><Crown className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-300 mt-2">المعرض الملكي</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">تخمين الملوك والقادة من الإنجازات.</p>
          </div>
          <div className="text-amber-400 font-bold text-xs">بدء المعرض ←</div>
        </div>

        {/* الذاكرة الوطنية */}
        <div onClick={() => setActiveGame('memory_game')} className="group bg-gradient-to-br from-emerald-950/80 to-slate-900/90 border-2 border-emerald-700/40 hover:border-amber-400/70 p-6 rounded-3xl shadow-xl cursor-pointer flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-emerald-400 w-fit mb-4"><Grid className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-300 mt-2">الذاكرة الوطنية</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">لعبة مطابقة الرموز والتركيز.</p>
          </div>
          <div className="text-emerald-300 font-bold text-xs">بدء اللعبة ←</div>
        </div>

      </div>

      <footer className="text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 mt-12 pb-4">
        <a 
          href="https://sahl-ed.zid.store/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer bg-emerald-900/30 border border-emerald-700/40 px-4 py-2 rounded-2xl"
        >
          <img src="/src/assets/sahl.jpg" alt="شعار متجر سهل" className="w-7 h-7 rounded-lg object-cover shadow-sm" />
          <span className="font-bold text-amber-400"> جميع الحقوق محفوظة لمتجر سهل</span>
        </a>
      </footer>
    </div>
  );
}
