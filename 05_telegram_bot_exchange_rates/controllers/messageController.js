import { WeatherService } from "../services/weatherService.js";
import { MonobankService } from "../services/monobankService.js";
import { PrivatbankService } from "../services/privatbankService.js";

class MessageController {
  #optionKeyboard = [
    ["Forecast in Lviv"],
    ["Exchange rates"],
  ];
  #intervalKeyboard = [["3 hours", "6 hours"], ["Back"]];
  #currenciesKeyboard = [["USD", "EUR"], ["Back"]];

  constructor(bot) {
    this.bot = bot;
    this.weatherService = new WeatherService();
    this.monobankService = new MonobankService();
    this.privatbankService = new PrivatbankService();
  }
  handleStartCommand(msg) {
    this.bot.sendMessage(msg.chat.id, "Choose an option", {
      reply_markup: { keyboard: this.#optionKeyboard },
    });
  }

  handleForecastSubscriptionCommand(msg) {
    this.bot.sendMessage(
      msg.chat.id,
      "Choose the forecast interval",
      {
        reply_markup: { keyboard: this.#intervalKeyboard },
      }
    );
  }

  handleExchangeRatesCommand(msg) {
    this.bot.sendMessage(
      msg.chat.id,
      "Choose the currency",
      {
        reply_markup: {
          keyboard: this.#currenciesKeyboard,
        },
      }
    );
  }

  async handleForecastRequest(msg) {
    switch (msg.text) {
      case "3 hours": {
        this.bot.sendMessage(
          msg.chat.id,
          await this.weatherService.getForecast(3)
        );
        break;
      }
      case "6 hours": {
        this.bot.sendMessage(
          msg.chat.id,
          await this.weatherService.getForecast(6)
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  async handleCurrencyRateReques(msg) {
    const monoExchangeRate =
      await this.monobankService.getExchangeRate(
        msg.text,
        "UAH"
      );
    const privateExchangeRate =
      await this.privatbankService.getExchangeRate(
        msg.text,
        "UAH"
      );
    const rates =
      `${msg.text} to UAH\n` +
      `MonoBank data:\n    ${monoExchangeRate}\n` +
      `PrivatBank data:\n    ${privateExchangeRate}`;
    if (privateExchangeRate) {
      this.bot.sendMessage(msg.chat.id, rates);
    }
  }
}

export { MessageController };
