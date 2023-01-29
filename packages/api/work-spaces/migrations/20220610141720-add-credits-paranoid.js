'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('credits', 'deleted_at', { allowNull: true, type: Sequelize.DATE });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TABLE_NAME', 'deleted_at');
  },
};
