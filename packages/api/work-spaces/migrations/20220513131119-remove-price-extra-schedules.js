'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const schedulesIds = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM space_schedules AS a
      WHERE NOT EXISTS (
        SELECT id
        FROM hourly_spaces AS b
        WHERE a.space_id = b.space_id
        AND a.day_of_week = b.day_of_week
      )`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkDelete('space_schedules', {
      id: { [Sequelize.Op.in]: schedulesIds.map(s => s.id) },
    });
  },

  async down(queryInterface, Sequelize) {},
};
