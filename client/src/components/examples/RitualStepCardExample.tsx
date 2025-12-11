import { useState } from "react";
import RitualStepCard from "../RitualStepCard";

function ToothIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <ellipse cx="40" cy="45" rx="28" ry="30" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <ellipse cx="30" cy="65" rx="8" ry="12" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="white" stroke="#60A5FA" strokeWidth="3" />
      <circle cx="32" cy="28" r="4" fill="#60A5FA" />
      <circle cx="48" cy="28" r="4" fill="#60A5FA" />
      <path d="M36 38 Q40 42 44 38" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function RitualStepCardExample() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="p-8 flex gap-4 bg-indigo-50">
      <RitualStepCard
        step="TEETH"
        icon={<ToothIcon />}
        completed={completed}
        onComplete={() => setCompleted(true)}
      />
      <RitualStepCard
        step="TOILET"
        icon={<ToothIcon />}
        completed={true}
        onComplete={() => {}}
      />
    </div>
  );
}
