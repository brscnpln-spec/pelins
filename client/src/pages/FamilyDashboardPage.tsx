import { format } from "date-fns";
import PageHeader from "@/components/PageHeader";
import CalendarEventCard from "@/components/CalendarEventCard";
import WeatherCard from "@/components/WeatherCard";
import HomeStatusCard from "@/components/HomeStatusCard";
import BottomNav from "@/components/BottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";

// todo: remove mock functionality - replace with API calls
const mockEvents = [
  {
    id: "1",
    start: new Date().setHours(9, 0),
    end: new Date().setHours(10, 0),
    summary: "Dentist Appointment",
    calendarName: "Family",
  },
  {
    id: "2",
    start: new Date().setHours(14, 0),
    end: new Date().setHours(15, 0),
    summary: "Piano Lesson",
    calendarName: "Personal",
  },
  {
    id: "3",
    start: new Date().setHours(18, 30),
    end: new Date().setHours(19, 30),
    summary: "Family Dinner",
    calendarName: "Family",
  },
  {
    id: "4",
    start: new Date(Date.now() + 86400000).setHours(10, 0),
    end: new Date(Date.now() + 86400000).setHours(11, 0),
    summary: "School Meeting",
    calendarName: "Work",
  },
].map((e) => ({
  ...e,
  start: new Date(e.start).toISOString(),
  end: new Date(e.end).toISOString(),
}));

const mockWeather = {
  temperatureC: 18,
  description: "Partly cloudy",
  icon: "partly-cloudy",
  forecast: [
    { day: "Tomorrow", tempC: 16, icon: "cloudy" },
    { day: format(new Date(Date.now() + 172800000), "EEE"), tempC: 19, icon: "sunny" },
  ],
};

const mockHomeEntities = [
  { id: "light.bedroom", friendlyName: "Room Light", state: "on", type: "light" as const },
  { id: "sensor.temp", friendlyName: "Temperature", state: "21.5", type: "temperature" as const },
  { id: "sensor.window", friendlyName: "Window", state: "closed", type: "window" as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function FamilyDashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-background pb-[72px]">
      <PageHeader title={`${getGreeting()}, Family`} />

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
          <section className="flex-1 lg:flex-[0.6] flex flex-col min-h-0">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {mockEvents.map((event) => (
                  <CalendarEventCard key={event.id} event={event} />
                ))}
              </div>
            </ScrollArea>
          </section>

          <section className="flex-1 lg:flex-[0.4] flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Weather</h2>
              <WeatherCard weather={mockWeather} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Home Status</h2>
              <div className="flex gap-4 flex-wrap">
                {mockHomeEntities.map((entity) => (
                  <HomeStatusCard key={entity.id} entity={entity} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
