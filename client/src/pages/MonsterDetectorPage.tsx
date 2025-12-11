import PageHeader from "@/components/PageHeader";
import MonsterScanner from "@/components/MonsterScanner";
import BottomNav from "@/components/BottomNav";

export default function MonsterDetectorPage() {
  const handleScanStart = () => {
    // todo: replace with API call to trigger Home Assistant light flash
    console.log("Monster scan started - would trigger HA light flash");
  };

  const handleScanComplete = () => {
    // todo: replace with API call to log scan result
    console.log("Monster scan complete - would log to database");
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <PageHeader title="Monster Detector 3000" childFriendly />

      <main className="flex-1 flex flex-col">
        <MonsterScanner
          onScanStart={handleScanStart}
          onScanComplete={handleScanComplete}
        />
      </main>

      <BottomNav />
    </div>
  );
}
