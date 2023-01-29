'use strict';

const { endOfDay } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

module.exports = {
  async up(queryInterface, Sequelize) {
    const reservations = await queryInterface.sequelize.query('SELECT * FROM wpm_reservations WHERE end_at IS NULL', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    await Promise.all(
      reservations.map(async r => {
        const originDate = utcToZonedTime(r.start_at, r.destination_tz);
        const endDate = endOfDay(originDate);
        const destinationDate = zonedTimeToUtc(endDate, r.destination_tz);

        return queryInterface.bulkUpdate('wpm_reservations', { end_at: destinationDate }, { id: r.id });
      })
    );

    await queryInterface.changeColumn('wpm_reservations', 'end_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('wpm_reservations', 'end_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
