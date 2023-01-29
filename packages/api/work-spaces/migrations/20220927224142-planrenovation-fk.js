'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('plan_renovations', 'plan_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('plan_renovations', 'plan_credit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'plan_credits',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
