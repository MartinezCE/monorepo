'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_offers', [
      {
        value: 'OPEN_DESK',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'DEDICATED_DESK',
        created_at: new Date(),
        updated_at: new Date(),
      }, 
      {
        value: 'PRIVATE_OFFICE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'TEAM_OFFICE',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_offers', null, {});
  },
};
