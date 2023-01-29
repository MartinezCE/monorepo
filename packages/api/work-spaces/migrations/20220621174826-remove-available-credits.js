'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('plans', 'available_credits');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('plans', 'available_credits', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'plan_type_id',
    });
  },
};
