const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const config = require(path.join(srcDir, '../config'));

describe('Router: coin', () => {
  let sandbox = null;
  const coin = {
    name: 'Bitcoin',
    code: 'BTC',
    price: '10000',
  };

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    config.DEMO_ACCOUNT = null;
    sandbox && sandbox.restore();
  });

  it('Should get router', async () => {
    const router = await CoinRouter.router();

    expect(router instanceof Router).to.be.true;
  });

  it('Should get coin by code', async () => {
    sandbox.stub(CoinController, 'getCoinByCode').resolves(coin);

    const ctx = {
      params: { coinCode: 'BTC' },
    };
    await CoinRouter.getCoinByCode(ctx);
    expect(ctx.body).to.be.an('object');
    expect(Object.keys(ctx.body).length).to.be.eq(3);
    expect(ctx.body.name).to.be.eq(coin.name);
    expect(ctx.body.code).to.be.eq(coin.code);
    expect(ctx.body.price).to.be.eq(coin.price);
  });

  it('Should create new coin', async () => {
    sandbox.stub(CoinController, 'createCoin').resolves(coin);

    const ctx = {
      request: {
        body: {
          name: coin.name,
          code: coin.code,
        },
      },
    };

    await CoinRouter.createCoin(ctx);
    expect(ctx.body).to.be.an('object');
    expect(Object.keys(ctx.body).length).to.be.eq(3);
    expect(ctx.body.name).to.be.eq(coin.name);
    expect(ctx.body.code).to.be.eq(coin.code);
    expect(ctx.body.price).to.be.eq(coin.price);
  });
});
