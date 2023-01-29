'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('wpm_reservation_types', [
      {
        name: 'CUSTOM',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('wpm_reservation_types', {
      name: 'CUSTOM',
    });
  },
};
