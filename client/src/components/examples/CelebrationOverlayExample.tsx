import { useState } from "react";
import CelebrationOverlay from "../CelebrationOverlay";
import { Button } from "@/components/ui/button";

export default function CelebrationOverlayExample() {
  const [show, setShow] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setShow(true)} data-testid="button-trigger-celebration">
        Trigger Celebration
      </Button>
      <CelebrationOverlay
        show={show}
        message="All Done!"
        onComplete={() => setShow(false)}
      />
    </div>
  );
}
