import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DigitalClockProps {
  className?: string;
}

export default function DigitalClock({ className = "" }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className={`flex items-center gap-1 ${className}`} data-testid="digital-clock">
      <div className="bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-xl px-4 py-2 shadow-lg">
        <span className="text-4xl font-bold text-white font-mono tracking-wider">
          {hours}
        </span>
      </div>
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="flex flex-col gap-1"
      >
        <div className="w-2 h-2 rounded-full bg-indigo-400" />
        <div className="w-2 h-2 rounded-full bg-indigo-400" />
      </motion.div>
      <div className="bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-xl px-4 py-2 shadow-lg">
        <span className="text-4xl font-bold text-white font-mono tracking-wider">
          {minutes}
        </span>
      </div>
    </div>
  );
}
