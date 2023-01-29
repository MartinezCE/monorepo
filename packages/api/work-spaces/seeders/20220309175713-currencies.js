'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('currencies', [
      {
        value: 'ARS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'MXN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'CLP',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
