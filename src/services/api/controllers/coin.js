const moment = require('moment');
const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const logger = require('../../../modules/logger');
const CoinGeckoService = require('../../coingecko/index');
const { isDateOlderThanXUnits } = require('../../../helpers/utils');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    // Fetch coin price if last updated time is older than 1 hour
    const { priceLastUpdatedAt, price } = coin;
    let lastUpdateOlderThanOneHourAgo;
    if (priceLastUpdatedAt) lastUpdateOlderThanOneHourAgo = isDateOlderThanXUnits(priceLastUpdatedAt, 1, 'hours');

    if (lastUpdateOlderThanOneHourAgo || !price) {
      try {
        const price = await CoinGeckoService.getCoinPrice(coin);
        coin.price = price;
        coin.priceLastUpdatedAt = moment();
        await coin.save();
      } catch (error) {
        logger.error('Failed to fetch the coin price', { error });
      }
    }

    return coin.filterKeys();
  },
  async createCoin(coinObj) {
    // Check if coin already exists
    const coin = await Models.Coin.findByCoinCode(coinObj.code);
    errors.assertExposable(!coin, 'conflict_coin_code');

    // Fetch coin price from the third party
    try {
      const price = await CoinGeckoService.getCoinPrice(coinObj);
      coinObj = {
        ...coinObj,
        price,
        priceLastUpdatedAt: moment(),
      };
    } catch (error) {
      // TODO: we can call a third party service again if needed or return an error
      logger.error('Failed to fetch the coin price', { error });
    }

    // Create new coin
    const newCoin = await Models.Coin.createCoin(coinObj);
    return newCoin.filterKeys();
  },
};

module.exports = CoinController;
