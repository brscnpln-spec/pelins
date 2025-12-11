import { useState } from "react";
import RitualStepCard from "../RitualStepCard";

function ToothIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path d="M12 2C9.5 2 7.5 3.5 7 6c-.5 2.5-1 5-1 7 0 3 .5 5 1.5 7 .5 1 1 2 2.5 2s2-1 2-2.5V17c0-.5.5-1 1-1s1 .5 1 1v2.5c0 1.5.5 2.5 2 2.5s2-1 2.5-2c1-2 1.5-4 1.5-7 0-2-.5-4.5-1-7-.5-2.5-2.5-4-5-4z"/>
    </svg>
  );
}

export default function RitualStepCardExample() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="p-8 flex gap-4">
      <RitualStepCard
        step="TEETH"
        label="Teeth"
        icon={<ToothIcon />}
        completed={completed}
        onComplete={() => setCompleted(true)}
      />
      <RitualStepCard
        step="TOILET"
        label="Toilet"
        icon={<ToothIcon />}
        completed={true}
        onComplete={() => {}}
      />
    </div>
  );
}
