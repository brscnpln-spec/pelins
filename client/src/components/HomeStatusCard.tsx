import { Lightbulb, Thermometer, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HomeEntity {
  id: string;
  friendlyName: string;
  state: string;
  type?: "light" | "temperature" | "window" | "sensor";
}

interface HomeStatusCardProps {
  entity: HomeEntity;
}

const iconMap: Record<string, typeof Lightbulb> = {
  light: Lightbulb,
  temperature: Thermometer,
  window: Wind,
  sensor: Thermometer,
};

export default function HomeStatusCard({ entity }: HomeStatusCardProps) {
  const Icon = iconMap[entity.type || "sensor"] || Thermometer;
  const isOn = entity.state === "on";
  const isNumeric = !isNaN(parseFloat(entity.state));

  return (
    <Card
      className={`min-w-[100px] ${entity.type === "light" && isOn ? "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" : ""}`}
      data-testid={`home-status-${entity.id}`}
    >
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-2 ${
          entity.type === "light" && isOn
            ? "bg-amber-200 dark:bg-amber-800"
            : "bg-muted"
        }`}>
          <Icon className={`w-6 h-6 ${entity.type === "light" && isOn ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} />
        </div>
        <span className="text-sm text-muted-foreground truncate w-full">
          {entity.friendlyName}
        </span>
        <span className="text-xl font-bold mt-1">
          {isNumeric ? `${entity.state}°` : entity.state.charAt(0).toUpperCase() + entity.state.slice(1)}
        </span>
      </CardContent>
    </Card>
  );
}
