'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('wpm_reservations', 'provider_payload', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'provider',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('wpm_reservations', 'provider_payload');
  },
};
