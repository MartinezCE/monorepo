'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const type = Sequelize.STRING;
    const allowNull = false;
    const defaultValue = 'UTC';

    await queryInterface.changeColumn('wpm_reservations', 'destination_tz', {
      type,
      allowNull,
      after: 'seat_id',
      defaultValue,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'destination_tz', {
      type,
      allowNull,
      after: 'credit_id',
      defaultValue,
    });
    await queryInterface.changeColumn('wpm_reservations', 'origin_tz', {
      type,
      allowNull,
      after: 'seat_id',
      defaultValue,
    });
    await queryInterface.changeColumn('hourly_space_reservations', 'origin_tz', {
      type,
      allowNull,
      after: 'credit_id',
      defaultValue,
    });

    await queryInterface.changeColumn('companies', 'tz', {
      type,
      allowNull,
      after: 'state_id',
      defaultValue,
    });
  },

  async down(queryInterface, Sequelize) {},
};
