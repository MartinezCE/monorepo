'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies_amenities', 'company_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('companies_amenities', 'amenity_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'amenities',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
