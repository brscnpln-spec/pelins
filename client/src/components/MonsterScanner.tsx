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

function BigCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className}>
      <circle cx="60" cy="60" r="55" fill="#22C55E" />
      <circle cx="60" cy="60" r="45" fill="#4ADE80" />
      <motion.path
        d="M35 60 L52 77 L85 44"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </svg>
  );
}

function NoMonsterScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 200" className={className}>
      <rect x="20" y="80" width="100" height="100" rx="8" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="3" />
      <rect x="30" y="90" width="40" height="30" rx="4" fill="#93C5FD" opacity="0.5" />
      <rect x="50" y="130" width="50" height="40" rx="4" fill="#DDD6FE" />
      
      <ellipse cx="70" cy="175" rx="45" ry="8" fill="#E5E7EB" />
      
      <rect x="160" y="100" width="80" height="80" rx="8" fill="#FECACA" stroke="#FCA5A5" strokeWidth="3" />
      <rect x="170" y="110" width="30" height="25" rx="4" fill="#93C5FD" opacity="0.5" />
      <circle cx="200" cy="155" r="8" fill="#A78BFA" />
      
      <ellipse cx="200" cy="175" rx="45" ry="8" fill="#E5E7EB" />
      
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="140" cy="50" r="25" fill="#FDE047" />
        <circle cx="135" cy="45" r="4" fill="#1F2937" />
        <circle cx="145" cy="45" r="4" fill="#1F2937" />
        <path d="M132 55 Q140 62 148 55" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </motion.g>
      
      <motion.text
        x="140"
        y="95"
        textAnchor="middle"
        fill="#22C55E"
        fontSize="16"
        fontWeight="bold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        0
      </motion.text>
      
      <motion.g animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: "50px 60px" }}>
        <rect x="35" y="55" width="30" height="20" rx="4" fill="#86EFAC" />
        <circle cx="50" cy="65" r="4" fill="white" />
        <circle cx="48" cy="64" r="1.5" fill="#1F2937" />
        <circle cx="52" cy="64" r="1.5" fill="#1F2937" />
      </motion.g>
      
      <motion.g animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} style={{ transformOrigin: "230px 60px" }}>
        <rect x="215" y="55" width="30" height="20" rx="4" fill="#FCA5A5" />
        <circle cx="230" cy="65" r="4" fill="white" />
        <circle cx="228" cy="64" r="1.5" fill="#1F2937" />
        <circle cx="232" cy="64" r="1.5" fill="#1F2937" />
      </motion.g>
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
              className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center shadow-xl border-4 border-blue-300"
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
              <ShieldIcon className="w-20 h-20 text-white" />
            </motion.button>
            
            <motion.div
              className="mt-6 flex gap-2"
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
            <div className="relative w-[200px] h-[200px]">
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
                <ShieldIcon className="w-16 h-16 text-blue-500 z-10" />
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <BigCheckIcon className="w-32 h-32" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SleepyStarsIcon className="w-10 h-10" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -left-2"
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <SleepyStarsIcon className="w-8 h-8" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <NoMonsterScene className="w-72 h-48" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mt-4 flex items-center gap-3 bg-green-100 dark:bg-green-900 rounded-full px-6 py-3"
            >
              <span className="text-4xl font-bold text-green-600 dark:text-green-400">0</span>
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="16" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" />
                <circle cx="15" cy="17" r="3" fill="white" />
                <circle cx="25" cy="17" r="3" fill="white" />
                <circle cx="15" cy="18" r="1.5" fill="#1F2937" />
                <circle cx="25" cy="18" r="1.5" fill="#1F2937" />
                <path d="M14 26 Q20 30 26 26" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={handleReset}
              className="mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg"
              whileTap={{ scale: 0.95 }}
              data-testid="button-scan-again"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="3">
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
