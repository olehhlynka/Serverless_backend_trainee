import axios from "axios";
import NodeCache from "node-cache";
import { MONO_API_URL } from "../config.js";

const currencyCodes = {
  USD: 840,
  UAH: 980,
  EUR: 978,
};

class MonobankService {
  constructor() {
    this.cache = new NodeCache();
  }

  async fetchCurrenciesData() {
    try {
      const response = await axios.get(MONO_API_URL);
      this.cache.set("monoExchangeRate", response.data);
      return response.data;
    } catch (error) {
      /*console.error(
        "Error occured while fetching MonoBank currencies data: " +
          error.message
      );*/
      return this.cache.get("monoExchangeRate");
    }
  }

  async getExchangeRate(baseCurrency, targetCurrency) {
    const currencies = await this.fetchCurrenciesData();
    const searchedCurrency = this.#findCurrency(
      currencies,
      currencyCodes[baseCurrency],
      currencyCodes[targetCurrency]
    );
    if (searchedCurrency) {
      return this.#exchangeRateToString(searchedCurrency);
    }
    return null;
  }

  #exchangeRateToString(currency) {
    return `Sell: ${currency.rateSell.toFixed(
      2
    )} Buy: ${currency.rateBuy.toFixed(2)}`;
  }

  #findCurrency(
    currencies,
    baseCurrencyCode,
    targetCurrencyCode
  ) {
    return currencies.find(
      (currency) =>
        currency.currencyCodeA === baseCurrencyCode &&
        currency.currencyCodeB === targetCurrencyCode
    );
  }
}

export { MonobankService };
