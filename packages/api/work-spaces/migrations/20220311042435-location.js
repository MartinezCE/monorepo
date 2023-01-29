'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'locations',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          companyId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          latitude: {
            type: Sequelize.DECIMAL(8, 6),
            allowNull: false,
          },
          longitude: {
            type: Sequelize.DECIMAL(9, 6),
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          address: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          tourUrl: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          comments: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          accessCode: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM('IN_PROCESS', 'PUBLISHED'),
            allowNull: true,
            defaultValue: 'IN_PROCESS',
          },
          streetName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          streetNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          city: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          state: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          country: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          postalCode: {
            type: Sequelize.STRING,
            allowNull: true,
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
    return queryInterface.dropTable('locations');
  },
};
