'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'monthly_spaces',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
          },
          minMonthsAmount: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          maxMonthsAmount: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          spaceId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        {
          deep: false,
        }
      )
    );
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('monthly_spaces');
  },
};
