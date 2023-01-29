'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'credits', 
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          value: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          currencyId: {
            type: Sequelize.DataTypes.INTEGER,
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

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('credits');
  }
};
