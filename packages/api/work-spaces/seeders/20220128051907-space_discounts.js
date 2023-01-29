'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_discounts', [
      {
        months_amount: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        months_amount: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        months_amount: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_discounts', null, {});
  },
};
