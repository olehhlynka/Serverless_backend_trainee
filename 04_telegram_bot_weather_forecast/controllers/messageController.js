import { getStructuredForecast } from "../utils/formatter.js";
import { ForecastApiService } from "../services/apiService.js";

const forecastApiService = new ForecastApiService();

const getForecast = async (hoursInterval) => {
  const forecastData =
    await forecastApiService.fetchForecastData();
  const structuredForecast = await getStructuredForecast(
    forecastData,
    hoursInterval
  );
  return structuredForecast;
};

const subscribeKeyboard = [
  [{ text: "Forecast in Lviv", callback_data: "forecast" }],
];

const intervalKeyboard = [["3 hours", "6 hours"]];

const handleStartCommand = (bot, chatId) => {
  bot.sendMessage(
    chatId,
    "Subscribe to the city forecast",
    {
      reply_markup: { keyboard: subscribeKeyboard },
    }
  );
};

const handleSubscription = (bot, chatId) => {
  bot.sendMessage(chatId, "Choose the forecast interval", {
    reply_markup: { keyboard: intervalKeyboard },
  });
};

const handleForecastRequest = async (
  bot,
  chatId,
  msgText
) => {
  switch (msgText) {
    case "3 hours": {
      bot.sendMessage(chatId, await getForecast(3));
      break;
    }
    case "6 hours": {
      bot.sendMessage(chatId, await getForecast(6));
      break;
    }
    default: {
      break;
    }
  }
};

const processMessage = async (bot, msg) => {
  const chatId = msg.chat.id;
  const msgText = msg.text;
  if (/\/start/.test(msgText)) {
    handleStartCommand(bot, chatId);
  } else if (/^Forecast in Lviv$/.test(msgText)) {
    handleSubscription(bot, chatId);
  } else if (/^\d hours$/.test(msgText)) {
    await handleForecastRequest(bot, chatId, msgText);
  }
};

export { processMessage };
