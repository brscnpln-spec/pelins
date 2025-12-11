import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import CalendarEventCard from "@/components/CalendarEventCard";
import WeatherCard from "@/components/WeatherCard";
import HomeStatusCard from "@/components/HomeStatusCard";
import BottomNav from "@/components/BottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  calendarName?: string;
}

interface WeatherData {
  temperatureC: number;
  description: string;
  icon: string;
  forecast?: { day: string; tempC: number; icon: string }[];
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
      className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
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
  const weather = weatherData || { temperatureC: 0, description: "Loading...", icon: "cloudy", forecast: [] };
  const homeEntities = homeData?.entities || [];
  const homeConfigured = homeData?.configured || false;

  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <PageHeader title={`${getGreeting()}, Family`} />

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
          <section className="flex-1 lg:flex-[0.6] flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-8 h-8" />
              <h2 className="text-xl font-semibold" data-testid="text-section-calendar">Upcoming Events</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {calendarLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-16 h-16 opacity-50" />
                    <p className="mt-2">No upcoming events</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <CalendarEventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </ScrollArea>
          </section>

          <section className="flex-1 lg:flex-[0.4] flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SunIcon className="w-8 h-8" />
                <h2 className="text-xl font-semibold" data-testid="text-section-weather">Weather</h2>
              </div>
              {weatherLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <WeatherCard weather={weather} />
              )}
            </div>

            {homeConfigured && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <HomeIcon className="w-8 h-8" />
                  <h2 className="text-xl font-semibold" data-testid="text-section-home">Home Status</h2>
                </div>
                {homeLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="flex gap-4 flex-wrap">
                    {homeEntities.map((entity) => (
                      <HomeStatusCard key={entity.id} entity={entity} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
