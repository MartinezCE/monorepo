'use strict';
const snakecaseKeys = require('snakecase-keys');

const SpaceReservationHourlyTypes = {
  PER_HOUR: 'PER_HOUR',
  HALF_DAY: 'HALF_DAY',
  DAYPASS: 'DAYPASS',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hourly_space_reservations', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      space_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'spaces',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM(...Object.values(SpaceReservationHourlyTypes)),
        allowNull: false,
      },
      hourly_space_history_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'hourly_space_history',
          key: 'id',
        },
      },
      fee_percentage_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'fee_percentages',
          key: 'id',
        },
      },
      credit_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'credits',
          key: 'id',
        },
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hourly_space_reservations');
  },
};
