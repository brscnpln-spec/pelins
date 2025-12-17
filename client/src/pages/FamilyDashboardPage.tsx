import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, addDays, isSameDay } from "date-fns";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  calendarName?: string;
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
      className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
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

  const { data: homeData } = useQuery<HomeStatusResponse>({
    queryKey: ["/api/dashboard/home-status"],
    refetchInterval: 30000,
  });

  const events = calendarData?.events || [];
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
          <Button
            size="icon"
            variant="ghost"
            onClick={() => window.location.reload()}
            data-testid="button-refresh-dashboard"
            className="min-w-[48px] min-h-[48px]"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
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
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <iframe
                src="https://abpwidget.accuweather.com/widget/abpwidget/index.html#abp_nocode_entra?ismetric=true&culture=tr&cities=Munich,DE;Istanbul,TR"
                className="w-full border-0"
                style={{ height: "320px" }}
                title="Weather"
                data-testid="iframe-weather"
                sandbox="allow-scripts allow-same-origin"
              />
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
