'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('hourly_space_reservations');

    if (table.deleted_at) {
      await queryInterface.removeColumn('hourly_space_reservations', 'deleted_at');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('hourly_space_reservations');

    if (!table.deleted_at) {
      await queryInterface.addColumn('hourly_space_reservations', 'deleted_at', {
        type: Sequelize.DATE,
        after: 'updated_at',
        allowNull: true,
      });
    }
  },
};
