import { useState } from "react";
import { Shield, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type ScanState = "idle" | "scanning" | "safe";

interface MonsterScannerProps {
  onScanStart?: () => void;
  onScanComplete?: () => void;
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
            <Button
              onClick={handleStartScan}
              className="w-[200px] h-[200px] rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center gap-2"
              data-testid="button-start-scan"
            >
              <Shield className="w-16 h-16" />
              <span className="text-2xl font-bold font-display">START SCAN</span>
            </Button>
            <p className="mt-6 text-xl text-muted-foreground font-child text-center">
              Tap the button to scan for monsters
            </p>
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
                className="absolute inset-0 rounded-full border-4 border-primary opacity-30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary opacity-50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                <motion.div
                  className="absolute w-1/2 h-1 bg-primary origin-left"
                  style={{ left: "50%", top: "50%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <Shield className="w-16 h-16 text-primary z-10" />
              </div>
            </div>
            <motion.p
              className="mt-8 text-2xl font-bold font-display text-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Scanning for monsters...
            </motion.p>
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
              className="w-[200px] h-[200px] rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
            >
              <ShieldCheck className="w-24 h-24 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-3xl font-bold font-display text-green-600 dark:text-green-400"
            >
              All Clear!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-xl text-muted-foreground font-child"
            >
              No monsters detected. The room is safe!
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-6 min-h-[60px] px-8 text-lg font-child"
                data-testid="button-scan-again"
              >
                Scan Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
