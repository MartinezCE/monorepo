'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'spaces',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          peopleCapacity: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          area: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
          },
          spaceOfferId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          currencyId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          tourUrl: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          locationId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          spaceReservationTypeId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          spaceTypeId: {
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
    return queryInterface.dropTable('spaces');
  },
};
