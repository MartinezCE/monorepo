'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('currencies', [
      {
        value: 'COP',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
