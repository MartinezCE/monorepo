'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hourly_space_reservations', 'half_day_type', {
      type: Sequelize.ENUM('MORNING', 'AFTERNOON'),
      allowNull: true,
      after: 'type',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hourly_space_reservations', 'half_day_type');
  },
};
