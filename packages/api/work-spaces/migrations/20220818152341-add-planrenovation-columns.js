'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('plan_renovations', 'plan_credit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'plan_credits',
        key: 'id',
      },
      after: 'end_date',
    });

    await queryInterface.addColumn('plan_renovations', 'used_credits', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'plan_credit_id',
    });

    await queryInterface.addColumn('plan_renovations', 'unused_credits', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'used_credits',
    });

    await queryInterface.addColumn('plan_renovations', 'total_credits', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'unused_credits',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('plan_renovations', 'plan_credit_id');
    await queryInterface.removeColumn('plan_renovations', 'used_credits');
    await queryInterface.removeColumn('plan_renovations', 'unused_credits');
    await queryInterface.removeColumn('plan_renovations', 'total_credits');
  },
};
