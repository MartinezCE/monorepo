'use strict';

module.exports = {
  async up(queryInterface) {
    const [argCurrencyId, mexCurrencyId, chlCurrencyId, colCurrencyId] = await Promise.all([
      queryInterface.rawSelect('currencies', { where: { value: 'ARS' } }, ['id']),
      queryInterface.rawSelect('currencies', { where: { value: 'MXN' } }, ['id']),
      queryInterface.rawSelect('currencies', { where: { value: 'CLP' } }, ['id']),
      queryInterface.rawSelect('currencies', { where: { value: 'COP' } }, ['id']),
    ]);

    await Promise.all([
      queryInterface.bulkUpdate('countries', { currency_id: argCurrencyId }, { iso3: 'ARG' }),
      queryInterface.bulkUpdate('countries', { currency_id: mexCurrencyId }, { iso3: 'MEX' }),
      queryInterface.bulkUpdate('countries', { currency_id: chlCurrencyId }, { iso3: 'CHL' }),
      queryInterface.bulkUpdate('countries', { currency_id: colCurrencyId }, { iso3: 'COL' }),
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
    await queryInterface.bulkDelete('countries', null, {});
  },
};
