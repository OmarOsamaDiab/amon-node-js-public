const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });

  describe('createCoin', () => {
    it('should create a new coin', async () => {
      const coinObj = {
        name: 'Terra',
        code: 'LUNA',
      };
      const coin = await CoinController.createCoin(coinObj);
      expect(coin.code).to.eq(coinObj.code);
      expect(coin.name).to.eq(coinObj.name);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should fail to create a new coin with an existing code', async () => {
      const coinObj = {
        name: 'Bitcoin',
        code: 'BTC',
      };
      expect(CoinController.createCoin(coinObj)).to.be.rejectedWith(Error, 'conflict_coin_code');
    });
  });
});
