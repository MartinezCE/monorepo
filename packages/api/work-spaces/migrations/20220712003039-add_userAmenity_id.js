'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users_amenities');

    if (!table.id) {
      await queryInterface.addColumn('users_amenities', 'id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users_amenities');

    if (table.id) {
      await queryInterface.removeColumn('users_amenities', 'id');
    }
  },
};
