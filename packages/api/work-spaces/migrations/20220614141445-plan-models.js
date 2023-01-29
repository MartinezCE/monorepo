'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'plans',
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
            references: {
              model: 'companies',
              key: 'id',
            },
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          maxPersonalCredits: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          maxReservationCredits: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          startDate: {
            type: Sequelize.DATE,
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
        { deep: false }
      )
    );

    await queryInterface.createTable(
      'plan_users',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          planId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
              model: 'plans',
              key: 'id',
            },
          },
          userId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
              model: 'users',
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
        },
        { deep: false }
      )
    );

    await queryInterface.createTable(
      'plan_renovations',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          planId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
              model: 'plans',
              key: 'id',
            },
          },
          endDate: {
            type: Sequelize.DATE,
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
        { deep: false }
      )
    );

    await queryInterface.addColumn(
      'hourly_space_reservations',
      'plan_renovation_id',
      snakecaseKeys(
        {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'plan_renovations',
            key: 'id',
          },
          after: 'id',
        },
        { deep: false }
      )
    );
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.dropTable('plans'),
      queryInterface.dropTable('plan_users'),
      queryInterface.dropTable('plan_renovations'),
      queryInterface.removeColumn('hourly_space_reservations', 'plan_renovation_id'),
    ]);
  },
};
