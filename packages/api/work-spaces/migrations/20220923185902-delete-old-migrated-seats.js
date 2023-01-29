'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const seats = await queryInterface.sequelize.query('SELECT * FROM seats WHERE provider IS NOT NULL', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    await queryInterface.bulkDelete('wpm_reservations', { seat_id: { [Sequelize.Op.in]: seats.map(s => s.id) } });
    await queryInterface.bulkDelete('seats', { id: { [Sequelize.Op.in]: seats.map(s => s.id) } });
  },

  async down(queryInterface, Sequelize) {},
};
