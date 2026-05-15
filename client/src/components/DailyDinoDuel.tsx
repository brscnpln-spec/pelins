import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Star, Shield, RotateCcw } from "lucide-react";

interface Duel {
  id: string;
  dinoA: string;
  dinoB: string;
  winner: string;
  explanationCorrect: string;
  explanationWrong: string;
  funFact: string;
}

const DUELS: Duel[] = [
  {
    id: "trex-vs-diplodocus",
    dinoA: "T. rex", dinoB: "Diplodocus", winner: "T. rex",
    explanationCorrect: "Harika! T. rex, güçlü çenesiyle bu düelloda üstünlük sağladı.",
    explanationWrong: "İyi deneme! Diplodocus devasa büyüklükteydi, ama T. rex bugün daha güçlüydü.",
    funFact: "T. rex'in ısırma gücü, karada yaşamış en güçlü ısırıklardan biriydi.",
  },
  {
    id: "ankylosaurus-vs-allosaurus",
    dinoA: "Ankylosaurus", dinoB: "Allosaurus", winner: "Ankylosaurus",
    explanationCorrect: "Mükemmel! Ankylosaurus'un zırhı ve güçlü kuyruğu onu korudu.",
    explanationWrong: "Güzel deneme! Allosaurus hızlıydı, ama Ankylosaurus'un zırhı çok güçlüydü.",
    funFact: "Ankylosaurus'un kuyruk tokmağı bir araba kadar ağırdı.",
  },
  {
    id: "triceratops-vs-velociraptor",
    dinoA: "Triceratops", dinoB: "Velociraptor", winner: "Triceratops",
    explanationCorrect: "Süper! Triceratops'un üç boynuzu ve kalkan kafası onu kazandırdı.",
    explanationWrong: "İyi fikir! Velociraptor zekiydi, ama Triceratops çok daha büyüktü.",
    funFact: "Triceratops'un kafasındaki kalkan 2 metre genişliğe ulaşabilirdi.",
  },
  {
    id: "spinosaurus-vs-carnotaurus",
    dinoA: "Spinosaurus", dinoB: "Carnotaurus", winner: "Spinosaurus",
    explanationCorrect: "Harika! Spinosaurus boyutu ve gücüyle bu düelloda öne geçti.",
    explanationWrong: "Güzel deneme! Carnotaurus hızlıydı, ama Spinosaurus çok daha büyüktü.",
    funFact: "Spinosaurus, T. rex'ten daha uzun olan en büyük etçil dinozordu.",
  },
  {
    id: "stegosaurus-vs-ceratosaurus",
    dinoA: "Stegosaurus", dinoB: "Ceratosaurus", winner: "Stegosaurus",
    explanationCorrect: "Bravo! Stegosaurus'un dikenli kuyruğu Ceratosaurus'u uzak tuttu.",
    explanationWrong: "İyi deneme! Ceratosaurus cesurdu, ama Stegosaurus'un dikenleri çok tehlikeliydi.",
    funFact: "Stegosaurus'un sırtındaki levhalar vücut ısısını düzenlemesine yardımcı oluyordu.",
  },
  {
    id: "brachiosaurus-vs-velociraptor",
    dinoA: "Brachiosaurus", dinoB: "Velociraptor", winner: "Brachiosaurus",
    explanationCorrect: "Mükemmel! Brachiosaurus devasa büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "Güzel fikir! Velociraptor çevikti, ama Brachiosaurus çok daha büyüktü.",
    funFact: "Brachiosaurus boynu sayesinde diğer dinozorlara ulaşılamayan yüksek dalları yiyordu.",
  },
  {
    id: "utahraptor-vs-gallimimus",
    dinoA: "Utahraptor", dinoB: "Gallimimus", winner: "Utahraptor",
    explanationCorrect: "Harika! Utahraptor güçlü pençeleriyle bu düelloda üstün geldi.",
    explanationWrong: "Güzel deneme! Gallimimus çok hızlıydı, ama Utahraptor onu yakaladı.",
    funFact: "Utahraptor, raptor ailesinin en büyük üyelerinden biriydi.",
  },
  {
    id: "pachycephalosaurus-vs-troodon",
    dinoA: "Pachycephalosaurus", dinoB: "Troodon", winner: "Pachycephalosaurus",
    explanationCorrect: "Süper! Pachycephalosaurus kafasıyla güçlü bir savunma yaptı.",
    explanationWrong: "İyi fikir! Troodon zekiydi, ama Pachycephalosaurus kafası daha güçlüydü.",
    funFact: "Pachycephalosaurus'un kafası 25 cm kalınlığında kemikle kaplıydı.",
  },
  {
    id: "iguanodon-vs-dilophosaurus",
    dinoA: "Iguanodon", dinoB: "Dilophosaurus", winner: "Iguanodon",
    explanationCorrect: "Bravo! Iguanodon'un başparmak dikeni onu korudu.",
    explanationWrong: "Güzel deneme! Dilophosaurus ataktı, ama Iguanodon çok daha büyüktü.",
    funFact: "Iguanodon, başparmağında keskin bir diken taşıyan ilk keşfedilen dinozorlardan biriydi.",
  },
  {
    id: "kentrosaurus-vs-allosaurus",
    dinoA: "Kentrosaurus", dinoB: "Allosaurus", winner: "Kentrosaurus",
    explanationCorrect: "Harika! Kentrosaurus'un sivri dikenleri Allosaurus'u püskürttü.",
    explanationWrong: "İyi deneme! Allosaurus güçlüydü, ama Kentrosaurus'un dikenleri çok etkindi.",
    funFact: "Kentrosaurus'un omuzlarından çıkan uzun dikenleri mükemmel bir savunmaydı.",
  },
  {
    id: "parasaurolophus-vs-velociraptor",
    dinoA: "Parasaurolophus", dinoB: "Velociraptor", winner: "Parasaurolophus",
    explanationCorrect: "Süper! Parasaurolophus büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "Güzel fikir! Velociraptor çabuktu, ama Parasaurolophus çok daha büyüktü.",
    funFact: "Parasaurolophus'un ibik şeklindeki başlığı ses çıkarmak için kullanılıyordu.",
  },
  {
    id: "giganotosaurus-vs-stegosaurus",
    dinoA: "Giganotosaurus", dinoB: "Stegosaurus", winner: "Giganotosaurus",
    explanationCorrect: "Mükemmel! Giganotosaurus'un avlanma gücü bu düelloda üstün geldi.",
    explanationWrong: "Güzel deneme! Stegosaurus iyi savunma yaptı, ama Giganotosaurus çok güçlüydü.",
    funFact: "Giganotosaurus, Güney Amerika'da yaşamış en büyük etçil dinozorlardan biriydi.",
  },
  {
    id: "carnotaurus-vs-ankylosaurus",
    dinoA: "Carnotaurus", dinoB: "Ankylosaurus", winner: "Ankylosaurus",
    explanationCorrect: "Bravo! Ankylosaurus'un zırhı her saldırıya karşı koydu.",
    explanationWrong: "İyi fikir! Carnotaurus hızlıydı, ama Ankylosaurus'un zırhı yenilmezdi.",
    funFact: "Ankylosaurus'un zırhı tank gibi sağlamdı ve neredeyse delilmezdi.",
  },
  {
    id: "deinonychus-vs-gallimimus",
    dinoA: "Deinonychus", dinoB: "Gallimimus", winner: "Deinonychus",
    explanationCorrect: "Harika! Deinonychus zekice bir avlanma stratejisiyle kazandı.",
    explanationWrong: "Güzel deneme! Gallimimus çok hızlıydı, ama Deinonychus daha zekiceydi.",
    funFact: "Deinonychus, sürü halinde avlanması nedeniyle son derece etkili bir avcıydı.",
  },
  {
    id: "styracosaurus-vs-dilophosaurus",
    dinoA: "Styracosaurus", dinoB: "Dilophosaurus", winner: "Styracosaurus",
    explanationCorrect: "Süper! Styracosaurus'un boynuzları ve kalkanı onu korudu.",
    explanationWrong: "İyi deneme! Dilophosaurus ataktı, ama Styracosaurus'un boynuzları daha güçlüydü.",
    funFact: "Styracosaurus'un kafasında 6 uzun boynuz ve büyük bir burun boynuzu vardı.",
  },
  {
    id: "baryonyx-vs-iguanodon",
    dinoA: "Baryonyx", dinoB: "Iguanodon", winner: "Baryonyx",
    explanationCorrect: "Mükemmel! Baryonyx'in kanca şeklindeki pençesi bu düelloda belirleyiciydi.",
    explanationWrong: "Güzel deneme! Iguanodon iyi savundu, ama Baryonyx'in pençesi çok güçlüydü.",
    funFact: "Baryonyx, kanca şeklindeki büyük tırnağıyla balık avlamakta ustaydı.",
  },
  {
    id: "suchomimus-vs-carnotaurus",
    dinoA: "Suchomimus", dinoB: "Carnotaurus", winner: "Suchomimus",
    explanationCorrect: "Bravo! Suchomimus boyutu ve uzun çeneleriyle galip geldi.",
    explanationWrong: "İyi fikir! Carnotaurus çevikti, ama Suchomimus çok daha büyüktü.",
    funFact: "Suchomimus'un çenesi timsah çenesine çok benziyordu.",
  },
  {
    id: "albertosaurus-vs-protoceratops",
    dinoA: "Albertosaurus", dinoB: "Protoceratops", winner: "Albertosaurus",
    explanationCorrect: "Harika! Albertosaurus güçlü avlanma yeteneğiyle kazandı.",
    explanationWrong: "Güzel deneme! Protoceratops savundu, ama Albertosaurus daha güçlüydü.",
    funFact: "Albertosaurus, T. rex'in daha küçük ama aynı ailede olan kuzeni sayılır.",
  },
  {
    id: "euoplocephalus-vs-ceratosaurus",
    dinoA: "Euoplocephalus", dinoB: "Ceratosaurus", winner: "Euoplocephalus",
    explanationCorrect: "Süper! Euoplocephalus'un zırhı ve kuyruk tokmağı onu korudu.",
    explanationWrong: "İyi deneme! Ceratosaurus cesurdu, ama Euoplocephalus'un zırhı çok güçlüydü.",
    funFact: "Euoplocephalus'un gözkapakları bile kemikle kaplıydı.",
  },
  {
    id: "majungasaurus-vs-ouranosaurus",
    dinoA: "Majungasaurus", dinoB: "Ouranosaurus", winner: "Majungasaurus",
    explanationCorrect: "Mükemmel! Majungasaurus güçlü avlanma gücüyle galip geldi.",
    explanationWrong: "Güzel fikir! Ouranosaurus büyüktü, ama Majungasaurus daha güçlü bir avcıydı.",
    funFact: "Majungasaurus, Madagaskar adasının en güçlü avcısıydı.",
  },
  {
    id: "acrocanthosaurus-vs-parasaurolophus",
    dinoA: "Acrocanthosaurus", dinoB: "Parasaurolophus", winner: "Acrocanthosaurus",
    explanationCorrect: "Bravo! Acrocanthosaurus'un gücü bu düelloda belirleyiciydi.",
    explanationWrong: "İyi deneme! Parasaurolophus büyüktü, ama Acrocanthosaurus daha güçlü bir avcıydı.",
    funFact: "Acrocanthosaurus sırtındaki uzun dikenleriyle çok etkileyici görünüyordu.",
  },
  {
    id: "torosaurus-vs-utahraptor",
    dinoA: "Torosaurus", dinoB: "Utahraptor", winner: "Torosaurus",
    explanationCorrect: "Harika! Torosaurus'un devasa boynuzları ve kalkanı onu kazandırdı.",
    explanationWrong: "Güzel deneme! Utahraptor pençeliydi, ama Torosaurus çok daha büyüktü.",
    funFact: "Torosaurus'un kafası, bilinen tüm kara hayvanları arasında en büyük kafalardan biriydi.",
  },
  {
    id: "dreadnoughtus-vs-allosaurus",
    dinoA: "Dreadnoughtus", dinoB: "Allosaurus", winner: "Dreadnoughtus",
    explanationCorrect: "Süper! Dreadnoughtus devasa büyüklüğüyle bu düelloyu kolayca kazandı.",
    explanationWrong: "İyi fikir! Allosaurus güçlüydü, ama Dreadnoughtus çok çok daha büyüktü.",
    funFact: "Dreadnoughtus, bilinen en ağır dinozorlardan biriydi — yaklaşık 65 ton!",
  },
  {
    id: "megalosaurus-vs-camptosaurus",
    dinoA: "Megalosaurus", dinoB: "Camptosaurus", winner: "Megalosaurus",
    explanationCorrect: "Mükemmel! Megalosaurus'un avlanma gücü galip gelmesini sağladı.",
    explanationWrong: "Güzel deneme! Camptosaurus savundu, ama Megalosaurus daha güçlüydü.",
    funFact: "Megalosaurus, bilim insanlarının keşfettiği ilk dinozordu.",
  },
  {
    id: "plateosaurus-vs-coelophysis",
    dinoA: "Plateosaurus", dinoB: "Coelophysis", winner: "Plateosaurus",
    explanationCorrect: "Bravo! Plateosaurus boyutu sayesinde bu düelloda üstün geldi.",
    explanationWrong: "İyi deneme! Coelophysis çevikti, ama Plateosaurus çok daha büyüktü.",
    funFact: "Plateosaurus, Triyas döneminin en büyük bitkisel beslenen dinozorlarından biriydi.",
  },
  {
    id: "sinraptor-vs-kentrosaurus",
    dinoA: "Sinraptor", dinoB: "Kentrosaurus", winner: "Kentrosaurus",
    explanationCorrect: "Harika! Kentrosaurus'un keskin dikenleri Sinraptor'u uzak tuttu.",
    explanationWrong: "İyi deneme! Sinraptor güçlüydü, ama Kentrosaurus'un dikenleri çok tehlikeliydi.",
    funFact: "Kentrosaurus'un ismi 'sivri uçlu kertenkele' anlamına gelir.",
  },
  {
    id: "tarbosaurus-vs-saurolophus",
    dinoA: "Tarbosaurus", dinoB: "Saurolophus", winner: "Tarbosaurus",
    explanationCorrect: "Süper! Tarbosaurus güçlü avcı özellikleriyle galip geldi.",
    explanationWrong: "Güzel deneme! Saurolophus büyüktü, ama Tarbosaurus daha güçlü bir avcıydı.",
    funFact: "Tarbosaurus, Asya'da yaşayan T. rex'in en yakın akrabasıydı.",
  },
  {
    id: "edmontosaurus-vs-troodon",
    dinoA: "Edmontosaurus", dinoB: "Troodon", winner: "Edmontosaurus",
    explanationCorrect: "Mükemmel! Edmontosaurus büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "İyi fikir! Troodon zekiydi, ama Edmontosaurus çok daha büyüktü.",
    funFact: "Edmontosaurus sürüler halinde yaşardı, bu da onları daha güvende tutuyordu.",
  },
  {
    id: "therizinosaurus-vs-trex",
    dinoA: "Therizinosaurus", dinoB: "T. rex", winner: "T. rex",
    explanationCorrect: "Bravo! T. rex güçlü avlanma yeteneğiyle galip geldi.",
    explanationWrong: "Güzel deneme! Therizinosaurus devasa tırnaklara sahipti, ama T. rex bugün daha üstündü.",
    funFact: "Therizinosaurus'un tırnakları 1 metreyi aşıyordu — dinozorların en uzun tırnakları!",
  },
  {
    id: "quetzalcoatlus-vs-velociraptor",
    dinoA: "Quetzalcoatlus", dinoB: "Velociraptor", winner: "Quetzalcoatlus",
    explanationCorrect: "Harika! Quetzalcoatlus kanat açıklığı ve boyutuyla bu düelloyu kazandı.",
    explanationWrong: "İyi deneme! Velociraptor çevikti, ama Quetzalcoatlus çok daha büyüktü.",
    funFact: "Quetzalcoatlus'un kanat açıklığı küçük bir uçağa eşitti — yaklaşık 10-11 metre!",
  },
];

