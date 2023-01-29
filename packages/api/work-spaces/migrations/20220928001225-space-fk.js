'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('spaces', 'space_offer_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'space_offers',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('spaces', 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('spaces', 'space_reservation_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_reservation_types',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('spaces', 'space_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
