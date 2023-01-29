'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_types', [
      {
        value: 'SHARED',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'MEETING_ROOM',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        value: 'PRIVATE_OFFICE',
        created_at: new Date(), 
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_types', null, {});
  },
};
