'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'hourly_spaces',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          halfDayPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          fullDayPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          minHoursAmount: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          dayOfWeek: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
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
    return queryInterface.dropTable('hourly_spaces');
  },
};
