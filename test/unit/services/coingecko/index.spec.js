const path = require('path');
const sinon = require('sinon');
const CoinGeckoService = require(path.join(srcDir, '/services/coingecko/index'));
const RequestService = require(path.join(srcDir, '/services/request/index'));

describe('Service: CoinGecko', () => {
  let sandbox = null;

  const coinIdResponseSuccess = {
    status: 200,
    data: [{ name: 'Bitcoin', symbol: 'btc', id: 'bitcoin' }],
  };
  const coinIdResponseFail = {
    status: 404,
  };

  const coinPriceResponseSuccess = {
    status: 200,
    data: {
      market_data: {
        current_price: {
          usd: 10000,
        },
      },
    },
  };
  const coinPriceResponseFail = {
    status: 404,
  };

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinId', () => {
    it('should get coin id by code and name', async () => {
      sandbox.stub(RequestService, 'fetch').resolves(coinIdResponseSuccess);

      const coinCode = 'BTC';
      const coinName = 'Bitcoin';
      const id = await CoinGeckoService.getCoinId(coinCode, coinName);
      expect(id).to.be.eq('bitcoin');
    });

    it('should fail to get coin id by invalid code', async () => {
      sandbox.stub(RequestService, 'fetch').resolves(coinIdResponseFail);

      const coinCode = 'invalidCode';
      const coinName = 'anyName';
      expect(CoinGeckoService.getCoinId(coinCode, coinName)).to.be.rejectedWith(
        Error,
        'Failed to fetch coins list from CoinGecko'
      );
    });
  });

  describe('getCoinPriceById', () => {
    it('should get coin price by coin id', async () => {
      sandbox.stub(RequestService, 'fetch').resolves(coinPriceResponseSuccess);

      const coinId = 'bitcoin';
      const price = await CoinGeckoService.getCoinPriceById(coinId);
      expect(price).to.be.a('string');
      expect(price).to.be.eq('10000');
    });

    it('should fail to get coin price by dummy coin id', async () => {
      sandbox.stub(RequestService, 'fetch').resolves(coinPriceResponseFail);

      const coinId = 'dummy';
      expect(CoinGeckoService.getCoinPriceById(coinId)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });

  describe('getCoinPrice', () => {
    it('should get coin price by code and name', async () => {
      const coinObj = {
        code: 'BTC',
        name: 'Bitcoin',
      };
      const price = await CoinGeckoService.getCoinPrice(coinObj);
      expect(price).to.be.a('string');
    });

    it('should fail to get coin price by Invalid code and Invalid name', async () => {
      const coinObj = {
        code: 'InvalidCode',
        name: 'InvalidName',
      };
      expect(CoinGeckoService.getCoinPrice(coinObj)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });
});
