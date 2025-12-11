import { Cloud, Sun, CloudRain, Snowflake, CloudSun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  temperatureC: number;
  description: string;
  icon: string;
  forecast?: { day: string; tempC: number; icon: string }[];
}

interface WeatherCardProps {
  weather: WeatherData;
}

const iconMap: Record<string, typeof Cloud> = {
  sunny: Sun,
  cloudy: Cloud,
  "partly-cloudy": CloudSun,
  rain: CloudRain,
  snow: Snowflake,
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  const WeatherIcon = iconMap[weather.icon] || Cloud;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-xl">
            <WeatherIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-4xl font-bold">{Math.round(weather.temperatureC)}°C</p>
            <p className="text-muted-foreground capitalize">{weather.description}</p>
          </div>
        </div>

        {weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex gap-4">
            {weather.forecast.map((day, idx) => {
              const DayIcon = iconMap[day.icon] || Cloud;
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <span className="text-sm text-muted-foreground">{day.day}</span>
                  <DayIcon className="w-6 h-6 my-1 text-muted-foreground" />
                  <span className="font-medium">{day.tempC}°</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
