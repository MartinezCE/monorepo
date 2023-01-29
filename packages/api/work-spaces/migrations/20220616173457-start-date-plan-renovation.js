'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('plan_renovations', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false,
      after: 'plan_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('plan_renovations', 'start_date');
  },
};
