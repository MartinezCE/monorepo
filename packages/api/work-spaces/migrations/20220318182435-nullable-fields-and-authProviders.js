'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('users', 'phone_number', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);

    await queryInterface.addColumn('users', 'auth_providers', Sequelize.JSON);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
