import { Moon, Shield, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Moon;
}

const navItems: NavItem[] = [
  { path: "/", label: "Sleep Ritual", icon: Moon },
  { path: "/monster", label: "Monster Detector", icon: Shield },
  { path: "/dashboard", label: "Dashboard", icon: Home },
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
            <button
              className={`flex flex-col items-center justify-center min-w-[80px] min-h-[60px] rounded-xl transition-all active:scale-95 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover-elevate"
              }`}
              data-testid={`nav-${item.path === "/" ? "ritual" : item.path.slice(1)}`}
            >
              <Icon className="w-7 h-7 mb-1" />
              <span className="text-sm font-medium font-child">{item.label}</span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
