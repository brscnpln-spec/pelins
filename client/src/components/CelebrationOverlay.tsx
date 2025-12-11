import { motion, AnimatePresence } from "framer-motion";

interface CelebrationOverlayProps {
  show: boolean;
  message?: string;
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

export default function CelebrationOverlay({
  show,
  onComplete,
}: CelebrationOverlayProps) {
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
          className="fixed inset-0 z-[100] bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center"
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
            <MoonIcon className="w-12 h-12 text-yellow-300" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <StarIcon className="w-16 h-16 text-yellow-300" />
            </motion.div>
            <MoonIcon className="w-12 h-12 text-yellow-300 transform scale-x-[-1]" />
          </motion.div>

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
              {i % 3 === 0 ? (
                <StarIcon className="w-8 h-8 text-yellow-300" />
              ) : i % 3 === 1 ? (
                <StarIcon className="w-5 h-5 text-pink-300" />
              ) : (
                <StarIcon className="w-6 h-6 text-cyan-300" />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
