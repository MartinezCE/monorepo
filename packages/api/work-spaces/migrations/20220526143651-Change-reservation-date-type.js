'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'start_at', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'start_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
