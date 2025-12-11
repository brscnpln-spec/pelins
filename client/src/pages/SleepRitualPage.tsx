import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import RitualStepCard from "@/components/RitualStepCard";
import ProgressBar from "@/components/ProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomNav from "@/components/BottomNav";

const RITUAL_STEPS = [
  {
    step: "TEETH" as const,
    label: "Teeth",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M12 2C9.5 2 7.5 3.5 7 6c-.5 2.5-1 5-1 7 0 3 .5 5 1.5 7 .5 1 1 2 2.5 2s2-1 2-2.5V17c0-.5.5-1 1-1s1 .5 1 1v2.5c0 1.5.5 2.5 2 2.5s2-1 2.5-2c1-2 1.5-4 1.5-7 0-2-.5-4.5-1-7-.5-2.5-2.5-4-5-4z"/>
      </svg>
    ),
  },
  {
    step: "TOILET" as const,
    label: "Toilet",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M9 2a1 1 0 011-1h4a1 1 0 011 1v4H9V2zm-4 5a1 1 0 011-1h12a1 1 0 011 1v2a6 6 0 01-3.34 5.39l.84 5.91a2 2 0 01-1.98 2.27h-5.04a2 2 0 01-1.98-2.27l.84-5.91A6 6 0 015 9V7z"/>
      </svg>
    ),
  },
  {
    step: "PAJAMAS" as const,
    label: "Pajamas",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M6 3a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H6zm6 5a2 2 0 100-4 2 2 0 000 4zm-3 2h6a1 1 0 011 1v8H8v-8a1 1 0 011-1z"/>
      </svg>
    ),
  },
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
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <PageHeader title="Tonight's Sleep Ritual" childFriendly />

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex gap-6 flex-wrap justify-center">
          {RITUAL_STEPS.map((item) => (
            <RitualStepCard
              key={item.step}
              step={item.step}
              label={item.label}
              icon={item.icon}
              completed={completedSteps.has(item.step)}
              onComplete={() => handleComplete(item.step)}
            />
          ))}
        </div>

        <div className="w-full max-w-md mt-8">
          <ProgressBar current={completedSteps.size} total={RITUAL_STEPS.length} />
        </div>

        {completedSteps.size > 0 && (
          <button
            onClick={handleReset}
            onDoubleClick={handleReset}
            className="mt-4 text-sm text-muted-foreground underline"
            data-testid="button-reset-ritual"
          >
            Reset for tonight
          </button>
        )}
      </main>

      <CelebrationOverlay
        show={showCelebration}
        message="All Done!"
        onComplete={() => setShowCelebration(false)}
      />

      <BottomNav />
    </div>
  );
}
