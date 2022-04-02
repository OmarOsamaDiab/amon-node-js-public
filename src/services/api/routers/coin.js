const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  schemaCreateCoin: Joi.object({
    name: Joi.string().min(3).max(50),
    code: Joi.string().min(3).uppercase().max(5),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },

  async createCoin(ctx) {
    const params = {
      name: ctx.request.body.name,
      code: ctx.request.body.code,
    };

    const formattedParams = await validateParams(CoinRouter.schemaCreateCoin, params);

    ctx.body = await CoinController.createCoin(formattedParams);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Coin
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);
    /**
     * @api {put} / PUT createCoin
     * @apiName createCoin
     * @apiGroup Coin
     * @apiDescription Create new coin
     *
     * @apiBody {String} name Coin name.
     * @apiBody {String} code Coin unique code.
     */
    router.put('/createCoin', CoinRouter.createCoin);
    return router;
  },
};

module.exports = CoinRouter;
