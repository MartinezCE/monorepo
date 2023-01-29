'use strict';
const TimezoneService = require('../dist/services/timezone').default;

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('companies');

    if (!table.tz) {
      await queryInterface.addColumn('companies', 'tz', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'UTC',
        after: 'state_id',
      });
    }

    const companies = await queryInterface.sequelize.query(
      `
      SELECT companies.id, states.name AS state_name, countries.name AS country_name FROM companies
      INNER JOIN states ON states.id = companies.state_id
      INNER JOIN countries ON countries.id = states.country_id
    `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    try {
      for (const company of companies) {
        const { id, state_name, country_name } = company;
        const tz = await TimezoneService.getTimezone(state_name, country_name);
        await queryInterface.sequelize.query(`UPDATE companies SET tz = '${tz}' WHERE id = ${id}`);
      }
    } catch (error) {
      console.log('Error migrating timezones', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'tz');
  },
};
