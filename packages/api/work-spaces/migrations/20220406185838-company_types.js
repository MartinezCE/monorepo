'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('company_types', [
      {
        value: 'Co-Work',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('company_types', null, {});
  },
};
