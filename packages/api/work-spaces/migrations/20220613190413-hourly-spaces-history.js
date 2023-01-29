'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'hourly_space_history',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          previousHourlySpaceId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          halfDayPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          fullDayPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          minHoursAmount: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
          },
          dayOfWeek: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
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
        { deep: false }
      )
    );

    const hourlySpaces = await queryInterface.sequelize.query(`SELECT * FROM hourly_spaces`, {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    if (hourlySpaces.length) {
      await queryInterface.bulkInsert(
        'hourly_space_history',
        hourlySpaces.map(({ id, price, half_day_price, full_day_price, min_hours_amount, day_of_week, space_id }) => ({
          previous_hourly_space_id: id,
          price,
          half_day_price,
          full_day_price,
          min_hours_amount,
          day_of_week,
          space_id,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hourly_space_history');
  },
};
