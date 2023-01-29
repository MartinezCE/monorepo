'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'space_schedules',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          dayOfWeek: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          openTime: {
            type: Sequelize.TIME,
            allowNull: true,
          },
          closeTime: {
            type: Sequelize.TIME,
            allowNull: true,
          },
          is24Open: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
    return queryInterface.dropTable('space_schedules');
  },
};
