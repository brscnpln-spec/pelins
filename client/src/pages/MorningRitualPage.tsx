import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import { useState, useEffect, useMemo } from "react";
import { Droplets, UtensilsCrossed, Shirt, TreePine, ShoppingBag } from "lucide-react";

function ToiletIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Droplets className="w-16 h-16 text-amber-500" strokeWidth={1.5} />
    </div>
  );
}

function BreakfastIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <UtensilsCrossed className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
    </div>
  );
}

function ClothesIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Shirt className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
    </div>
  );
}

function ForestClothesIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <TreePine className="w-16 h-16 text-green-500" strokeWidth={1.5} />
    </div>
  );
}

function LunchBoxIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ShoppingBag className="w-16 h-16 text-red-500" strokeWidth={1.5} />
    </div>
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
