import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type RitualStep = "TEETH" | "TOILET" | "PAJAMAS";

interface RitualStepCardProps {
  step: RitualStep;
  icon: JSX.Element;
  completed: boolean;
  onComplete: () => void;
}

const stepColors: Record<RitualStep, { bg: string; border: string; completeBg: string }> = {
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
};

export default function RitualStepCard({
  step,
  icon,
  completed,
  onComplete,
}: RitualStepCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const colors = stepColors[step];

  const handleTap = () => {
    if (!completed) {
      setShowConfetti(true);
      onComplete();
      setTimeout(() => setShowConfetti(false), 1200);
    }
  };

  return (
    <motion.button
      onClick={handleTap}
      className={`relative flex flex-col items-center justify-center w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-3xl border-4 transition-all ${
        completed
          ? `${colors.completeBg} border-emerald-400 dark:border-emerald-600`
          : `${colors.bg} ${colors.border}`
      }`}
      whileTap={{ scale: 0.92 }}
      animate={completed ? { scale: [1, 1.05, 1] } : {}}
      data-testid={`ritual-step-${step.toLowerCase()}`}
    >
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 12) * 80,
                  y: Math.sin((i * Math.PI * 2) / 12) * 80,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative"
        animate={completed ? {} : { y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center ${completed ? "opacity-80" : ""}`}>
          {icon}
        </div>
        {completed && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-6 h-6 text-white stroke-[3]" />
          </motion.div>
        )}
      </motion.div>

      {!completed && (
        <motion.div
          className="absolute bottom-3 left-0 right-0 flex justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 rounded-full bg-current opacity-30" />
        </motion.div>
      )}
    </motion.button>
  );
}
