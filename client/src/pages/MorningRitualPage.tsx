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

function BreakfastIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Plate */}
      <ellipse cx="40" cy="72" rx="32" ry="14" fill="white" stroke="#F97316" strokeWidth="3" />
      <ellipse cx="40" cy="70" rx="24" ry="9" fill="#FED7AA" />
      {/* Pancakes stack */}
      <ellipse cx="40" cy="52" rx="18" ry="6" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <ellipse cx="40" cy="44" rx="16" ry="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
      <ellipse cx="40" cy="37" rx="14" ry="4" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
      {/* Butter on top */}
      <rect x="35" y="30" width="10" height="6" rx="1" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="1" />
      {/* Steam */}
      <path d="M30 18 Q32 12 30 8" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M40 15 Q42 9 40 5" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M50 18 Q52 12 50 8" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function ClothesIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* T-shirt body */}
      <path d="M28 28 L40 22 L52 28 L52 75 L28 75 Z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="3" />
      {/* Left sleeve */}
      <path d="M12 32 L28 28 L28 45 L12 40 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
      {/* Right sleeve */}
      <path d="M68 32 L52 28 L52 45 L68 40 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
      {/* Collar */}
      <path d="M35 22 L40 30 L45 22" fill="#60A5FA" stroke="#3B82F6" strokeWidth="2" />
      {/* Star decoration */}
      <polygon points="40,40 42,46 48,46 43,50 45,56 40,52 35,56 37,50 32,46 38,46" fill="#FDE047" />
    </svg>
  );
}

function ForestClothesIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Jacket body */}
      <path d="M26 28 L40 22 L54 28 L54 65 L26 65 Z" fill="#22C55E" stroke="#16A34A" strokeWidth="3" />
      {/* Left sleeve */}
      <path d="M10 34 L26 28 L26 48 L10 42 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
      {/* Right sleeve */}
      <path d="M70 34 L54 28 L54 48 L70 42 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
      {/* Hood */}
      <path d="M30 22 L40 12 L50 22" fill="#16A34A" stroke="#16A34A" strokeWidth="2" />
      {/* Zipper */}
      <line x1="40" y1="28" x2="40" y2="65" stroke="#16A34A" strokeWidth="3" />
      {/* Pants */}
      <rect x="28" y="65" width="10" height="25" rx="3" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
      <rect x="42" y="65" width="10" height="25" rx="3" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
      {/* Tree icon */}
      <polygon points="40,35 46,48 34,48" fill="#86EFAC" />
      <rect x="38" y="48" width="4" height="6" fill="#86EFAC" />
    </svg>
  );
}

function LunchBoxIcon() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      {/* Main box */}
      <rect x="15" y="35" width="50" height="45" rx="6" fill="#EF4444" stroke="#DC2626" strokeWidth="3" />
      {/* Lid */}
      <rect x="15" y="35" width="50" height="14" rx="4" fill="#F87171" stroke="#DC2626" strokeWidth="2" />
      {/* Handle */}
      <path d="M30 35 L30 25 Q40 18 50 25 L50 35" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
      {/* Latch */}
      <rect x="35" y="46" width="10" height="6" rx="2" fill="#FCA5A5" />
      {/* Food compartments visible */}
      <rect x="20" y="55" width="17" height="20" rx="2" fill="white" stroke="#DC2626" strokeWidth="1.5" />
      <rect x="43" y="55" width="17" height="20" rx="2" fill="white" stroke="#DC2626" strokeWidth="1.5" />
      {/* Food items */}
      <circle cx="28" cy="65" r="5" fill="#FBBF24" />
      <ellipse cx="52" cy="62" rx="5" ry="3" fill="#22C55E" />
      <ellipse cx="52" cy="68" rx="5" ry="3" fill="#F97316" />
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
