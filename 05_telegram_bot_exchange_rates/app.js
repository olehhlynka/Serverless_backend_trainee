import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { MessageController } from "./controllers/messageController.js";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const messageController = new MessageController(bot);

bot.onText(/\/start/, (msg) => {
  messageController.handleStartCommand(msg);
});

bot.onText(/^Forecast in Lviv$/, (msg) => {
  messageController.handleForecastSubscriptionCommand(msg);
});

bot.onText(/^Exchange rates$/, (msg) => {
  messageController.handleExchangeRatesCommand(msg);
});

bot.onText(/^\d hours$/, async (msg) => {
  await messageController.handleForecastRequest(msg);
});

bot.onText(/^(USD|EUR)$/, async (msg) => {
  await messageController.handleCurrencyRateReques(msg);
});

bot.onText(/^Back$/, (msg) => {
  messageController.handleStartCommand(msg);
});
