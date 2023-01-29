'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyAmenities = await queryInterface.sequelize.query(
      `
      SELECT DISTINCT companies.id, seats_amenities.amenity_id
      FROM companies
      JOIN locations ON locations.company_id = companies.id
      JOIN floors ON floors.location_id = locations.id
      JOIN blueprints ON blueprints.floor_id = floors.id
      JOIN seats ON seats.blueprint_id = blueprints.id
      JOIN seats_amenities ON seats_amenities.seat_id = seats.id;
    `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (companyAmenities.length > 0) {
      await queryInterface.bulkInsert(
        'companies_amenities',
        companyAmenities.map(({ id, amenity_id }) => ({
          company_id: id,
          amenity_id,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies_amenities', null, {});
  },
};
