import MonsterScanner from "../MonsterScanner";

export default function MonsterScannerExample() {
  return (
    <div className="h-[400px] flex">
      <MonsterScanner
        onScanStart={() => console.log("Scan started")}
        onScanComplete={() => console.log("Scan complete")}
      />
    </div>
  );
}
