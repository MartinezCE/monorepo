'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('wpm_reservation_types', [
      {
        name: 'DAYPASS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'MORNING',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'AFTERNOON',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.bulkDelete('wpm_reservation_types', {
        name: 'DAYPASS',
      }),
      queryInterface.bulkDelete('wpm_reservation_types', {
        name: 'MORNING',
      }),
      queryInterface.bulkDelete('wpm_reservation_types', {
        name: 'AFTERNOON',
      }),
    ]);
  },
};
