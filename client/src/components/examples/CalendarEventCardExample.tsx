import CalendarEventCard from "../CalendarEventCard";

export default function CalendarEventCardExample() {
  // todo: remove mock functionality
  const mockEvent = {
    id: "1",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    summary: "Dentist Appointment",
    calendarName: "Family",
  };

  return (
    <div className="p-4 max-w-md">
      <CalendarEventCard event={mockEvent} />
    </div>
  );
}
