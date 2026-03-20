export type WeatherRisk = 'High' | 'Moderate' | 'Low';

export interface CurrentWeather {
  temperatureC: number;
  rainMm: number;
  weatherCode: number;
  condition: string;
  alerts?: { type: string }[];
}

export interface ForecastDay {
  day: string; // e.g. "Mon"
  temp: number; // Celsius
  precipMm: number;
  condition: string; // "Clear" | "Cloudy" | "Light Rain" | "Heavy Rain" | "Heat Wave"
  risk: WeatherRisk;
}

export interface MonitoringResult {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}

const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function normalizeCityQuery(cityInput: string): string {
  // Frontend passes values like "South Delhi, Delhi"
  const trimmed = cityInput.trim();
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : trimmed;
}

function dayOfWeekShort(dateStrYYYYMMDD: string): string {
  // dateStr from Open-Meteo daily.time is "YYYY-MM-DD"
  const d = new Date(`${dateStrYYYYMMDD}T00:00:00Z`);
  return d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

function riskFrom(tempC: number, precipMm: number): WeatherRisk {
  if (precipMm >= 20 || tempC >= 40) return 'High';
  if (precipMm >= 5) return 'Moderate';
  return 'Low';
}

function conditionFrom(tempC: number, precipMm: number, weatherCode: number): string {
  if (precipMm >= 20) return 'Heavy Rain';
  if (precipMm >= 5) return 'Light Rain';
  if (tempC >= 40) return 'Heat Wave';

  // Basic weather code mapping for mostly-dry conditions
  // 0 = Clear, 1-3 = Mainly clear / Partly cloudy / Overcast (Open-Meteo)
  if (weatherCode === 0) return 'Clear';
  if (weatherCode >= 1 && weatherCode <= 3) return 'Cloudy';
  return 'Cloudy';
}

export async function getMonitoringByCity(cityInput: string): Promise<MonitoringResult> {
  const cityQuery = normalizeCityQuery(cityInput || 'Delhi');
  const geoUrl = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(cityQuery)}&count=1&language=en&format=json`;

  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    throw new Error(`Geocoding request failed (${geoRes.status}).`);
  }

  const geoJson = (await geoRes.json()) as any;
  const first = geoJson?.results?.[0];
  if (!first?.latitude || !first?.longitude) {
    const err: any = new Error(`Could not resolve city: ${cityInput}`);
    err.statusCode = 404;
    throw err;
  }

  const latitude = Number(first.latitude);
  const longitude = Number(first.longitude);

  // "meteo" (Open-Meteo) - no OpenWeather
  const forecastUrl =
    `${OPEN_METEO_FORECAST_URL}?latitude=${encodeURIComponent(String(latitude))}` +
    `&longitude=${encodeURIComponent(String(longitude))}` +
    `&current=temperature_2m,rain,weather_code` +
    `&daily=weather_code,temperature_2m_max,precipitation_sum` +
    `&forecast_days=5` +
    `&timezone=auto`;

  const forecastRes = await fetch(forecastUrl);
  if (!forecastRes.ok) {
    throw new Error(`Weather request failed (${forecastRes.status}).`);
  }

  const forecastJson = (await forecastRes.json()) as any;

  const currentRaw = forecastJson?.current;
  const dailyRaw = forecastJson?.daily;
  if (!currentRaw || !dailyRaw) {
    const err: any = new Error('Weather response is missing required fields.');
    err.statusCode = 502;
    throw err;
  }

  const temperatureC = Number(currentRaw.temperature_2m);
  const rainMm = Number(currentRaw.rain ?? 0);
  const weatherCode = Number(currentRaw.weather_code ?? 0);

  const currentCondition = conditionFrom(temperatureC, rainMm, weatherCode);

  const times: string[] = dailyRaw.time ?? [];
  const tempMaxArr: number[] = dailyRaw.temperature_2m_max ?? [];
  const precipSumArr: number[] = dailyRaw.precipitation_sum ?? [];
  const weatherCodeArr: number[] = dailyRaw.weather_code ?? [];

  const forecast: ForecastDay[] = times.slice(0, 5).map((dateStr, idx) => {
    const tempMax = Number(tempMaxArr[idx] ?? 0);
    const precipMm = Number(precipSumArr[idx] ?? 0);
    const dayCode = Number(weatherCodeArr[idx] ?? 0);

    return {
      day: dayOfWeekShort(dateStr),
      temp: Math.round(tempMax),
      precipMm,
      condition: conditionFrom(tempMax, precipMm, dayCode),
      risk: riskFrom(tempMax, precipMm),
    };
  });

  return {
    currentWeather: {
      temperatureC,
      rainMm,
      weatherCode,
      condition: currentCondition,
    },
    forecast,
  };
}

