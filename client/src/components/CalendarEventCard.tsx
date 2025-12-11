import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  calendarName?: string;
}

interface CalendarEventCardProps {
  event: CalendarEvent;
}

const calendarColors: Record<string, string> = {
  Family: "bg-blue-500",
  Work: "bg-green-500",
  Personal: "bg-purple-500",
  default: "bg-primary",
};

export default function CalendarEventCard({ event }: CalendarEventCardProps) {
  const startTime = format(new Date(event.start), "HH:mm");
  const endTime = format(new Date(event.end), "HH:mm");
  const colorClass = calendarColors[event.calendarName || ""] || calendarColors.default;

  return (
    <div
      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-card-border min-h-[80px]"
      data-testid={`event-card-${event.id}`}
    >
      <div className={`w-1 h-12 rounded-full ${colorClass}`} />
      <div className="flex-1 min-w-0">
        <p className="text-lg font-medium truncate">{event.summary}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{startTime} - {endTime}</span>
          {event.calendarName && (
            <>
              <span className="mx-1">·</span>
              <span>{event.calendarName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
