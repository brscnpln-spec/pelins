import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type RitualStep = "TEETH" | "TOILET" | "PAJAMAS";

interface RitualStepCardProps {
  step: RitualStep;
  label: string;
  icon: JSX.Element;
  completed: boolean;
  onComplete: () => void;
}

const stepColors: Record<RitualStep, { bg: string; border: string }> = {
  TEETH: { bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800" },
  TOILET: { bg: "bg-amber-50 dark:bg-amber-950", border: "border-amber-200 dark:border-amber-800" },
  PAJAMAS: { bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800" },
};

export default function RitualStepCard({
  step,
  label,
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
      setTimeout(() => setShowConfetti(false), 1000);
    }
  };

  return (
    <motion.button
      onClick={handleTap}
      className={`relative flex flex-col items-center justify-center w-[180px] h-[160px] rounded-2xl border-2 transition-all active:scale-95 ${
        completed
          ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600"
          : `${colors.bg} ${colors.border} hover-elevate`
      }`}
      whileTap={{ scale: 0.95 }}
      data-testid={`ritual-step-${step.toLowerCase()}`}
    >
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 60,
                  y: Math.sin((i * Math.PI) / 4) * 60,
                  opacity: 0,
                }}
                transition={{ duration: 0.6 }}
                className="absolute"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <div className={`w-16 h-16 flex items-center justify-center ${completed ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
          {icon}
        </div>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      <span className={`mt-3 text-xl font-semibold font-display ${completed ? "text-green-700 dark:text-green-300" : "text-foreground"}`}>
        {label}
      </span>

      {!completed && (
        <span className="mt-1 text-sm text-muted-foreground font-child">Tap to complete</span>
      )}
    </motion.button>
  );
}
