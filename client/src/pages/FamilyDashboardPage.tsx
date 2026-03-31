import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getISODay,
} from "date-fns";
import BottomNav from "@/components/BottomNav";
import DigitalClock from "@/components/DigitalClock";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi Günler";
  return "İyi Akşamlar";
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
  if (isToday(date)) return "BUGÜN";
  if (isTomorrow(date)) return "YARIN";
  return format(date, "EEEE").toUpperCase();
}

function formatEventTime(dateStr: string): string {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes();
  if (h === 0 && m === 0) return "Tüm gün";
  return format(d, "HH:mm");
}

function isAllDay(event: CalendarEvent): boolean {
  const start = new Date(event.start);
  return start.getHours() === 0 && start.getMinutes() === 0;
}

const EVENT_COLORS = [
  "#FF6B35",
  "#E63946",
  "#4361EE",
  "#FFD166",
  "#06D6A0",
  "#9B5DE5",
  "#F72585",
];

function getEventColor(index: number): string {
  return EVENT_COLORS[index % EVENT_COLORS.length];
}

function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const groups = new Map<string, CalendarEvent[]>();
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = addDays(today, i);
    const dayKey = format(day, "yyyy-MM-dd");
    for (const event of events) {
      const eventDate = new Date(event.start);
      if (isSameDay(eventDate, day)) {
        if (!groups.has(dayKey)) groups.set(dayKey, []);
        groups.get(dayKey)!.push(event);
      }
    }
  }

  return groups;
}

function MiniCalendar({ today }: { today: Date }) {
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getISODay(monthStart) - 1;
  const cells: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...monthDays,
  ];

  const dayHeaders = ["Pz", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-semibold tracking-wide">
          {format(today, "MMMM yyyy")}
        </span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayHeaders.map((d) => (
          <div key={d} className="text-center text-[9px] font-semibold text-muted-foreground py-0.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`pad-${idx}`} />;
          }
          const todayCell = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex items-center justify-center text-[10px] font-medium h-5 w-5 mx-auto rounded-full",
                todayCell
                  ? "bg-blue-500 text-white font-bold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
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

  const upcomingDays = [0, 1, 2].map((offset) => {
    const date = addDays(today, offset);
    const key = format(date, "yyyy-MM-dd");
    return { date, key, label: getDayLabel(date), dayEvents: eventsByDay.get(key) || [] };
  });

  const todayEvents = upcomingDays[0].dayEvents;

  let globalEventIndex = 0;

  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold">{getGreeting()}</h1>
          <p className="text-xs text-muted-foreground">{format(new Date(), "EEEE, d MMMM")}</p>
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
          {calendarLoading && (
            <div className="flex items-center gap-2 mb-2">
              <LoadingSpinner />
              <span className="text-xs text-muted-foreground">Takvim yükleniyor...</span>
            </div>
          )}

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* LEFT PANEL — date heading + event list */}
                <div className="flex-1 p-4 pr-3 border-r border-border overflow-hidden">
                  <h2 className="text-base font-bold mb-3 leading-tight">
                    {format(today, "EEEE, d MMMM")}
                  </h2>

                  {upcomingDays.map(({ date, label, dayEvents }) => {
                    if (!isToday(date) && dayEvents.length === 0) return null;
                    return (
                      <div key={label} className="mb-3 last:mb-0">
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-1.5">
                          {label}
                        </p>
                        {dayEvents.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic pl-3">Etkinlik yok</p>
                        ) : (
                          <div className="space-y-2">
                            {dayEvents.map((event) => {
                              const color = getEventColor(globalEventIndex++);
                              const allDay = isAllDay(event);
                              return (
                                <div key={event.id} className="flex items-start gap-2.5">
                                  <div
                                    className="w-[3px] rounded-full self-stretch min-h-[28px] flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold leading-tight truncate">
                                      {event.summary}
                                    </p>
                                    {!allDay && (
                                      <p className="text-[11px] text-muted-foreground">
                                        {formatEventTime(event.start)} – {formatEventTime(event.end)}
                                      </p>
                                    )}
                                    {allDay && (
                                      <p className="text-[11px] text-muted-foreground">Tüm gün</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT PANEL — mini monthly calendar + today's events legend */}
                <div className="w-[160px] flex-shrink-0 p-3 flex flex-col gap-3">
                  <MiniCalendar today={today} />

                  {todayEvents.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-border">
                      {todayEvents.map((event, i) => {
                        const color = getEventColor(i);
                        const allDay = isAllDay(event);
                        return (
                          <div key={event.id} className="flex items-start gap-1.5 min-w-0">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-[10px] text-muted-foreground leading-tight truncate">
                              {allDay ? "" : `${formatEventTime(event.start)} – `}
                              <span className="text-foreground font-medium">{event.summary}</span>
                            </p>
                          </div>
                        );
                      })}
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
                data-label_1="MÜNIH"
                data-label_2="HAVA DURUMU"
                data-theme="original"
                data-testid="widget-weather"
              >
                MÜNİH HAVA DURUMU
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
              <span className="text-sm font-medium">Ev</span>
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
