import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { processMessage } from "./controllers/messageController.js";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  await processMessage(bot, msg);
});
