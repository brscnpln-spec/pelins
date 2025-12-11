import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, addDays, isSameDay } from "date-fns";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake, CloudSun, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  calendarName?: string;
}

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

interface HAEntity {
  id: string;
  friendlyName: string;
  state: string;
  type?: "light" | "temperature" | "window" | "sensor";
}

interface HomeStatusResponse {
  configured: boolean;
  entities: HAEntity[];
}

const iconMap: Record<string, typeof Cloud> = {
  sunny: Sun,
  cloudy: Cloud,
  "partly-cloudy": CloudSun,
  rain: CloudRain,
  snow: Snowflake,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function LoadingSpinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = iconMap[icon] || Cloud;
  return <IconComponent className={className} />;
}

function getDayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE");
}

function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const groups = new Map<string, CalendarEvent[]>();
  const today = new Date();
  const dayAfterTomorrow = addDays(today, 2);

  for (const event of events) {
    const eventDate = new Date(event.start);
    if (isToday(eventDate) || isTomorrow(eventDate) || isSameDay(eventDate, dayAfterTomorrow)) {
      const dayKey = format(eventDate, "yyyy-MM-dd");
      if (!groups.has(dayKey)) {
        groups.set(dayKey, []);
      }
      groups.get(dayKey)!.push(event);
    }
  }

  return groups;
}

export default function FamilyDashboardPage() {
  const { data: calendarData, isLoading: calendarLoading } = useQuery<{ events: CalendarEvent[] }>({
    queryKey: ["/api/dashboard/calendar"],
    refetchInterval: 60000,
  });

  const { data: weatherData, isLoading: weatherLoading } = useQuery<WeatherData>({
    queryKey: ["/api/dashboard/weather"],
    refetchInterval: 300000,
  });

  const { data: homeData } = useQuery<HomeStatusResponse>({
    queryKey: ["/api/dashboard/home-status"],
    refetchInterval: 30000,
  });

  const events = calendarData?.events || [];
  const weather = weatherData || { temperatureC: 0, description: "Loading...", icon: "cloudy", hourly: [], daily: [] };
  const homeEntities = homeData?.entities || [];
  const homeConfigured = homeData?.configured || false;

  const eventsByDay = groupEventsByDay(events);
  const today = new Date();
  const todayKey = format(today, "yyyy-MM-dd");
  const tomorrowKey = format(addDays(today, 1), "yyyy-MM-dd");
  const dayAfterKey = format(addDays(today, 2), "yyyy-MM-dd");

  const todayEvents = eventsByDay.get(todayKey) || [];
  const tomorrowEvents = eventsByDay.get(tomorrowKey) || [];
  const dayAfterEvents = eventsByDay.get(dayAfterKey) || [];

  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold">{getGreeting()}</h1>
          <p className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="flex items-center gap-2">
          <DigitalClock className="scale-[0.6] origin-right" />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 space-y-3">
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Upcoming Events</span>
            {calendarLoading && <LoadingSpinner />}
          </div>
          
          <div className="flex gap-2">
            <Card className="flex-[2] min-w-0">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-primary mb-2">Today</p>
                {todayEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No events</p>
                ) : (
                  <div className="space-y-1">
                    {todayEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-10">
                          {format(new Date(event.start), "HH:mm")}
                        </span>
                        <span className="text-xs font-medium truncate">{event.summary}</span>
                      </div>
                    ))}
                    {todayEvents.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{todayEvents.length - 3} more</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Tomorrow</p>
                {tomorrowEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">-</p>
                ) : (
                  <p className="text-xs">{tomorrowEvents.length} event{tomorrowEvents.length > 1 ? "s" : ""}</p>
                )}
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">{format(addDays(today, 2), "EEE")}</p>
                {dayAfterEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">-</p>
                ) : (
                  <p className="text-xs">{dayAfterEvents.length} event{dayAfterEvents.length > 1 ? "s" : ""}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Weather</span>
            {weatherLoading && <LoadingSpinner />}
          </div>

          <div className="flex gap-2 mb-2">
            <Card className="flex-shrink-0">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <WeatherIcon icon={weather.icon} className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{weather.temperatureC}°C</p>
                  <p className="text-xs text-muted-foreground">{weather.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-2">Today</p>
                <div className="flex gap-3 overflow-x-auto">
                  {(weather.hourly || []).slice(0, 6).map((hour, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[36px]">
                      <span className="text-[10px] text-muted-foreground">{hour.time}</span>
                      <WeatherIcon icon={hour.icon} className="w-4 h-4 my-0.5 text-muted-foreground" />
                      <span className="text-xs font-medium">{hour.tempC}°</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2">7-Day Forecast</p>
              <div className="flex justify-between">
                {(weather.daily || []).map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground">{day.day}</span>
                    <WeatherIcon icon={day.icon} className="w-5 h-5 my-1 text-muted-foreground" />
                    <span className="text-xs font-medium">{day.tempHighC}°</span>
                    <span className="text-[10px] text-muted-foreground">{day.tempLowC}°</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {homeConfigured && homeEntities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500" fill="currentColor">
                <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {homeEntities.map((entity) => (
                <Card key={entity.id} className="flex-1 min-w-[80px]">
                  <CardContent className="p-2 text-center">
                    <p className="text-[10px] text-muted-foreground truncate">{entity.friendlyName}</p>
                    <p className="text-sm font-medium">{entity.state}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
