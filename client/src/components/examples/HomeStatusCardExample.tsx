import HomeStatusCard from "../HomeStatusCard";

export default function HomeStatusCardExample() {
  // todo: remove mock functionality
  const mockEntities = [
    { id: "light.bedroom", friendlyName: "Bedroom Light", state: "on", type: "light" as const },
    { id: "sensor.temp", friendlyName: "Temperature", state: "21.5", type: "temperature" as const },
    { id: "sensor.window", friendlyName: "Window", state: "closed", type: "window" as const },
  ];

  return (
    <div className="p-4 flex gap-4">
      {mockEntities.map((entity) => (
        <HomeStatusCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
}
