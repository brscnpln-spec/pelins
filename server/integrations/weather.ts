export interface HourlyForecast {
  time: string;
  tempC: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  tempHighC: number;
  tempLowC: number;
  icon: string;
}

export interface WeatherData {
  temperatureC: number;
  description: string;
  icon: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

function getWeatherIcon(weatherCode: number): string {
  if (weatherCode === 0) return "sunny";
  if (weatherCode <= 3) return "partly-cloudy";
  if (weatherCode <= 48) return "cloudy";
  if (weatherCode <= 67 || (weatherCode >= 80 && weatherCode <= 82)) return "rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "snow";
  if (weatherCode >= 85 && weatherCode <= 86) return "snow";
  if (weatherCode >= 95) return "rain";
  return "cloudy";
}

function getWeatherDescription(weatherCode: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };
  return descriptions[weatherCode] || "Unknown";
}

function getDayName(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export async function getWeather(
  latitude: number = 41.0082,
  longitude: number = 28.9784
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const currentTemp = data.current.temperature_2m;
    const currentCode = data.current.weather_code;

    const now = new Date();
    const currentHour = now.getHours();

    const hourly: HourlyForecast[] = [];
    for (let i = 0; i < data.hourly.time.length && hourly.length < 12; i++) {
      const hourTime = new Date(data.hourly.time[i]);
      if (hourTime.toDateString() === now.toDateString() && hourTime.getHours() >= currentHour) {
        hourly.push({
          time: hourTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
          tempC: Math.round(data.hourly.temperature_2m[i]),
          icon: getWeatherIcon(data.hourly.weather_code[i]),
        });
      }
    }

    const daily: DailyForecast[] = data.daily.time.map((dateStr: string, idx: number) => {
      const date = new Date(dateStr);
      return {
        day: getDayName(date),
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        tempHighC: Math.round(data.daily.temperature_2m_max[idx]),
        tempLowC: Math.round(data.daily.temperature_2m_min[idx]),
        icon: getWeatherIcon(data.daily.weather_code[idx]),
      };
    });

    return {
      temperatureC: Math.round(currentTemp),
      description: getWeatherDescription(currentCode),
      icon: getWeatherIcon(currentCode),
      hourly,
      daily,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return {
      temperatureC: 20,
      description: "Unable to fetch weather",
      icon: "cloudy",
      hourly: [],
      daily: [],
    };
  }
}
