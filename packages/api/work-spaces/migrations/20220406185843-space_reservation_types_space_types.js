'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_reservation_types_space_types', [
      {
        space_type_id: 1,
        space_reservation_type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        space_type_id: 2,
        space_reservation_type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        space_type_id: 3,
        space_reservation_type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        space_type_id: 1,
        space_reservation_type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        space_type_id: 3,
        space_reservation_type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_reservation_types_space_types', null, {});
  },
};
