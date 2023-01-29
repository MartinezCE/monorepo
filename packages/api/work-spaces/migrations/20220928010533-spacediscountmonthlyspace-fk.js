'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('space_discounts_monthly_spaces', 'space_discount_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_discounts',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('space_discounts_monthly_spaces', 'monthly_space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'monthly_spaces',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
