'use strict';

const ARG_STATES = ['Buenos Aires'];
const MEX_STATES = ['Ciudad de Mexico'];

module.exports = {
  async up(queryInterface) {
    const firstId = await queryInterface.bulkInsert('countries', [
      {
        iso3: 'ARG',
        name: 'Argentina',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        iso3: 'MEX',
        name: 'Mexico',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await Promise.all(
      ARG_STATES.map(state =>
        queryInterface.bulkInsert('states', [
          {
            name: state,
            country_id: firstId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
      )
    );

    await Promise.all(
      MEX_STATES.map(state =>
        queryInterface.bulkInsert('states', [
          {
            name: state,
            country_id: firstId + 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
      )
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
    await queryInterface.bulkDelete('states', null, {});
  },
};
