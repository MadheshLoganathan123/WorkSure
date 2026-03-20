import { fetchWeatherApi } from "openmeteo";

export async function fetchWeatherData(lat: number = 28.6139, lon: number = 77.2090) {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: "temperature_2m",
    current: "temperature_2m,weather_code",
    timezone: "auto",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;

  const weatherData = {
    current: {
      temperature: current.variables(0)!.value(),
      weatherCode: current.variables(1)!.value(),
    },
    hourly: {
      time: Array.from(
        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m: hourly.variables(0)!.valuesArray()!,
    },
  };

  return weatherData;
}
