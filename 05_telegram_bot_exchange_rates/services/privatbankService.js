import axios from "axios";
import { PRIVAT_API_URL } from "../config.js";

class PrivatbankService {
  async fetchCurrenciesData() {
    try {
      const response = await axios.get(PRIVAT_API_URL);
      return response.data;
    } catch (error) {
      console.error(
        "Error occured while fetching PrivatBank currencies data: " +
          error.message
      );
    }
  }
  async getExchangeRate(baseCurrency, targetCurrency) {
    const currencies = await this.fetchCurrenciesData();
    const searchedCurrency = this.#findCurrency(
      currencies,
      baseCurrency,
      targetCurrency
    );
    if (searchedCurrency) {
      return this.#exchangeRateToString(searchedCurrency);
    }
    return null;
  }

  #exchangeRateToString(currency) {
    return `Sell: ${currency.sale.slice(
      0,
      -3
    )} Buy: ${currency.buy.slice(0, -3)}`;
  }

  #findCurrency(currencies, baseCurrency, targetCurrency) {
    return currencies.find(
      (currency) =>
        currency.ccy === baseCurrency &&
        currency.base_ccy === targetCurrency
    );
  }
}

export { PrivatbankService };
