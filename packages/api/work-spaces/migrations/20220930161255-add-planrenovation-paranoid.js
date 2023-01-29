'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('plan_renovations', 'deleted_at', {
      type: Sequelize.DATE,
      after: 'updated_at',
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('plan_renovations', 'deleted_at');
  },
};
