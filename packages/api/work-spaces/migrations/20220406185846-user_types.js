'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('user_types', [
      {
        value: 'PARTNER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('user_types', null, {});
  },
};
