'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('locations', 'currency_id', {
      type: Sequelize.INTEGER.UNSIGNED,
    });

    await queryInterface.sequelize.query(`update locations 
    inner join companies c on c.id = locations.company_id
    inner join states s on s.id = c.state_id 
    inner join countries c2 on c2.id = s.country_id
    set locations.currency_id = c2.currency_id;`);

    await queryInterface.removeColumn('spaces', 'currency_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('locations', 'currency_id');
    await queryInterface.addColumn('spaces', 'currency_id');
  },
};
