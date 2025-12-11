import { useState, useEffect } from "react";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";

function ToothIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <ellipse cx="40" cy="45" rx="28" ry="30" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <ellipse cx="30" cy="65" rx="8" ry="12" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <path d="M25 35 Q40 45 55 35" stroke="#60A5FA" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="28" r="4" fill="#60A5FA" />
      <circle cx="48" cy="28" r="4" fill="#60A5FA" />
      <path d="M36 38 Q40 42 44 38" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round" />
      <motion.g animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x="58" y="10" width="4" height="20" rx="2" fill="#93C5FD" />
        <ellipse cx="60" cy="8" rx="8" ry="6" fill="#93C5FD" />
      </motion.g>
    </svg>
  );
}

function ToiletIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <rect x="20" y="15" width="40" height="50" rx="8" fill="white" stroke="#FBBF24" strokeWidth="3" />
      <ellipse cx="40" cy="40" rx="14" ry="10" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="2" />
      <rect x="32" y="10" width="16" height="10" rx="3" fill="#FCD34D" />
      <circle cx="40" cy="35" r="3" fill="#FBBF24" />
      <path d="M35 42 Q40 48 45 42" stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <circle cx="28" cy="25" r="2" fill="#93C5FD" />
        <circle cx="52" cy="22" r="2" fill="#93C5FD" />
        <circle cx="48" cy="28" r="1.5" fill="#93C5FD" />
      </motion.g>
    </svg>
  );
}

function PajamasIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <path d="M25 25 L40 20 L55 25 L55 60 L25 60 Z" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="3" />
      <circle cx="40" cy="35" r="10" fill="white" stroke="#A78BFA" strokeWidth="2" />
      <circle cx="37" cy="33" r="2" fill="#A78BFA" />
      <circle cx="43" cy="33" r="2" fill="#A78BFA" />
      <path d="M37 38 Q40 41 43 38" stroke="#A78BFA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M15 28 L25 25 L25 45 L15 42 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      <path d="M65 28 L55 25 L55 45 L65 42 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      <line x1="40" y1="60" x2="40" y2="75" stroke="#A78BFA" strokeWidth="2" />
      <rect x="28" y="60" width="10" height="15" rx="2" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      <rect x="42" y="60" width="10" height="15" rx="2" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx="35" cy="50" r="2" fill="#A78BFA" />
        <circle cx="40" cy="52" r="2" fill="#A78BFA" />
        <circle cx="45" cy="50" r="2" fill="#A78BFA" />
      </motion.g>
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <motion.svg 
      viewBox="0 0 60 60" 
      className={className}
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <path
        d="M45 30c0-10-8-18-18-18 2 4 3 8 3 13 0 12-10 22-22 22 4 6 11 10 19 10 12 0 18-10 18-27z"
        fill="#FDE047"
        stroke="#FACC15"
        strokeWidth="2"
      />
      <circle cx="38" cy="22" r="2" fill="#FBBF24" />
      <circle cx="42" cy="32" r="1.5" fill="#FBBF24" />
    </motion.svg>
  );
}

function StarIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      className={className}
      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    >
      <path
        d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
        fill="#FDE047"
        stroke="#FACC15"
        strokeWidth="1"
      />
    </motion.svg>
  );
}

const RITUAL_STEPS = [
  { step: "TEETH" as const, icon: <ToothIcon /> },
  { step: "TOILET" as const, icon: <ToiletIcon /> },
  { step: "PAJAMAS" as const, icon: <PajamasIcon /> },
];

export default function SleepRitualPage() {
  // todo: remove mock functionality - replace with API calls
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("ritualSteps");
    const today = new Date().toISOString().split("T")[0];
    const savedData = saved ? JSON.parse(saved) : { date: "", steps: [] };
    if (savedData.date === today) {
      return new Set(savedData.steps);
    }
    return new Set();
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "ritualSteps",
      JSON.stringify({ date: today, steps: Array.from(completedSteps) })
    );
  }, [completedSteps]);

  const handleComplete = (step: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(step);
    setCompletedSteps(newCompleted);

    if (newCompleted.size === RITUAL_STEPS.length) {
      setTimeout(() => setShowCelebration(true), 500);
    }
  };

  const handleReset = () => {
    setCompletedSteps(new Set());
    localStorage.removeItem("ritualSteps");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 pb-[72px]">
      <header className="flex items-center justify-between px-6 py-4 min-h-[60px]">
        <div className="flex items-center gap-3">
          <MoonIcon className="w-10 h-10" />
          <div className="flex gap-1">
            <StarIcon className="w-5 h-5" delay={0} />
            <StarIcon className="w-4 h-4" delay={0.3} />
            <StarIcon className="w-5 h-5" delay={0.6} />
          </div>
        </div>
        <div className="flex gap-1">
          <StarIcon className="w-6 h-6" delay={0.2} />
          <StarIcon className="w-5 h-5" delay={0.5} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          {RITUAL_STEPS.map((item) => (
            <RitualStepCard
              key={item.step}
              step={item.step}
              icon={item.icon}
              completed={completedSteps.has(item.step)}
              onComplete={() => handleComplete(item.step)}
            />
          ))}
        </div>

        <div className="w-full max-w-md mt-8">
          <div className="flex justify-center gap-3 mb-4">
            {RITUAL_STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold ${
                  completedSteps.has(item.step)
                    ? "bg-emerald-400 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
                animate={completedSteps.has(item.step) ? { scale: [1, 1.2, 1] } : {}}
              >
                {completedSteps.has(item.step) ? (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-display">{idx + 1}</span>
                )}
              </motion.div>
            ))}
          </div>
          <ProgressBar current={completedSteps.size} total={RITUAL_STEPS.length} showLabel={false} />
        </div>

        {completedSteps.size > 0 && (
          <button
            onClick={handleReset}
            className="mt-6 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center opacity-50"
            data-testid="button-reset-ritual"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </main>

      <CelebrationOverlay
        show={showCelebration}
        message="Amazing job!"
        onComplete={() => setShowCelebration(false)}
      />

      <BottomNav />
    </div>
  );
}
