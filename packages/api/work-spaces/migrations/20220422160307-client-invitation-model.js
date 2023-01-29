'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'client-invitations',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          userId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
          },
          toEmail: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          roleId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
          },
          planId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
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
          deletedAt: {
            allowNull: true,
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
    await queryInterface.dropTable('client-invitations');
  },
};
