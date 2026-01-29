import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import { useState, useEffect } from "react";

function ToothbrushIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Handle */}
      <rect x="36" y="8" width="8" height="50" rx="4" fill="#3B82F6" />
      {/* Brush head */}
      <rect x="30" y="58" width="20" height="32" rx="4" fill="#60A5FA" />
      {/* Bristles */}
      <rect x="33" y="62" width="4" height="12" rx="1" fill="white" />
      <rect x="38" y="62" width="4" height="12" rx="1" fill="white" />
      <rect x="43" y="62" width="4" height="12" rx="1" fill="white" />
      {/* Sparkles */}
      <circle cx="22" cy="20" r="4" fill="#93C5FD" />
      <circle cx="58" cy="28" r="3" fill="#93C5FD" />
      <circle cx="24" cy="75" r="3" fill="#93C5FD" />
    </svg>
  );
}

function ToiletIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Tank */}
      <rect x="25" y="12" width="30" height="28" rx="4" fill="#FCD34D" />
      {/* Flush button */}
      <rect x="36" y="18" width="8" height="6" rx="2" fill="#FBBF24" />
      {/* Bowl back */}
      <rect x="20" y="38" width="40" height="24" rx="6" fill="white" stroke="#FBBF24" strokeWidth="3" />
      {/* Seat */}
      <ellipse cx="40" cy="72" rx="26" ry="16" fill="white" stroke="#FBBF24" strokeWidth="3" />
      <ellipse cx="40" cy="70" rx="18" ry="10" fill="#FEF3C7" />
    </svg>
  );
}

function PajamasIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Pajama top */}
      <path d="M28 20 L40 14 L52 20 L55 55 L25 55 Z" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="3" />
      {/* Left sleeve */}
      <path d="M12 28 L28 20 L28 38 L12 34 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      {/* Right sleeve */}
      <path d="M68 28 L52 20 L52 38 L68 34 Z" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      {/* Buttons */}
      <circle cx="40" cy="30" r="3" fill="#A78BFA" />
      <circle cx="40" cy="40" r="3" fill="#A78BFA" />
      <circle cx="40" cy="50" r="3" fill="#A78BFA" />
      {/* Pajama pants */}
      <rect x="26" y="55" width="12" height="35" rx="4" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      <rect x="42" y="55" width="12" height="35" rx="4" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="2" />
      {/* Moon decoration */}
      <circle cx="32" cy="35" r="4" fill="#A78BFA" opacity="0.5" />
      <circle cx="48" cy="35" r="4" fill="#A78BFA" opacity="0.5" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
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
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set());
  const today = new Date().toISOString().split("T")[0];

  const { data: status, isLoading } = useQuery<RitualStatusResponse>({
    queryKey: [`/api/ritual/status?date=${today}`],
    staleTime: 60000,
  });

  useEffect(() => {
    if (status?.completedSteps) {
      setLocalCompleted(new Set(status.completedSteps));
    }
  }, [status?.completedSteps]);

  const completeMutation = useMutation({
    mutationFn: async (step: string) => {
      const res = await apiRequest("POST", "/api/ritual/complete", { date: today, step });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.allDone) {
        setTimeout(() => setShowCelebration(true), 300);
      }
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/ritual/reset", { date: today });
    },
  });

  const handleComplete = (step: string) => {
    if (localCompleted.has(step)) return;
    
    setLocalCompleted(prev => new Set(Array.from(prev).concat(step)));
    
    const newCompleted = new Set(Array.from(localCompleted).concat(step));
    if (newCompleted.size === RITUAL_STEPS.length) {
      setTimeout(() => setShowCelebration(true), 300);
    }
    
    completeMutation.mutate(step);
  };

  const handleReset = () => {
    setLocalCompleted(new Set());
    resetMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-purple-900 pb-[72px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <MoonIcon className="w-16 h-16" />
          </div>
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
              completed={localCompleted.has(item.step)}
              onComplete={() => handleComplete(item.step)}
            />
          ))}
        </div>

        <div className="w-full max-w-md mt-8">
          <div className="flex justify-center gap-3 mb-4">
            {RITUAL_STEPS.map((item, idx) => (
              <div
                key={item.step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  localCompleted.has(item.step)
                    ? "bg-emerald-400 text-white scale-110"
                    : "bg-white/20 text-white/60 shadow"
                }`}
              >
                {localCompleted.has(item.step) ? (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-display">{idx + 1}</span>
                )}
              </div>
            ))}
          </div>
          <ProgressBar current={localCompleted.size} total={RITUAL_STEPS.length} showLabel={false} />
        </div>

        {localCompleted.size > 0 && (
          <button
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="mt-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow active:scale-95 transition-transform"
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
