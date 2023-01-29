'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'address', {
      type: Sequelize.STRING,
      after: "name"
    });
    await queryInterface.addColumn('companies', 'zip_code', {
      type: Sequelize.STRING,
      after: "name"
    });
    await queryInterface.addColumn('companies', 'business_name', {
      type: Sequelize.STRING,
      after: "name"
    });
    await queryInterface.addColumn('companies', 'tax_number', {
      type: Sequelize.STRING,
      after: "name"
    });
    await queryInterface.addColumn('companies', 'people_amount', {
      type: Sequelize.INTEGER.UNSIGNED,
      after: "name"
    });
    await queryInterface.addColumn('companies', 'website_url', {
      type: Sequelize.STRING,
      after: "name"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'address');
    await queryInterface.removeColumn('companies', 'zip_code');
    await queryInterface.removeColumn('companies', 'business_name');
    await queryInterface.removeColumn('companies', 'tax_number');
    await queryInterface.removeColumn('companies', 'people_amount');
    await queryInterface.removeColumn('companies', 'website_url');
  },
};
