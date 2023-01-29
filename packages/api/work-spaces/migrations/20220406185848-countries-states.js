'use strict';

const CL_STATES = ['Santiago de Chile'];
const COL_STATES = ['Bogota'];

module.exports = {
  async up(queryInterface) {
    const firstId = await queryInterface.bulkInsert('countries', [
      {
        iso3: 'CHL',
        name: 'Chile',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        iso3: 'COL',
        name: 'Colombia',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await Promise.all([
      Promise.all(
        CL_STATES.map(state =>
          queryInterface.bulkInsert('states', [
            {
              name: state,
              country_id: firstId,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ])
        )
      ),
      Promise.all(
        COL_STATES.map(state =>
          queryInterface.bulkInsert('states', [
            {
              name: state,
              country_id: firstId + 1,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ])
        )
      ),
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
    await queryInterface.bulkDelete('states', null, {});
  },
};
