'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('wpm_reservations', 'provider', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('wpm_reservations', 'provider');
  },
};
