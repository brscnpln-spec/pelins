import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const CONFETTI_COLORS = [
  "#facc15", "#22c55e", "#f97316", "#38bdf8", "#a855f7",
  "#ec4899", "#ef4444", "#84cc16",
];

const CONFETTI_COUNT = 36;

function Confetti() {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const left = `${(i / CONFETTI_COUNT) * 100 + (Math.sin(i * 2.5) * 4)}%`;
    const delay = `${(i * 0.11) % 2.4}s`;
    const duration = `${2.8 + (i % 5) * 0.4}s`;
    const size = i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 12;
    const isCircle = i % 2 === 0;
    return { color, left, delay, duration, size, isCircle, key: i };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {pieces.map(({ color, left, delay, duration, size, isCircle, key }) => (
        <div
          key={key}
          className="absolute top-0"
          style={{
            left,
            width: size,
            height: isCircle ? size : size * 0.55,
            borderRadius: isCircle ? "50%" : "2px",
            backgroundColor: color,
            opacity: 0.85,
            animationName: "confettiFall",
            animationDuration: duration,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: delay,
            transform: `rotate(${key * 37}deg)`,
          }}
        />
      ))}
    </div>
  );
}

const DINO_EMOJIS = ["🦕", "🦖"];

function FloatingDino({ emoji, x, delay }: { emoji: string; x: string; delay: number }) {
  return (
    <motion.div
      className="absolute text-5xl select-none pointer-events-none"
      style={{ left: x, top: "15%" }}
      animate={{ y: [0, -18, 0], rotate: [0, 6, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {emoji}
    </motion.div>
  );
}

const DINO_POSITIONS = [
  { emoji: "🦕", x: "4%", delay: 0 },
  { emoji: "🦖", x: "88%", delay: 0.8 },
  { emoji: "🦕", x: "18%", delay: 1.6 },
  { emoji: "🦖", x: "74%", delay: 0.4 },
];

const FOOTPRINTS = ["🐾", "🐾", "🐾", "🐾", "🐾", "🐾"];

export default function BirthdayDashboard() {
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSparkle(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.9; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 0 24px 4px rgba(250,204,21,0.5), 0 0 48px 8px rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 36px 8px rgba(250,204,21,0.8), 0 0 64px 16px rgba(34,197,94,0.5); }
        }
        .age-badge { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      <div
        className="relative flex flex-col h-screen pb-[72px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #14532d 0%, #15803d 30%, #166534 55%, #1e3a5f 100%)",
        }}
      >
        <Confetti />

        {/* Floating dinos */}
        {DINO_POSITIONS.map((d, i) => (
          <FloatingDino key={i} emoji={d.emoji} x={d.x} delay={d.delay} />
        ))}

        {/* Leaf/jungle decoration top */}
        <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none z-0 px-2">
          {["🌿", "🍃", "🌱", "🍃", "🌿"].map((l, i) => (
            <span key={i} className="text-3xl opacity-60">{l}</span>
          ))}
        </div>

        {/* HERO */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 gap-3">

          {/* Headline */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1
              className="font-black leading-tight tracking-tight"
              style={{
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                color: "#facc15",
                textShadow: "0 3px 16px rgba(0,0,0,0.5), 0 1px 0 rgba(250,204,21,0.4)",
              }}
            >
              🎉 İyi ki doğdun
            </h1>
            <h1
              className="font-black leading-tight"
              style={{
                fontSize: "clamp(3rem, 10vw, 6rem)",
                color: "#ffffff",
                textShadow: "0 4px 24px rgba(0,0,0,0.6), 0 2px 0 rgba(34,197,94,0.6)",
                letterSpacing: "-0.02em",
              }}
            >
              KEREM!
            </h1>
          </motion.div>

          {/* Age + Cards row */}
          <motion.div
            className="flex items-center gap-4 w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {/* Big 7 badge */}
            <div
              className="age-badge flex-shrink-0 flex flex-col items-center justify-center rounded-3xl"
              style={{
                width: 130,
                height: 130,
                background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
                boxShadow: "0 0 24px 4px rgba(250,204,21,0.5)",
              }}
            >
              <span
                style={{
                  fontSize: "5rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "#14532d",
                  textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                7
              </span>
              <span className="text-green-900 font-bold text-sm -mt-1">yaşında!</span>
            </div>

            {/* Info cards column */}
            <div className="flex flex-col gap-3 flex-1">
              {/* Card 1 */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span className="text-3xl">🦕</span>
                <div>
                  <p className="text-yellow-300 font-black text-base leading-tight">Dino Partisi Başladı!</p>
                  <p className="text-green-200 text-xs">Dinozorlar seninle kutluyor 🎊</p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span className="text-3xl">🎂</span>
                <div>
                  <p className="text-orange-300 font-black text-base leading-tight">Bugün Kutlama Günü!</p>
                  <p className="text-green-200 text-xs">9 Nisan — Kerem'in özel günü ✨</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Birthday message */}
          <motion.div
            className="w-full max-w-2xl rounded-2xl px-5 py-4 text-center"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-white font-semibold text-sm leading-relaxed">
              🌿 Sevgili Kerem, bugün sen de dinozorlar kadar güçlüsün! 🦖
              <br />
              7 yaşında yeni maceralar seni bekliyor — mutlu doğum günleri olsun! 🎈
            </p>
          </motion.div>

          {/* Footprints decoration */}
          <div className="flex gap-3 opacity-50">
            {FOOTPRINTS.map((f, i) => (
              <motion.span
                key={i}
                className="text-lg text-green-300"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
              >
                🦶
              </motion.span>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
