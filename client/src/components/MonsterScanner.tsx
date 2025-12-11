import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScanState = "idle" | "scanning" | "safe";

interface MonsterScannerProps {
  onScanStart?: () => void;
  onScanComplete?: () => void;
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 4L8 16v16c0 14 10 26 24 30 14-4 24-16 24-30V16L32 4z"
        fill="url(#shieldGradient)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M24 32l6 6 12-12"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="shieldGradient" x1="8" y1="4" x2="56" y2="50">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HappyMonsterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className}>
      <circle cx="60" cy="60" r="50" fill="#86EFAC" />
      <ellipse cx="42" cy="50" rx="12" ry="14" fill="white" />
      <ellipse cx="78" cy="50" rx="12" ry="14" fill="white" />
      <circle cx="42" cy="52" r="6" fill="#1F2937" />
      <circle cx="78" cy="52" r="6" fill="#1F2937" />
      <circle cx="44" cy="49" r="2" fill="white" />
      <circle cx="80" cy="49" r="2" fill="white" />
      <path
        d="M40 75 Q60 95 80 75"
        stroke="#1F2937"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="28" cy="65" rx="8" ry="5" fill="#FCA5A5" opacity="0.6" />
      <ellipse cx="92" cy="65" rx="8" ry="5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="30" cy="25" r="12" fill="#86EFAC" />
      <circle cx="90" cy="25" r="12" fill="#86EFAC" />
    </svg>
  );
}

function NoMonsterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <circle cx="100" cy="100" r="85" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="6" />
      <circle cx="70" cy="85" r="18" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="130" cy="85" r="18" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="70" cy="88" r="8" fill="#1F2937" />
      <circle cx="130" cy="88" r="8" fill="#1F2937" />
      <circle cx="73" cy="84" r="3" fill="white" />
      <circle cx="133" cy="84" r="3" fill="white" />
      <path
        d="M65 125 Q100 155 135 125"
        stroke="#1F2937"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="100" cy="55" r="10" fill="#FCD34D" />
      <path d="M100 45 L100 35 M92 48 L85 42 M108 48 L115 42" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M155 145 L45 55"
        stroke="#EF4444"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0"
      />
    </svg>
  );
}

function SleepyStarsIcon({ className }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}>
      <motion.path
        d="M50 5 L58 35 L90 35 L64 55 L72 85 L50 68 L28 85 L36 55 L10 35 L42 35 Z"
        fill="#FDE047"
        stroke="#FACC15"
        strokeWidth="2"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export default function MonsterScanner({ onScanStart, onScanComplete }: MonsterScannerProps) {
  const [scanState, setScanState] = useState<ScanState>("idle");

  const handleStartScan = () => {
    setScanState("scanning");
    onScanStart?.();
    
    setTimeout(() => {
      setScanState("safe");
      onScanComplete?.();
    }, 3500);
  };

  const handleReset = () => {
    setScanState("idle");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8">
      <AnimatePresence mode="wait">
        {scanState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.button
              onClick={handleStartScan}
              className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center shadow-xl border-4 border-blue-300"
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.4)",
                  "0 0 0 20px rgba(59, 130, 246, 0)",
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              data-testid="button-start-scan"
            >
              <ShieldIcon className="w-24 h-24 text-white" />
            </motion.button>
            
            <motion.div
              className="mt-8 flex gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <SleepyStarsIcon className="w-8 h-8" />
              <SleepyStarsIcon className="w-10 h-10" />
              <SleepyStarsIcon className="w-8 h-8" />
            </motion.div>
          </motion.div>
        )}

        {scanState === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-[220px] h-[220px]">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-400"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-400"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-400"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
              />
              
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center overflow-hidden">
                <motion.div
                  className="absolute w-full h-1 bg-blue-500 origin-left"
                  style={{ left: "50%", top: "50%", transformOrigin: "left center" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <ShieldIcon className="w-20 h-20 text-blue-500 z-10" />
              </div>
            </div>
            
            <motion.div
              className="mt-6 flex gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-blue-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {scanState === "safe" && (
          <motion.div
            key="safe"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <NoMonsterIcon className="w-48 h-48" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SleepyStarsIcon className="w-12 h-12" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <SleepyStarsIcon className="w-10 h-10" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <HappyMonsterIcon className="w-20 h-20 mx-auto" />
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleReset}
              className="mt-6 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg"
              whileTap={{ scale: 0.95 }}
              data-testid="button-scan-again"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
