'use strict';

const { endOfDay } = require('date-fns');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'start_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn('wpm_reservations', 'end_at', {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'start_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn('wpm_reservations', 'end_at');
  },
};
