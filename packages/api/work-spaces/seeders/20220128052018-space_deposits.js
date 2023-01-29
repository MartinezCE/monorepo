'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_deposits', [
      {
        months_amount: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        months_amount: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_deposits', null, {});
  },
};
