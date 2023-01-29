'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'company_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'company_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },
};
