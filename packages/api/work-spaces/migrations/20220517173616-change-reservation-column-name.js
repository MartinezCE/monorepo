'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('wpm_reservations', 'type');
    await queryInterface.addColumn('wpm_reservations', 'wpm_reservation_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'wpm_reservation_types',
        key: 'id',
      },
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('wpm_reservations', 'wpm_reservation_type_id');
  },
};
