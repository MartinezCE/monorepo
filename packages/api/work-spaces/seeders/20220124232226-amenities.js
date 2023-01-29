'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('amenities', [
      {
        name: 'Estacionamiento',
        type: 'LOCATION',
        created_at: new Date(),
        updated_at: new Date(),
        is_default: true,
      },
      {
        name: 'Cocina',
        type: 'LOCATION',
        created_at: new Date(),
        updated_at: new Date(),
        is_default: true,
      },
      {
        name: 'Pet Friendly',
        type: 'LOCATION',
        created_at: new Date(),
        updated_at: new Date(),
        is_default: true,
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('amenities', null, {});
  },
};
