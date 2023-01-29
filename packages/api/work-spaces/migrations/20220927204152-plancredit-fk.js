'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('plan_credits', 'plan_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('plan_credits', 'credit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'credits',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
