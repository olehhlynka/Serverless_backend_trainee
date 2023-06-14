import { parseForecastList } from "./parser.js";

const getStructuredForecast = async (
  forecastData,
  interval
) => {
  const { list, city } = forecastData;
  const filteredList = list.filter((item, index) => {
    switch (interval) {
      case 3: {
        return true;
      }
      case 6: {
        return index % 2 === 0 ? true : false;
      }
      default: {
        return true;
      }
    }
  });
  const parsedList = parseForecastList(
    filteredList,
    interval
  );
  return forecastListToString(parsedList, city.name);
};

const forecastListToString = (forecastList, city) => {
  return forecastList.reduce((acc, curr, index, arr) => {
    if (!(index && curr.day === arr[index - 1].day)) {
      acc += `\n${curr.weekday}, ${curr.day} ${curr.month}`;
    }
    return (acc += `\n    ${forecastToString(curr)}`);
  }, `Weather in ${city}:\n`);
};

const forecastToString = (forecast) => {
  return `${forecast.time}, ${
    forecast.temp > 0 ? "+" : ""
  }${forecast.temp}°C, feels like ${
    forecast.feelsLike > 0 ? "+" : ""
  }${forecast.feelsLike}°C, ${forecast.weatherDescription}`;
};

export { getStructuredForecast };
