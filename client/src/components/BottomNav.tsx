import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      <path
        d="M24 16c0-6-5-11-11-11 1 2.5 1.5 5 1.5 8 0 7-6 13-13 13 2.5 3.5 6.5 6 11.5 6 7 0 11-6 11-16z"
        fill={active ? "#FDE047" : "currentColor"}
        stroke={active ? "#FACC15" : "currentColor"}
        strokeWidth="1.5"
      />
      {active && (
        <>
          <circle cx="22" cy="8" r="1" fill="#FACC15" />
          <circle cx="26" cy="14" r="0.8" fill="#FACC15" />
        </>
      )}
    </svg>
  );
}

function ShieldIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      <path
        d="M16 3L5 8v8c0 7 5 13 11 15 6-2 11-8 11-15V8L16 3z"
        fill={active ? "#60A5FA" : "none"}
        stroke={active ? "#3B82F6" : "currentColor"}
        strokeWidth="2"
      />
      {active && (
        <path d="M11 16l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      <path
        d="M5 14L16 5L27 14V26H20V19H12V26H5V14Z"
        fill={active ? "#86EFAC" : "none"}
        stroke={active ? "#22C55E" : "currentColor"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {active && (
        <rect x="13" y="10" width="6" height="5" rx="1" fill="#22C55E" />
      )}
    </svg>
  );
}

interface NavItem {
  path: string;
  icon: (props: { active: boolean }) => JSX.Element;
}

const navItems: NavItem[] = [
  { path: "/", icon: MoonIcon },
  { path: "/monster", icon: ShieldIcon },
  { path: "/dashboard", icon: HomeIcon },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-card border-t border-border flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = location === item.path;
        const Icon = item.icon;
        
        return (
          <Link key={item.path} href={item.path}>
            <motion.button
              className={`flex flex-col items-center justify-center w-20 h-16 rounded-2xl transition-colors ${
                isActive
                  ? "bg-primary/10"
                  : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
              data-testid={`nav-${item.path === "/" ? "ritual" : item.path.slice(1)}`}
            >
              <Icon active={isActive} />
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-primary mt-1"
                />
              )}
            </motion.button>
          </Link>
        );
      })}
    </nav>
  );
}
