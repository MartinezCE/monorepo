'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'users',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          userTypeId: {
            type: Sequelize.INTEGER.UNSIGNED,
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
    return queryInterface.dropTable('users');
  },
};
