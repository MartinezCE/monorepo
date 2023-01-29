'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('locations', 'provider', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'id',
    });

    await queryInterface.addColumn('seats', 'provider', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('locations', 'provider');
    await queryInterface.removeColumn('seats', 'provider');
  },
};
