'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('space_deposits_monthly_spaces', 'space_deposit_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_deposits',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('space_deposits_monthly_spaces', 'monthly_space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'monthly_spaces',
        key: 'id',
      },
    });
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
    await queryInterface.changeColumn('space_offers_space_types', 'space_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_types',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('space_offers_space_types', 'space_offer_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_offers',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('space_reservation_types_space_types', 'space_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_types',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('space_reservation_types_space_types', 'space_reservation_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_reservation_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
