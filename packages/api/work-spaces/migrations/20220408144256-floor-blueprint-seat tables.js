'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'floors',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          locationId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          number: {
            type: Sequelize.INTEGER,
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

    await queryInterface.createTable(
      'blueprints',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          floorId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM('DRAFT', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'DRAFT',
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING,
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

    await queryInterface.createTable(
      'seats',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          blueprintId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          geometry: {
            type: Sequelize.GEOMETRY('POINT'),
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

  async down(queryInterface) {
    await queryInterface.dropTable('floors');
    await queryInterface.dropTable('blueprints');
    await queryInterface.dropTable('seats');
  },
};
