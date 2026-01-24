import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import { useState, useEffect, useMemo } from "react";

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

function BreakfastIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="30" ry="15" fill="white" stroke="#F97316" strokeWidth="3" />
      <ellipse cx="40" cy="68" rx="24" ry="10" fill="#FED7AA" />
      <ellipse cx="30" cy="55" rx="12" ry="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <ellipse cx="50" cy="55" rx="12" ry="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <rect x="55" y="50" width="15" height="20" rx="3" fill="white" stroke="#F97316" strokeWidth="2" />
      <ellipse cx="62" cy="45" rx="6" ry="3" fill="#FED7AA" />
      <circle cx="30" cy="52" r="2" fill="#FDE047" />
      <circle cx="50" cy="52" r="2" fill="#FDE047" />
      <path d="M35 25 Q40 15 45 25" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M30 20 Q35 10 40 20" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="40" cy="55" r="6" fill="white" stroke="#F97316" strokeWidth="2" />
      <circle cx="38" cy="53" r="1.5" fill="#F97316" />
      <circle cx="42" cy="53" r="1.5" fill="#F97316" />
      <path d="M37 57 Q40 60 43 57" stroke="#F97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ClothesIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <path d="M25 25 L40 18 L55 25 L58 40 L50 42 L50 80 L30 80 L30 42 L22 40 Z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="3" />
      <path d="M10 30 L25 25 L25 45 L10 40 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
      <path d="M70 30 L55 25 L55 45 L70 40 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="40" cy="32" r="4" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="40" cy="45" r="4" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="40" cy="58" r="4" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="40" cy="55" r="10" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="37" cy="52" r="2" fill="#3B82F6" />
      <circle cx="43" cy="52" r="2" fill="#3B82F6" />
      <path d="M36 58 Q40 62 44 58" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ForestClothesIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <path d="M25 30 L40 22 L55 30 L55 75 L25 75 Z" fill="#22C55E" stroke="#16A34A" strokeWidth="3" />
      <path d="M10 35 L25 30 L25 50 L10 45 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
      <path d="M70 35 L55 30 L55 50 L70 45 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
      <rect x="28" y="75" width="10" height="15" rx="2" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
      <rect x="42" y="75" width="10" height="15" rx="2" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
      <circle cx="35" cy="40" r="4" fill="#86EFAC" />
      <circle cx="45" cy="50" r="4" fill="#86EFAC" />
      <circle cx="32" cy="60" r="3" fill="#86EFAC" />
      <circle cx="48" cy="65" r="3" fill="#86EFAC" />
      <path d="M30 15 L33 8 L36 15 Z" fill="#16A34A" />
      <path d="M44 15 L47 8 L50 15 Z" fill="#16A34A" />
      <path d="M37 12 L40 5 L43 12 Z" fill="#22C55E" />
      <circle cx="40" cy="52" r="8" fill="white" stroke="#16A34A" strokeWidth="2" />
      <circle cx="37" cy="50" r="2" fill="#16A34A" />
      <circle cx="43" cy="50" r="2" fill="#16A34A" />
      <path d="M36 55 Q40 58 44 55" stroke="#16A34A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function LunchBoxIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect x="15" y="30" width="50" height="45" rx="6" fill="#EF4444" stroke="#DC2626" strokeWidth="3" />
      <rect x="15" y="30" width="50" height="12" rx="3" fill="#F87171" stroke="#DC2626" strokeWidth="2" />
      <rect x="30" y="22" width="20" height="12" rx="4" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2" />
      <rect x="20" y="50" width="18" height="18" rx="2" fill="white" stroke="#DC2626" strokeWidth="1.5" />
      <rect x="42" y="50" width="18" height="18" rx="2" fill="white" stroke="#DC2626" strokeWidth="1.5" />
      <circle cx="29" cy="59" r="4" fill="#FBBF24" />
      <ellipse cx="51" cy="56" rx="5" ry="3" fill="#22C55E" />
      <ellipse cx="51" cy="62" rx="5" ry="3" fill="#F97316" />
      <circle cx="40" cy="82" r="8" fill="white" stroke="#DC2626" strokeWidth="2" />
      <circle cx="37" cy="80" r="2" fill="#DC2626" />
      <circle cx="43" cy="80" r="2" fill="#DC2626" />
      <path d="M36 85 Q40 88 44 85" stroke="#DC2626" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      <circle cx="30" cy="30" r="12" fill="#FDE047" stroke="#FACC15" strokeWidth="2" />
      <g stroke="#FACC15" strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1="8" x2="30" y2="14" />
        <line x1="30" y1="46" x2="30" y2="52" />
        <line x1="8" y1="30" x2="14" y2="30" />
        <line x1="46" y1="30" x2="52" y2="30" />
        <line x1="14.4" y1="14.4" x2="18.6" y2="18.6" />
        <line x1="41.4" y1="41.4" x2="45.6" y2="45.6" />
        <line x1="14.4" y1="45.6" x2="18.6" y2="41.4" />
        <line x1="41.4" y1="18.6" x2="45.6" y2="14.4" />
      </g>
    </svg>
  );
}

function CloudIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg 
      viewBox="0 0 40 24" 
      className={className}
      style={{ 
        animation: `float 4s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      <ellipse cx="20" cy="16" rx="14" ry="8" fill="white" opacity="0.8" />
      <ellipse cx="12" cy="14" rx="8" ry="6" fill="white" opacity="0.8" />
      <ellipse cx="28" cy="14" rx="8" ry="6" fill="white" opacity="0.8" />
      <ellipse cx="20" cy="10" rx="10" ry="7" fill="white" opacity="0.9" />
    </svg>
  );
}

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
      `}</style>
      
      <div className="absolute top-16 left-8 w-20 h-10 bg-white/20 rounded-full blur-sm" />
      <div className="absolute top-24 right-16 w-24 h-12 bg-white/20 rounded-full blur-sm" />
      
      <CloudIcon className="absolute top-12 left-1/4 w-12" delay={0} />
      <CloudIcon className="absolute top-8 right-1/4 w-10" delay={1.5} />
      <CloudIcon className="absolute bottom-36 right-8 w-14" delay={0.8} />
    </div>
  );
}

interface RitualStatusResponse {
  date: string;
  completedSteps: string[];
}

export default function MorningRitualPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set());
  const today = new Date().toISOString().split("T")[0];
  
  const dayOfWeek = new Date().getDay();
  const isTuesdayOrThursday = dayOfWeek === 2 || dayOfWeek === 4;

  const ritualSteps = useMemo(() => {
    const baseSteps: { step: string; icon: JSX.Element }[] = [
      { step: "MORNING_TOILET", icon: <ToiletIcon /> },
      { step: "MORNING_BREAKFAST", icon: <BreakfastIcon /> },
      { step: "MORNING_CLOTHES", icon: <ClothesIcon /> },
    ];
    
    if (isTuesdayOrThursday) {
      baseSteps.push(
        { step: "MORNING_FOREST_CLOTHES", icon: <ForestClothesIcon /> },
        { step: "MORNING_LUNCH", icon: <LunchBoxIcon /> }
      );
    }
    
    return baseSteps;
  }, [isTuesdayOrThursday]);

  const { data: status, isLoading } = useQuery<RitualStatusResponse>({
    queryKey: [`/api/morning-ritual/status?date=${today}`],
    staleTime: 60000,
  });

  useEffect(() => {
    if (status?.completedSteps) {
      setLocalCompleted(new Set(status.completedSteps));
    }
  }, [status?.completedSteps]);

  const completeMutation = useMutation({
    mutationFn: async (step: string) => {
      const res = await apiRequest("POST", "/api/morning-ritual/complete", { 
        date: today, 
        step,
        totalSteps: ritualSteps.length
      });
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
      await apiRequest("POST", "/api/morning-ritual/reset", { date: today });
    },
  });

  const handleComplete = (step: string) => {
    if (localCompleted.has(step)) return;
    
    setLocalCompleted(prev => new Set(Array.from(prev).concat(step)));
    
    const newCompleted = new Set(Array.from(localCompleted).concat(step));
    if (newCompleted.size === ritualSteps.length) {
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
      <div className="flex flex-col h-screen bg-gradient-to-b from-amber-400 to-orange-400 pb-[72px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <SunIcon className="w-16 h-16" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-amber-400 to-orange-400 pb-[72px] relative overflow-hidden">
      <BackgroundDecorations />
      
      <header className="flex items-center justify-between px-6 py-4 min-h-[70px] relative z-10">
        <div className="flex items-center gap-3">
          <SunIcon className="w-10 h-10" />
          <div className="flex gap-1">
            <CloudIcon className="w-8 h-5" delay={0} />
            <CloudIcon className="w-6 h-4" delay={0.5} />
          </div>
        </div>
        <DigitalClock />
        <div className="flex gap-1">
          <CloudIcon className="w-10 h-6" delay={0.3} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          {ritualSteps.map((item) => (
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
            {ritualSteps.map((item, idx) => (
              <div
                key={item.step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  localCompleted.has(item.step)
                    ? "bg-emerald-400 text-white scale-110"
                    : "bg-white/40 text-white/80 shadow"
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
          <ProgressBar current={localCompleted.size} total={ritualSteps.length} showLabel={false} />
        </div>

        {localCompleted.size > 0 && (
          <button
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="mt-6 w-10 h-10 rounded-full bg-white/40 flex items-center justify-center shadow active:scale-95 transition-transform"
            data-testid="button-reset-morning-ritual"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </main>

      <CelebrationOverlay
        show={showCelebration}
        message="Great morning!"
        theme="morning"
        onComplete={() => setShowCelebration(false)}
      />

      <BottomNav />
    </div>
  );
}
