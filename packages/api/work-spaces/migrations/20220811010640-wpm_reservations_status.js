'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('wpm_reservations', 'status', {
      type: Sequelize.ENUM('PENDING', 'CANCEL', 'DONE'),
      defaultValue: 'DONE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('wpm_reservations', 'status');
  }
};
