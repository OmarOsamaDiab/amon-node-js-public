'use strict';

module.exports = {
  up: async function (query, transaction) {
    const sql = `
      ALTER TABLE "Coin" 
      ADD "price" VARCHAR(255),
      ADD "priceLastUpdatedAt" DATE;
    `;
    await transaction.sequelize.query(sql, { raw: true, transaction });
  },

  down: async function (query, transaction) {
    const sql = `
     ALTER TABLE "Coin"
     DROP "price",
     DROP "priceLastUpdatedAt";
   `;
    await transaction.sequelize.query(sql, { raw: true, transaction });
  },
};
