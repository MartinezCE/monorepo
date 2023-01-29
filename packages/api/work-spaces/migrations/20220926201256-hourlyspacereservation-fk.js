'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hourly_space_reservations', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'plan_renovation_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'hourly_space_history_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'fee_percentage_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'credit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {},
};
