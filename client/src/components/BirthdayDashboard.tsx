import { motion } from "framer-motion";
import { Leaf, Cake, PartyPopper, Star, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const CONFETTI_COLORS = [
  "#facc15", "#22c55e", "#f97316", "#38bdf8", "#a855f7",
  "#ec4899", "#ef4444", "#84cc16",
];
const CONFETTI_COUNT = 40;

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const left = `${(i / CONFETTI_COUNT) * 100 + (Math.sin(i * 2.5) * 3)}%`;
        const delay = `${(i * 0.1) % 2.4}s`;
        const duration = `${2.6 + (i % 5) * 0.45}s`;
        const size = i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 12;
        const isCircle = i % 2 === 0;
        return (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left,
              width: size,
              height: isCircle ? size : Math.round(size * 0.55),
              borderRadius: isCircle ? "50%" : 2,
              backgroundColor: color,
              opacity: 0.85,
              animationName: "confettiFall",
              animationDuration: duration,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: delay,
              transform: `rotate(${i * 37}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function BrachiosaurusSVG({ size = 80, color = "#22c55e" }: { size?: number; color?: string }) {
  const dark = color === "#22c55e" ? "#16a34a" : "#c2410c";
  return (
    <svg width={size} height={size} viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="55" cy="70" rx="28" ry="20" fill={color} />
      {/* Neck */}
      <path d="M38 62 Q30 46 33 28 Q35 18 42 12" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="45" cy="10" rx="11" ry="8" fill={dark} />
      {/* Eye */}
      <circle cx="49" cy="8" r="2.5" fill="white" />
      <circle cx="49.5" cy="8.5" r="1.2" fill="#1a1a1a" />
      {/* Nostril */}
      <circle cx="43" cy="10" r="1" fill={dark} opacity="0.5" />
      {/* Smile */}
      <path d="M41 13 Q45 16 49 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Tail */}
      <path d="M82 65 Q92 58 94 49" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Front legs */}
      <rect x="34" y="86" width="9" height="15" rx="4.5" fill={dark} />
      <rect x="47" y="88" width="9" height="13" rx="4.5" fill={dark} />
      {/* Back legs */}
      <rect x="60" y="86" width="9" height="15" rx="4.5" fill={dark} />
      <rect x="72" y="84" width="8" height="13" rx="4" fill={dark} />
      {/* Spots */}
      <circle cx="50" cy="62" r="4" fill={dark} opacity="0.3" />
      <circle cx="64" cy="68" r="3" fill={dark} opacity="0.3" />
    </svg>
  );
}

function TRexSVG({ size = 80, color = "#f97316" }: { size?: number; color?: string }) {
  const dark = color === "#f97316" ? "#ea580c" : "#15803d";
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="52" cy="62" rx="26" ry="22" fill={color} />
      {/* Head */}
      <ellipse cx="78" cy="40" rx="20" ry="15" fill={color} />
      {/* Lower jaw */}
      <path d="M62 48 Q78 56 96 48" fill={dark} />
      {/* Teeth */}
      <path d="M65 48 l2.5 5 l3.5-4 l3.5 4 l3.5-5 l3 4 l3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Eye */}
      <circle cx="84" cy="35" r="5" fill="white" />
      <circle cx="85" cy="35.5" r="2.5" fill="#1a1a1a" />
      <circle cx="86" cy="34.5" r="0.8" fill="white" />
      {/* Brow */}
      <path d="M80 30 Q84 27 89 29" stroke={dark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Tiny arms */}
      <path d="M57 52 Q48 56 45 63" stroke={dark} strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="45" cy="63" r="3" fill={dark} />
      {/* Tail */}
      <path d="M27 58 Q12 54 7 44" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="36" y="80" width="13" height="24" rx="6.5" fill={dark} />
      <rect x="54" y="80" width="13" height="24" rx="6.5" fill={dark} />
      {/* Foot claws */}
      <path d="M36 102 l-4 6 M42 104 l0 6 M48 102 l4 6" stroke={dark} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M54 102 l-4 6 M60 104 l0 6 M66 102 l4 6" stroke={dark} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Belly lighter */}
      <ellipse cx="52" cy="66" rx="14" ry="10" fill="white" opacity="0.15" />
    </svg>
  );
}

function DinoFootprint({ size = 28, opacity = 0.45 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <ellipse cx="20" cy="28" rx="10" ry="8" fill="#22c55e" />
      <ellipse cx="10" cy="18" rx="4.5" ry="6" fill="#22c55e" />
      <ellipse cx="20" cy="15" rx="4.5" ry="6" fill="#22c55e" />
      <ellipse cx="30" cy="18" rx="4.5" ry="6" fill="#22c55e" />
    </svg>
  );
}

function FloatingDino({ Comp, x, delay, color }: {
  Comp: typeof BrachiosaurusSVG | typeof TRexSVG;
  x: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: "8%" }}
      animate={{ y: [0, -16, 0], rotate: [0, 4, -4, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <Comp size={64} color={color} />
    </motion.div>
  );
}

const DINO_POSITIONS = [
  { Comp: BrachiosaurusSVG, x: "2%",  delay: 0,    color: "#22c55e" },
  { Comp: TRexSVG,          x: "82%", delay: 0.9,  color: "#f97316" },
  { Comp: BrachiosaurusSVG, x: "20%", delay: 1.7,  color: "#4ade80" },
  { Comp: TRexSVG,          x: "66%", delay: 0.45, color: "#fb923c" },
];

export default function BirthdayDashboard() {
  return (
    <div
      className="relative flex flex-col h-screen pb-[72px] overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #14532d 0%, #15803d 30%, #166534 58%, #1e3a5f 100%)",
      }}
    >
      <Confetti />

      {/* Floating dinos */}
      {DINO_POSITIONS.map((d, i) => (
        <FloatingDino key={i} Comp={d.Comp} x={d.x} delay={d.delay} color={d.color} />
      ))}

      {/* Top leaf row */}
      <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none z-0 px-3 pt-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <Leaf key={i} className="text-green-400 opacity-50" style={{ width: 28, height: 28, transform: `rotate(${i * 40 - 40}deg)` }} />
        ))}
      </div>

      {/* HERO */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 gap-3">

        {/* Headline */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="text-yellow-300" style={{ width: 28, height: 28 }} />
            <p style={{ fontSize: "clamp(1.25rem,4vw,2rem)", color: "#fde047", fontWeight: 900, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              İyi ki doğdun
            </p>
            <Star className="text-yellow-300" style={{ width: 28, height: 28 }} />
          </div>
          <h1
            style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              color: "#ffffff",
              fontWeight: 900,
              lineHeight: 1,
              textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 2px 0 rgba(34,197,94,0.5)",
              letterSpacing: "-0.02em",
            }}
          >
            KEREM!
          </h1>
        </motion.div>

        {/* Age badge + Info cards row */}
        <motion.div
          className="flex items-center gap-4 w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {/* Big 7 badge */}
          <div
            className="bday-age-badge flex-shrink-0 flex flex-col items-center justify-center rounded-3xl"
            style={{
              width: 128,
              height: 128,
              background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
            }}
          >
            <span style={{ fontSize: "5rem", fontWeight: 900, lineHeight: 1, color: "#14532d" }}>
              7
            </span>
            <span style={{ color: "#14532d", fontWeight: 700, fontSize: "0.85rem", marginTop: -4 }}>
              yaşında!
            </span>
          </div>

          {/* Info cards */}
          <div className="flex flex-col gap-3 flex-1">
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <TRexSVG size={44} color="#f97316" />
              <div>
                <p style={{ color: "#fde047", fontWeight: 900, fontSize: "1rem", lineHeight: 1.2 }}>Dino Partisi Başladı!</p>
                <p style={{ color: "#bbf7d0", fontSize: "0.75rem", marginTop: 2 }}>Dinozorlar seninle kutluyor</p>
              </div>
            </div>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <div className="flex-shrink-0">
                <Cake style={{ width: 40, height: 40, color: "#fb923c" }} />
              </div>
              <div>
                <p style={{ color: "#fdba74", fontWeight: 900, fontSize: "1rem", lineHeight: 1.2 }}>Bugün Kutlama Günü!</p>
                <p style={{ color: "#bbf7d0", fontSize: "0.75rem", marginTop: 2 }}>9 Nisan — Kerem'in özel günü</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Birthday message */}
        <motion.div
          className="w-full max-w-2xl rounded-2xl px-5 py-4"
          style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <Heart className="flex-shrink-0 text-pink-400 mt-0.5" style={{ width: 22, height: 22 }} />
            <p style={{ color: "#f0fdf4", fontWeight: 500, fontSize: "0.88rem", lineHeight: 1.65 }}>
              Sevgili Kerem, bugün sen de dinozorlar kadar güçlüsün!
              <br />
              7 yaşında yeni maceralar seni bekliyor — mutlu doğum günleri olsun!
            </p>
          </div>
        </motion.div>

        {/* Footprints row */}
        <div className="flex gap-2 items-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.28 }}
            >
              <DinoFootprint size={26} opacity={1} />
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
