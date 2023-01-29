'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('seats', 'deleted_at', {
      type: Sequelize.DATE,
      after: 'updated_at',
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('seats', 'deleted_at');
  },
};
