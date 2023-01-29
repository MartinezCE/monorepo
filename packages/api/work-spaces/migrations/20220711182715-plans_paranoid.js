'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('plans');

    if (!table.deleted_at) {
      await queryInterface.addColumn('plans', 'deleted_at', {
        type: Sequelize.DATE,
        after: 'updated_at',
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('plans');

    if (table.deleted_at) {
      await queryInterface.removeColumn('plans', 'deleted_at');
    }
  },
};
