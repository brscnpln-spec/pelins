import { motion, AnimatePresence } from "framer-motion";

interface CelebrationOverlayProps {
  show: boolean;
  message?: string;
  theme?: "night" | "morning";
  onComplete?: () => void;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HappyFaceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className}>
      <circle cx="60" cy="60" r="50" fill="#FDE047" stroke="#FACC15" strokeWidth="4" />
      <ellipse cx="42" cy="48" rx="8" ry="10" fill="#1F2937" />
      <ellipse cx="78" cy="48" rx="8" ry="10" fill="#1F2937" />
      <circle cx="44" cy="45" r="3" fill="white" />
      <circle cx="80" cy="45" r="3" fill="white" />
      <path
        d="M35 70 Q60 95 85 70"
        stroke="#1F2937"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="25" cy="60" rx="8" ry="5" fill="#FCA5A5" opacity="0.5" />
      <ellipse cx="95" cy="60" rx="8" ry="5" fill="#FCA5A5" opacity="0.5" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      <path
        d="M45 30c0-10-8-18-18-18 2 4 3 8 3 13 0 12-10 22-22 22 4 6 11 10 19 10 12 0 18-10 18-27z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      <circle cx="30" cy="30" r="12" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="30" y1="6" x2="30" y2="12" />
        <line x1="30" y1="48" x2="30" y2="54" />
        <line x1="6" y1="30" x2="12" y2="30" />
        <line x1="48" y1="30" x2="54" y2="30" />
        <line x1="13" y1="13" x2="17" y2="17" />
        <line x1="43" y1="43" x2="47" y2="47" />
        <line x1="13" y1="47" x2="17" y2="43" />
        <line x1="43" y1="17" x2="47" y2="13" />
      </g>
    </svg>
  );
}

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className}>
      <ellipse cx="30" cy="28" rx="20" ry="12" fill="currentColor" />
      <ellipse cx="18" cy="24" rx="12" ry="10" fill="currentColor" />
      <ellipse cx="42" cy="24" rx="12" ry="10" fill="currentColor" />
      <ellipse cx="30" cy="18" rx="14" ry="10" fill="currentColor" />
    </svg>
  );
}

function RainbowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className}>
      <path d="M5 40 Q5 10 40 10 Q75 10 75 40" stroke="#EF4444" strokeWidth="4" fill="none" />
      <path d="M10 40 Q10 15 40 15 Q70 15 70 40" stroke="#F97316" strokeWidth="4" fill="none" />
      <path d="M15 40 Q15 20 40 20 Q65 20 65 40" stroke="#FBBF24" strokeWidth="4" fill="none" />
      <path d="M20 40 Q20 25 40 25 Q60 25 60 40" stroke="#22C55E" strokeWidth="4" fill="none" />
      <path d="M25 40 Q25 30 40 30 Q55 30 55 40" stroke="#3B82F6" strokeWidth="4" fill="none" />
      <path d="M30 40 Q30 35 40 35 Q50 35 50 40" stroke="#8B5CF6" strokeWidth="4" fill="none" />
    </svg>
  );
}

export default function CelebrationOverlay({
  show,
  theme = "night",
  onComplete,
}: CelebrationOverlayProps) {
  const isMorning = theme === "morning";
  const bgGradient = isMorning 
    ? "bg-gradient-to-b from-amber-400 to-orange-500" 
    : "bg-gradient-to-b from-indigo-600 to-purple-700";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 2500);
          }}
          className={`fixed inset-0 z-[100] ${bgGradient} flex flex-col items-center justify-center`}
          data-testid="celebration-overlay"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <HappyFaceIcon className="w-40 h-40" />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-4"
          >
            {isMorning ? (
              <>
                <CloudIcon className="w-12 h-10 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SunIcon className="w-16 h-16 text-yellow-200" />
                </motion.div>
                <CloudIcon className="w-12 h-10 text-white" />
              </>
            ) : (
              <>
                <MoonIcon className="w-12 h-12 text-yellow-300" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <StarIcon className="w-16 h-16 text-yellow-300" />
                </motion.div>
                <MoonIcon className="w-12 h-12 text-yellow-300 transform scale-x-[-1]" />
              </>
            )}
          </motion.div>

          {isMorning && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <RainbowIcon className="w-32 h-16" />
            </motion.div>
          )}

          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 50,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 0.8,
                repeat: Infinity,
              }}
              className="absolute pointer-events-none"
            >
              {isMorning ? (
                i % 4 === 0 ? (
                  <SunIcon className="w-6 h-6 text-yellow-200" />
                ) : i % 4 === 1 ? (
                  <CloudIcon className="w-8 h-6 text-white/80" />
                ) : i % 4 === 2 ? (
                  <StarIcon className="w-5 h-5 text-white" />
                ) : (
                  <StarIcon className="w-6 h-6 text-amber-200" />
                )
              ) : (
                i % 3 === 0 ? (
                  <StarIcon className="w-8 h-8 text-yellow-300" />
                ) : i % 3 === 1 ? (
                  <StarIcon className="w-5 h-5 text-pink-300" />
                ) : (
                  <StarIcon className="w-6 h-6 text-cyan-300" />
                )
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
