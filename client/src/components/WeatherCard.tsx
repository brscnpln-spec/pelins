import { Cloud, Sun, CloudRain, Snowflake, CloudSun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HourlyForecast {
  time: string;
  tempC: number;
  icon: string;
}

interface DailyForecast {
  day: string;
  date: string;
  tempHighC: number;
  tempLowC: number;
  icon: string;
}

interface WeatherData {
  temperatureC: number;
  description: string;
  icon: string;
  hourly?: HourlyForecast[];
  daily?: DailyForecast[];
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

function WeatherIconSmall({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = iconMap[icon] || Cloud;
  return <IconComponent className={className} />;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const WeatherIcon = iconMap[weather.icon] || Cloud;

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-xl">
              <WeatherIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">{Math.round(weather.temperatureC)}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
            </div>
          </div>

          {weather.hourly && weather.hourly.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Today Hourly</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {weather.hourly.slice(0, 8).map((hour, idx) => (
                  <div key={idx} className="flex flex-col items-center min-w-[40px]">
                    <span className="text-xs text-muted-foreground">{hour.time}</span>
                    <WeatherIconSmall icon={hour.icon} className="w-4 h-4 my-1 text-muted-foreground" />
                    <span className="text-xs font-medium">{hour.tempC}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {weather.daily && weather.daily.length > 0 && (
        <Card className="w-full">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium">7-Day Forecast</p>
            <div className="space-y-2">
              {weather.daily.map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm w-16 font-medium">{day.day}</span>
                  <WeatherIconSmall icon={day.icon} className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium">{day.tempHighC}°</span>
                    <span className="text-xs text-muted-foreground">{day.tempLowC}°</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
