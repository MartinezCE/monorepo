'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'space_deposits_monthly_spaces',
      snakecaseKeys(
        {
          spaceDepositId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          monthlySpaceId: {
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
    return queryInterface.dropTable('space_deposits_monthly_spaces');
  },
};
