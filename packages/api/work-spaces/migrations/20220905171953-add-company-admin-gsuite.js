'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'admin_providers', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'admin_providers');
  },
};
