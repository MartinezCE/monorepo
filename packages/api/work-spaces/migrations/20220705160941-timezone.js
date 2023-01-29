'use strict';

const columns = ['destination_offset', 'destination_tz', 'origin_offset', 'origin_tz'];

module.exports = {
  async up(queryInterface, Sequelize) {
    const allowNull = false;
    // sequence is important here. We need it to create columns in the correct order
    // We traverse the columns array and insert each after the previous one
    // so final columns order will be: origin_tz, origin_offset, destination_tz, destination_offset
    // pd: we must wait for each column to be created to avoid a deadlock
    for (const column of columns) {
      const type = column.endsWith('_offset') ? Sequelize.INTEGER : Sequelize.STRING;
      const defaultValue = column.endsWith('_offset') ? 0 : 'UTC';

      await queryInterface.addColumn('wpm_reservations', column, {
        type,
        allowNull,
        after: 'seat_id',
        defaultValue,
      });
      await queryInterface.addColumn('hourly_space_reservations', column, {
        type,
        allowNull,
        after: 'credit_id',
        defaultValue,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // pd: we must wait for each column to be created to avoid a deadlock
    for (const column of columns) {
      await queryInterface.removeColumn('wpm_reservations', column);
      await queryInterface.removeColumn('hourly_space_reservations', column);
    }
  },
};
