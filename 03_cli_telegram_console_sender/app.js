import { program } from "commander";
import TelegramBot from "node-telegram-bot-api";

process.env["NTBA_FIX_350"] = 1;

const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  "5952280425:AAEXJhTAi9KKoDbdFSjhAuJxwDEvGcyXrXA";
const CHAT_ID = process.env.CHAT_ID || 471319304;

const bot = new TelegramBot(TOKEN, { polling: true });

const sendMessage = async (message) => {
  try {
    await bot.sendMessage(CHAT_ID, message);
  } catch (error) {
    console.error("Something went wrong: " + error.message);
  } finally {
    process.exit();
  }
};

const sendImage = async (pathToImage) => {
  try {
    await bot.sendPhoto(CHAT_ID, pathToImage);
  } catch (error) {
    console.error("Something went wrong: " + error.message);
  } finally {
    process.exit();
  }
};

program
  .command("send-message <message>")
  .description("Send text message to the telegram bot")
  .action(sendMessage);

program
  .command("send-photo <path>")
  .description("Send photo to the telegram bot")
  .action(sendImage);

program.parse(process.argv);
