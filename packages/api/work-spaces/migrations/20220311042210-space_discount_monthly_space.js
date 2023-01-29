'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'space_discounts_monthly_spaces',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          spaceDiscountId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          monthlySpaceId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          percentage: {
            type: Sequelize.DECIMAL(3, 2),
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
    return queryInterface.dropTable('space_discounts_monthly_spaces');
  },
};
