import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MonsterScanner from "@/components/MonsterScanner";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import { motion } from "framer-motion";

function CloudIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg 
      viewBox="0 0 60 40" 
      className={className}
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 8, repeat: Infinity, delay }}
    >
      <ellipse cx="30" cy="25" rx="20" ry="12" fill="white" opacity="0.6" />
      <ellipse cx="20" cy="22" rx="12" ry="10" fill="white" opacity="0.6" />
      <ellipse cx="40" cy="22" rx="12" ry="10" fill="white" opacity="0.6" />
    </motion.svg>
  );
}

function StarIcon({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      className={className}
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    >
      <path
        d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
        fill="#FDE047"
      />
    </motion.svg>
  );
}

export default function MonsterDetectorPage() {
  const scanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/monster/scan", {});
      return res.json();
    },
  });

  const handleScanStart = () => {
    scanMutation.mutate();
  };

  const handleScanComplete = () => {
    // Scan logged automatically via mutation
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-purple-900 pb-[72px] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <CloudIcon className="absolute top-10 left-10 w-20" delay={0} />
        <CloudIcon className="absolute top-20 right-20 w-16" delay={2} />
        <CloudIcon className="absolute top-32 left-1/3 w-24" delay={4} />
        
        <StarIcon className="absolute top-16 left-1/4 w-4" delay={0} />
        <StarIcon className="absolute top-24 right-1/4 w-3" delay={0.5} />
        <StarIcon className="absolute top-8 right-1/3 w-5" delay={1} />
        <StarIcon className="absolute top-36 left-16 w-3" delay={1.5} />
        <StarIcon className="absolute top-12 right-16 w-4" delay={2} />
        <StarIcon className="absolute top-28 left-1/2 w-3" delay={2.5} />
      </div>

      <header className="flex items-center justify-center px-6 py-4 min-h-[70px] relative z-10">
        <DigitalClock />
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        <MonsterScanner
          onScanStart={handleScanStart}
          onScanComplete={handleScanComplete}
        />
      </main>

      <BottomNav />
    </div>
  );
}
