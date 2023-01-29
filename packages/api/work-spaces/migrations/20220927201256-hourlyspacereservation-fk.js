'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hourly_space_reservations', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'spaces',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'plan_renovation_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'plan_renovations',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'hourly_space_history_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'hourly_space_history',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'fee_percentage_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'fee_percentages',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'credit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'credits',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
