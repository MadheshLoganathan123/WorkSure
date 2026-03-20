import { Request, Response, NextFunction } from 'express';
import * as weatherService from '../services/weather.service';

export const getMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const city = (req.query.city as string | undefined) ?? 'Delhi';

    const { currentWeather, forecast } = await weatherService.getMonitoringByCity(city);

    // Parametric alert logic (Rain > 20mm)
    const HEAVY_RAIN_MM = 20;
    const LIGHT_RAIN_MM = 5;

    const heavyRainNow = currentWeather.rainMm > HEAVY_RAIN_MM;
    const heavyRainInForecast = forecast.some((d) => d.precipMm > HEAVY_RAIN_MM);

    const lightRainNow = currentWeather.rainMm > LIGHT_RAIN_MM;
    const lightRainInForecast = forecast.some((d) => d.precipMm > LIGHT_RAIN_MM);

    const activeAlerts: { type: string }[] = [];
    if (heavyRainNow || heavyRainInForecast) {
      activeAlerts.push({ type: 'Heavy Rain' });
    } else if (lightRainNow || lightRainInForecast) {
      activeAlerts.push({ type: 'Light Rain' });
    }

    const currentWeatherWithAlerts = {
      ...currentWeather,
      alerts: activeAlerts,
    };

    const payload = {
      // Required by prompt:
      currentWeather: currentWeatherWithAlerts,
      forecast,
      activeAlerts,

      // Compatibility with existing dashboard code:
      current: currentWeatherWithAlerts,
      aqi: null,
    };

    // NOTE: Mobile dashboard expects `forecast` and `current.alerts` at the top level.
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