interface StoredResult {
  duelId: string;
  selected: string;
  winner: string;
  isCorrect: boolean;
  answeredAt: string;
}

type DuelState = "idle" | "animating" | "answered";

function getTodayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getStorageKey(): string {
  return `dino-duel-result-${getTodayKey()}`;
}

function getTodayDuel(): Duel {
  const todayKey = getTodayKey();
  const dayNumber = todayKey.replaceAll("-", "");
  const index = Number(dayNumber) % DUELS.length;
  return DUELS[index];
}

export default function DailyDinoDuel() {
  const duel = getTodayDuel();

  const [state, setState] = useState<DuelState>(() => {
    const stored = localStorage.getItem(getStorageKey());
    return stored ? "answered" : "idle";
  });

  const [result, setResult] = useState<StoredResult | null>(() => {
    const stored = localStorage.getItem(getStorageKey());
    return stored ? JSON.parse(stored) : null;
  });

  const [selected, setSelected] = useState<string | null>(null);

  const handleChoice = useCallback((choice: string) => {
    if (state !== "idle") return;
    setSelected(choice);
    setState("animating");

    setTimeout(() => {
      const isCorrect = choice === duel.winner;
      const res: StoredResult = {
        duelId: duel.id,
        selected: choice,
        winner: duel.winner,
        isCorrect,
        answeredAt: new Date().toISOString(),
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(res));
      setResult(res);
      setState("answered");
    }, 3500);
  }, [state, duel]);

  // Dev reset: press R to clear today's answer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        localStorage.removeItem(getStorageKey());
        setResult(null);
        setSelected(null);
        setState("idle");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
        border: "1px solid rgba(251,146,60,0.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      data-testid="section-dino-duel"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(251,146,60,0.2)", background: "rgba(251,146,60,0.08)" }}
      >
        <Swords className="text-orange-400" style={{ width: 18, height: 18 }} />
        <span className="font-black text-orange-400 text-sm tracking-wide uppercase">
          Günlük Dino Düellosu
        </span>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">

          {/* ─── IDLE: choose a dino ─── */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-stone-400 text-xs mb-3 tracking-wide uppercase">
                Bugün hangisi üstün gelir?
              </p>

              <div className="flex items-center gap-3">
                {/* Dino A button */}
                <DinoButton name={duel.dinoA} accent="#f97316" onClick={() => handleChoice(duel.dinoA)} />

                {/* VS divider */}
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                  <div style={{ width: 1, height: 20, background: "rgba(251,146,60,0.3)" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#f97316", letterSpacing: "0.1em" }}>VS</span>
                  <div style={{ width: 1, height: 20, background: "rgba(251,146,60,0.3)" }} />
                </div>

                {/* Dino B button */}
                <DinoButton name={duel.dinoB} accent="#fb923c" onClick={() => handleChoice(duel.dinoB)} />
              </div>

              <p className="text-center text-stone-500 text-xs mt-3">
                Seçimini yap!
              </p>
            </motion.div>
          )}

          {/* ─── ANIMATING: duel in progress ─── */}
          {state === "animating" && (
            <motion.div
              key="animating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-orange-400 font-black text-sm tracking-widest uppercase">
                Düello başladı!
              </p>

              <div className="flex items-center gap-2 w-full">
                {/* Dino A slides right */}
                <motion.div
                  className="flex-1 text-center"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DinoCard
                    name={duel.dinoA}
                    highlighted={selected === duel.dinoA}
                    accent="#f97316"
                  />
                </motion.div>

                {/* VS pulsing */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fbbf24" }}>⚡</span>
                </motion.div>

                {/* Dino B slides left */}
                <motion.div
                  className="flex-1 text-center"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DinoCard
                    name={duel.dinoB}
                    highlighted={selected === duel.dinoB}
                    accent="#fb923c"
                  />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(251,146,60,0.15)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f97316, #fbbf24)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {/* ─── ANSWERED: show result ─── */}
          {state === "answered" && result && (
            <motion.div
              key="answered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {/* Correct / Wrong badge */}
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  background: result.isCorrect
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(99,102,241,0.15)",
                  border: `1px solid ${result.isCorrect ? "rgba(34,197,94,0.35)" : "rgba(99,102,241,0.35)"}`,
                }}
              >
                {result.isCorrect
                  ? <Star style={{ width: 18, height: 18, color: "#22c55e" }} />
                  : <Shield style={{ width: 18, height: 18, color: "#818cf8" }} />
                }
                <p
                  className="font-black text-sm"
                  style={{ color: result.isCorrect ? "#22c55e" : "#818cf8" }}
                >
                  {result.isCorrect ? "Doğru bildin!" : "İyi deneme!"}
                </p>
              </div>

              {/* Explanation */}
              <p className="text-stone-300 text-xs leading-relaxed">
                {result.isCorrect ? duel.explanationCorrect : duel.explanationWrong}
              </p>

              {/* Result details row */}
              <div className="flex gap-2">
                <div
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-0.5">Seçimin</p>
                  <p className="text-white font-bold text-xs leading-tight">{result.selected}</p>
                </div>
                <div
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-0.5">Kazanan</p>
                  <p className="text-green-400 font-bold text-xs leading-tight">{result.winner}</p>
                </div>
              </div>

              {/* Fun fact */}
              <div
                className="rounded-xl px-3 py-2"
                style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.18)" }}
              >
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Dino Bilgi
                </p>
                <p className="text-stone-400 text-xs leading-snug">{duel.funFact}</p>
              </div>

              {/* Next duel notice */}
              <div className="flex items-center justify-center gap-1">
                <RotateCcw style={{ width: 12, height: 12, color: "#57534e" }} />
                <p className="text-stone-600 text-[10px]">Yarın yeni bir düello seni bekliyor!</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function DinoButton({ name, accent, onClick }: { name: string; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl py-3 px-2 text-center transition-all active:scale-95 select-none cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${accent}22 0%, ${accent}11 100%)`,
        border: `1.5px solid ${accent}44`,
        minHeight: 64,
      }}
      data-testid={`button-duel-choice-${name.toLowerCase().replace(/[^a-z]/g, "-")}`}
    >
      <p className="font-black text-white text-sm leading-tight">{name}</p>
      <p style={{ color: accent, fontSize: "0.65rem", marginTop: 2, fontWeight: 600 }}>
        Seç!
      </p>
    </button>
  );
}

function DinoCard({ name, highlighted, accent }: { name: string; highlighted: boolean; accent: string }) {
  return (
    <div
      className="rounded-xl py-3 px-2"
      style={{
        background: highlighted ? `${accent}33` : "rgba(255,255,255,0.05)",
        border: `1.5px solid ${highlighted ? accent : "rgba(255,255,255,0.1)"}`,
        boxShadow: highlighted ? `0 0 16px ${accent}44` : "none",
        transition: "all 0.3s",
      }}
    >
      <p className="font-black text-white text-xs leading-tight">{name}</p>
    </div>
  );
}
