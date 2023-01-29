'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('space_offers_space_types', [
      {
        space_type_id: 1,
        space_offer_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('space_offers_space_types', null, {});
  },
};
