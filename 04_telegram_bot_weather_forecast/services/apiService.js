import axios from "axios";
import { API_APP_ID, API_URL } from "../config.js";

const API_CITY_ID = "702550";
const API_UNITS = "metric";

class ForecastApiService {
  async fetchForecastData() {
    try {
      const response = await axios.get(API_URL, {
        params: {
          id: API_CITY_ID,
          units: API_UNITS,
          appid: API_APP_ID,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error occured while fetching: " + error.message
      );
    }
  }
}

export { ForecastApiService };
