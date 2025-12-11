import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, addDays, isSameDay } from "date-fns";
import CalendarEventCard from "@/components/CalendarEventCard";
import WeatherCard from "@/components/WeatherCard";
import HomeStatusCard from "@/components/HomeStatusCard";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import ThemeToggle from "@/components/ThemeToggle";
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function LoadingSpinner() {
  return (
    <motion.div
      className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      <rect x="8" y="14" width="44" height="38" rx="6" fill="#FCD34D" stroke="#FBBF24" strokeWidth="2" />
      <rect x="8" y="14" width="44" height="12" rx="6" fill="#FBBF24" />
      <circle cx="18" cy="10" r="4" fill="#1F2937" />
      <circle cx="42" cy="10" r="4" fill="#1F2937" />
      <rect x="15" y="32" width="8" height="6" rx="1" fill="white" />
      <rect x="26" y="32" width="8" height="6" rx="1" fill="white" />
      <rect x="37" y="32" width="8" height="6" rx="1" fill="white" />
      <rect x="15" y="42" width="8" height="6" rx="1" fill="white" />
      <rect x="26" y="42" width="8" height="6" rx="1" fill="white" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <motion.svg 
      viewBox="0 0 60 60" 
      className={className}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="30" cy="30" r="12" fill="#FCD34D" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="30"
          y1="8"
          x2="30"
          y2="14"
          stroke="#FBBF24"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 30 30)`}
        />
      ))}
    </motion.svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      <path d="M30 8L6 28h8v22h32V28h8L30 8z" fill="#86EFAC" stroke="#22C55E" strokeWidth="2" />
      <rect x="24" y="36" width="12" height="14" rx="2" fill="#FCD34D" stroke="#FBBF24" strokeWidth="1" />
      <rect x="16" y="32" width="8" height="6" rx="1" fill="#93C5FD" />
      <rect x="36" y="32" width="8" height="6" rx="1" fill="#93C5FD" />
    </svg>
  );
}

function getDayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE");
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

  const { data: homeData, isLoading: homeLoading } = useQuery<HomeStatusResponse>({
    queryKey: ["/api/dashboard/home-status"],
    refetchInterval: 30000,
  });

  const events = calendarData?.events || [];
  const weather = weatherData || { temperatureC: 0, description: "Loading...", icon: "cloudy", hourly: [], daily: [] };
  const homeEntities = homeData?.entities || [];
  const homeConfigured = homeData?.configured || false;

  const eventsByDay = groupEventsByDay(events);
  const today = new Date();
  const dayDates = [today, addDays(today, 1), addDays(today, 2)];

  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">{getGreeting()}</h1>
            <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DigitalClock className="scale-75 origin-right" />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
          <section className="flex-1 lg:flex-[0.55] flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-6 h-6" />
              <h2 className="text-lg font-semibold" data-testid="text-section-calendar">Upcoming Events</h2>
              {calendarLoading && <LoadingSpinner />}
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {dayDates.map((dayDate) => {
                const dayKey = format(dayDate, "yyyy-MM-dd");
                const dayEvents = eventsByDay.get(dayKey) || [];
                const dayLabel = getDayLabel(dayDate);

                return (
                  <div key={dayKey} className="flex-1 min-h-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-medium ${isToday(dayDate) ? "text-primary" : "text-muted-foreground"}`}>
                        {dayLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(dayDate, "MMM d")}
                      </span>
                    </div>
                    
                    {dayEvents.length === 0 ? (
                      <div className="h-12 flex items-center px-3 rounded-md bg-muted/30 text-sm text-muted-foreground">
                        No events
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dayEvents.slice(0, 2).map((event) => (
                          <CalendarEventCard key={event.id} event={event} compact />
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-xs text-muted-foreground px-2">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex-1 lg:flex-[0.45] flex flex-col gap-4 min-h-0 overflow-auto">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SunIcon className="w-6 h-6" />
                <h2 className="text-lg font-semibold" data-testid="text-section-weather">Weather</h2>
                {weatherLoading && <LoadingSpinner />}
              </div>
              <WeatherCard weather={weather} />
            </div>

            {homeConfigured && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HomeIcon className="w-6 h-6" />
                  <h2 className="text-lg font-semibold" data-testid="text-section-home">Home Status</h2>
                  {homeLoading && <LoadingSpinner />}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {homeEntities.map((entity) => (
                    <HomeStatusCard key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
