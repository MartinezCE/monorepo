'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'form',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          form_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          form_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          question_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          question_label: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'short_text',
          },
          answer: {
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
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('form');
  }
};
