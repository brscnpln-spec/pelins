import WeatherCard from "../WeatherCard";

export default function WeatherCardExample() {
  // todo: remove mock functionality
  const mockWeather = {
    temperatureC: 18,
    description: "Partly cloudy",
    icon: "partly-cloudy",
    forecast: [
      { day: "Tomorrow", tempC: 16, icon: "cloudy" },
      { day: "Wed", tempC: 19, icon: "sunny" },
    ],
  };

  return (
    <div className="p-4 max-w-sm">
      <WeatherCard weather={mockWeather} />
    </div>
  );
}
