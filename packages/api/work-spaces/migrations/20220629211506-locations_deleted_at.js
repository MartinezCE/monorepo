'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('locations', 'deleted_at', {
      type: Sequelize.DATE,
      after: 'updated_at',
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('locations', 'deleted_at');
  },
};
