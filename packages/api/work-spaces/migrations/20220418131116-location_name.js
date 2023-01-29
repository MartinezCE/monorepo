'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('locations', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });

    await queryInterface.sequelize.query(`update locations 
	  inner join companies on locations.company_id = companies.id
    set locations.name = TRIM(CONCAT(companies.name, ' ', COALESCE(locations.city, '')));`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('locations', 'name');
  }
};
