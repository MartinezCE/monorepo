'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'user_amenities',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          userId: {
            allowNull: false,
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          amenityId: {
            allowNull: false,
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: 'amenities',
              key: 'id',
            },
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
        { deep: false }
      )
    );
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('user_amenities');
  },
};
