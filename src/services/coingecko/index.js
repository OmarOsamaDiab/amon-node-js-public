const COINGECKO_BASE_URL = require('../../../config').SERVICES.COINGECKO.COINGECKO.BASE_URL;
const errors = require('../../helpers/errors');
const RequestService = require('../api/request/index');

const CoinGeckoService = {
    async getCoinPrice(coin) {
        const { code, name } = coin;
        const coinId = await this.getCoinId(code, name);
        return this.getCoinPriceById(coinId);
    },

    async getCoinId(code, name) {
        const url = `${COINGECKO_BASE_URL}/list`;
        const response = await RequestService.fetch(url);
        if (!response || response.status !== 200) errors.throwError('Failed to fetch coins list from CoinGecko');
        const coinsList = response.data;
        const coins = coinsList.filter((item) => item.symbol.toUpperCase() === code.toUpperCase() && item.name.toUpperCase() === name.toUpperCase());
        if (coins.length === 0) errors.assertExposable(false, 'unknown_coin_code');
        return coins[0].id;
    },

    async getCoinPriceById(coinId) {
        const url = `${COINGECKO_BASE_URL}/${coinId}`;
        const response = await RequestService.fetch(url);
        if (!response || response.status !== 200) errors.assertExposable(false, 'unknown_coin_code');
        return response.data.market_data.current_price.usd.toString();
    },
};

module.exports = CoinGeckoService;