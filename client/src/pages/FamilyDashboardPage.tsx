import { useEffect } from "react";
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
  useEffect(() => {
    if (!document.getElementById("weatherwidget-io-js")) {
      const script = document.createElement("script");
      script.id = "weatherwidget-io-js";
      script.src = "https://weatherwidget.io/js/widget.min.js";
      document.body.appendChild(script);
    }
  }, []);

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
        <section data-testid="section-calendar">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="text-base font-semibold">Upcoming Events</span>
            {calendarLoading && <LoadingSpinner />}
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <p className="text-sm font-bold text-primary mb-3">Today</p>
                {todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events today</p>
                ) : (
                  <div className="space-y-2">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 py-1 border-l-2 border-primary pl-3">
                        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                          {format(new Date(event.start), "HH:mm")}
                        </span>
                        <span className="text-sm font-bold">{event.summary}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Tomorrow</p>
                  {tomorrowEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No events</p>
                  ) : (
                    <div className="space-y-1">
                      {tomorrowEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-2">
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {format(new Date(event.start), "HH:mm")}
                          </span>
                          <span className="text-xs">{event.summary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{format(addDays(today, 2), "EEEE")}</p>
                  {dayAfterEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No events</p>
                  ) : (
                    <div className="space-y-1">
                      {dayAfterEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-2">
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {format(new Date(event.start), "HH:mm")}
                          </span>
                          <span className="text-xs">{event.summary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section data-testid="section-weather">
          <Card>
            <CardContent className="p-3">
              <a 
                className="weatherwidget-io" 
                href="https://forecast7.com/en/48d1411d58/munich/" 
                data-label_1="MUNICH" 
                data-label_2="WEATHER" 
                data-theme="original"
                data-testid="widget-weather"
              >
                MUNICH WEATHER
              </a>
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
