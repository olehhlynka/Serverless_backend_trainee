const MSECONDS_IN_SECOND = 1000;

const parseForecastList = (forecastList) => {
  return forecastList.map((forecast) => {
    const date = parseDate(forecast.dt);
    const weather = parseWeatherData(forecast);
    return { ...date, ...weather };
  });
};

const parseWeatherData = (forecast) => {
  return {
    temp: forecast.main.temp,
    feelsLike: forecast.main.feels_like,
    weatherDescription: forecast.weather[0].description,
  };
};

const parseDate = (timestapm) => {
  const locale = "en-US";
  const date = new Date(timestapm * MSECONDS_IN_SECOND);
  const weekday = date.toLocaleString(locale, {
    weekday: "long",
  });
  const day = date.getDate();
  const month = date.toLocaleString(locale, {
    month: "long",
  });
  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return {
    weekday: weekday,
    day: day,
    month: month,
    time: time,
  };
};

export { parseForecastList };
