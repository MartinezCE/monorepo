'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hourly_space_reservations', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      after: 'id',
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hourly_space_reservations', 'user_id');
  },
};
