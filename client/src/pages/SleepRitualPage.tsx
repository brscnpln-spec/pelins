import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import { motion } from "framer-motion";
import { useState } from "react";

function ToothbrushIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect x="35" y="10" width="10" height="55" rx="3" fill="#60A5FA" />
      <rect x="32" y="8" width="16" height="8" rx="2" fill="#3B82F6" />
      <ellipse cx="40" cy="75" rx="18" ry="12" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      <rect x="28" y="68" width="24" height="20" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      <g>
        <rect x="30" y="70" width="3" height="8" rx="1" fill="#93C5FD" />
        <rect x="35" y="70" width="3" height="8" rx="1" fill="#60A5FA" />
        <rect x="40" y="70" width="3" height="8" rx="1" fill="#93C5FD" />
        <rect x="45" y="70" width="3" height="8" rx="1" fill="#60A5FA" />
      </g>
      <ellipse cx="25" cy="25" rx="6" ry="4" fill="#E0F2FE" opacity="0.6" />
      <ellipse cx="55" cy="20" rx="5" ry="3" fill="#E0F2FE" opacity="0.6" />
      <circle cx="40" cy="48" r="6" fill="white" stroke="#60A5FA" strokeWidth="2" />
      <circle cx="38" cy="46" r="1.5" fill="#60A5FA" />
      <circle cx="42" cy="46" r="1.5" fill="#60A5FA" />
      <path d="M37 50 Q40 53 43 50" stroke="#60A5FA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ToiletIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="28" ry="18" fill="white" stroke="#FBBF24" strokeWidth="3" />
      <ellipse cx="40" cy="65" rx="20" ry="12" fill="#FEF3C7" />
      <rect x="15" y="25" width="50" height="35" rx="8" fill="white" stroke="#FBBF24" strokeWidth="3" />
      <rect x="30" y="12" width="20" height="18" rx="4" fill="#FCD34D" />
      <circle cx="40" cy="42" r="8" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="2" />
      <circle cx="37" cy="40" r="2" fill="#FBBF24" />
      <circle cx="43" cy="40" r="2" fill="#FBBF24" />
      <path d="M36 46 Q40 50 44 46" stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="8" r="3" fill="#BFDBFE" opacity="0.6" />
      <circle cx="48" cy="6" r="2" fill="#BFDBFE" opacity="0.6" />
    </svg>
  );
}

function PajamasIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <path d="M25 30 L40 22 L55 30 L58 75 L22 75 Z" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="3" />
      <path d="M10 35 L25 30 L25 55 L10 50 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      <path d="M70 35 L55 30 L55 55 L70 50 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      <rect x="26" y="75" width="12" height="18" rx="3" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      <rect x="42" y="75" width="12" height="18" rx="3" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      <circle cx="40" cy="42" r="12" fill="white" stroke="#A78BFA" strokeWidth="2" />
      <g>
        <path d="M35 40 Q36 38 37 40" stroke="#A78BFA" strokeWidth="1.5" fill="none" />
        <path d="M43 40 Q44 38 45 40" stroke="#A78BFA" strokeWidth="1.5" fill="none" />
      </g>
      <path d="M36 46 Q40 49 44 46" stroke="#A78BFA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="44" rx="3" ry="2" fill="#FECACA" opacity="0.5" />
      <ellipse cx="50" cy="44" rx="3" ry="2" fill="#FECACA" opacity="0.5" />
      <circle cx="32" cy="58" r="3" fill="#A78BFA" opacity="0.5" />
      <circle cx="40" cy="62" r="3" fill="#A78BFA" opacity="0.5" />
      <circle cx="48" cy="58" r="3" fill="#A78BFA" opacity="0.5" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 60 60" 
      className={className}
    >
      <path
        d="M45 30c0-10-8-18-18-18 2 4 3 8 3 13 0 12-10 22-22 22 4 6 11 10 19 10 12 0 18-10 18-27z"
        fill="#FDE047"
        stroke="#FACC15"
        strokeWidth="2"
      />
      <circle cx="38" cy="22" r="2" fill="#FBBF24" />
      <circle cx="42" cy="32" r="1.5" fill="#FBBF24" />
    </svg>
  );
}

function StarIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      style={{ 
        animation: `twinkle 3s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      <path
        d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
        fill="#FDE047"
        stroke="#FACC15"
        strokeWidth="1"
      />
    </svg>
  );
}

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
      
      <div className="absolute top-8 left-8 w-16 h-8 bg-white/10 rounded-full blur-sm" />
      <div className="absolute top-20 right-12 w-20 h-10 bg-white/10 rounded-full blur-sm" />
      
      <StarIcon className="absolute top-12 left-1/4 w-4" delay={0} />
      <StarIcon className="absolute top-20 right-1/4 w-3" delay={1} />
      <StarIcon className="absolute top-6 right-1/3 w-5" delay={2} />
      <StarIcon className="absolute top-10 right-12 w-4" delay={0.5} />
      <StarIcon className="absolute bottom-36 left-8 w-4" delay={1.5} />
      <StarIcon className="absolute bottom-44 right-12 w-5" delay={2.5} />
    </div>
  );
}

const RITUAL_STEPS = [
  { step: "TEETH" as const, icon: <ToothbrushIcon /> },
  { step: "TOILET" as const, icon: <ToiletIcon /> },
  { step: "PAJAMAS" as const, icon: <PajamasIcon /> },
];

interface RitualStatusResponse {
  date: string;
  completedSteps: string[];
}

export default function SleepRitualPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const { data: status, isLoading } = useQuery<RitualStatusResponse>({
    queryKey: [`/api/ritual/status?date=${today}`],
    refetchInterval: 10000,
  });

  const completedSteps = new Set(status?.completedSteps || []);

  const completeMutation = useMutation({
    mutationFn: async (step: string) => {
      const res = await apiRequest("POST", "/api/ritual/complete", { date: today, step });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ritual/status"] });
      if (data.allDone) {
        setTimeout(() => setShowCelebration(true), 500);
      }
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/ritual/reset", { date: today });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ritual/status"] });
    },
  });

  const handleComplete = (step: string) => {
    completeMutation.mutate(step);
  };

  const handleReset = () => {
    resetMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-purple-900 pb-[72px]">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <MoonIcon className="w-16 h-16" />
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-purple-900 pb-[72px] relative overflow-hidden">
      <BackgroundDecorations />
      
      <header className="flex items-center justify-between px-6 py-4 min-h-[70px] relative z-10">
        <div className="flex items-center gap-3">
          <MoonIcon className="w-10 h-10" />
          <div className="flex gap-1">
            <StarIcon className="w-5 h-5" delay={0} />
            <StarIcon className="w-4 h-4" delay={0.3} />
            <StarIcon className="w-5 h-5" delay={0.6} />
          </div>
        </div>
        <DigitalClock />
        <div className="flex gap-1">
          <StarIcon className="w-6 h-6" delay={0.2} />
          <StarIcon className="w-5 h-5" delay={0.5} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
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
                    : "bg-white/20 text-white/60 shadow"
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
            disabled={resetMutation.isPending}
            className="mt-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow"
            data-testid="button-reset-ritual"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="2">
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
