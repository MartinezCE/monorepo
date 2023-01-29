'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('plans', 'company_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('plans', 'plan_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'plan_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
