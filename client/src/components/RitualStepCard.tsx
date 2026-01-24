import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RitualStepCardProps {
  step: string;
  icon: JSX.Element;
  completed: boolean;
  onComplete: () => void;
}

const stepColors: Record<string, { bg: string; border: string; completeBg: string }> = {
  TEETH: { 
    bg: "bg-sky-100 dark:bg-sky-900", 
    border: "border-sky-300 dark:border-sky-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  TOILET: { 
    bg: "bg-amber-100 dark:bg-amber-900", 
    border: "border-amber-300 dark:border-amber-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  PAJAMAS: { 
    bg: "bg-violet-100 dark:bg-violet-900", 
    border: "border-violet-300 dark:border-violet-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  MORNING_TOILET: { 
    bg: "bg-amber-100 dark:bg-amber-900", 
    border: "border-amber-300 dark:border-amber-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  MORNING_BREAKFAST: { 
    bg: "bg-orange-100 dark:bg-orange-900", 
    border: "border-orange-300 dark:border-orange-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  MORNING_CLOTHES: { 
    bg: "bg-blue-100 dark:bg-blue-900", 
    border: "border-blue-300 dark:border-blue-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  MORNING_FOREST_CLOTHES: { 
    bg: "bg-green-100 dark:bg-green-900", 
    border: "border-green-300 dark:border-green-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
  MORNING_LUNCH: { 
    bg: "bg-red-100 dark:bg-red-900", 
    border: "border-red-300 dark:border-red-700",
    completeBg: "bg-emerald-100 dark:bg-emerald-900"
  },
};

const defaultColors = {
  bg: "bg-gray-100 dark:bg-gray-900", 
  border: "border-gray-300 dark:border-gray-700",
  completeBg: "bg-emerald-100 dark:bg-emerald-900"
};

export default function RitualStepCard({
  step,
  icon,
  completed,
  onComplete,
}: RitualStepCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const colors = stepColors[step] || defaultColors;

  const handleTap = () => {
    if (!completed) {
      setShowConfetti(true);
      onComplete();
      setTimeout(() => setShowConfetti(false), 800);
    }
  };

  return (
    <button
      onClick={handleTap}
      className={`relative flex flex-col items-center justify-center w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-3xl border-4 transition-all active:scale-95 ${
        completed
          ? `${colors.completeBg} border-emerald-400 dark:border-emerald-600`
          : `${colors.bg} ${colors.border}`
      }`}
      data-testid={`ritual-step-${step.toLowerCase()}`}
    >
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full rounded-3xl border-4 border-yellow-400 animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center ${completed ? "opacity-80" : ""}`}>
          {icon}
        </div>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-6 h-6 text-white stroke-[3]" />
          </motion.div>
        )}
      </div>

      {!completed && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <div className="w-3 h-3 rounded-full bg-current opacity-30" />
        </div>
      )}
    </button>
  );
}
