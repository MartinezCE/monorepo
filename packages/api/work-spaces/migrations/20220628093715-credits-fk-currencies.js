'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('credits', 'currency_id', {
        type: Sequelize.INTEGER.UNSIGNED,
      }),
    ]);
  },

  async down(queryInterface) {
    queryInterface.changeColumn('credits', 'currency_id', {
      type: Sequelize.INTEGER,
    });
  },
};
