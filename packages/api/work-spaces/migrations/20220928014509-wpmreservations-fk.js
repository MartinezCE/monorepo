'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'wpm_reservation_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'wpm_reservation_type_id',
      references: {
        model: 'wpm_reservation_types',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('wpm_reservations', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('wpm_reservations', 'seat_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'seats',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
