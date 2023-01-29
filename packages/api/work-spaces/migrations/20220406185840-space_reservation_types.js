'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_reservation_types', [
      {
        value: 'HOURLY',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'MONTHLY',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_reservation_types', null, {});
  },
};
