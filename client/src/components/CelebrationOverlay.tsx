import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, PartyPopper } from "lucide-react";

interface CelebrationOverlayProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export default function CelebrationOverlay({
  show,
  message = "Amazing job!",
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
            setTimeout(() => onComplete?.(), 2000);
          }}
          className="fixed inset-0 z-[100] bg-primary/90 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <PartyPopper className="w-32 h-32 text-white mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold font-display text-white text-center"
          >
            {message}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-2xl text-white/80 font-child"
          >
            Time for sweet dreams!
          </motion.p>

          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
              }}
              className="absolute"
            >
              {i % 3 === 0 ? (
                <Star className="w-6 h-6 text-yellow-300" fill="currentColor" />
              ) : i % 3 === 1 ? (
                <Sparkles className="w-6 h-6 text-yellow-200" />
              ) : (
                <Star className="w-4 h-4 text-white/60" fill="currentColor" />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
