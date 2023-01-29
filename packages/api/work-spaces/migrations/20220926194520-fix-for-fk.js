'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('plans', 'plans_plan_type_id_foreign_idx');

    await queryInterface.changeColumn('plan_types', 'id', {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      // primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {},
};
