import axios from "axios";
import { getFormattedForecast } from "../utils/formatting.js";
import {
  WEATHER_API_ID,
  WEATHER_API_URL,
} from "../config.js";

const API_CITY_ID = "702550";
const API_UNITS = "metric";

class WeatherService {
  async fetchForecastData() {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          id: API_CITY_ID,
          units: API_UNITS,
          appid: WEATHER_API_ID,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error occured while fetching weather data: " +
          error.message
      );
    }
  }

  async getForecast(hoursInterval) {
    const forecastData = await this.fetchForecastData();
    const formattedForecast = await getFormattedForecast(
      forecastData,
      hoursInterval
    );
    return formattedForecast;
  }
}

export { WeatherService };
