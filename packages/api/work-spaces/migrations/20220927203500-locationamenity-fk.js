'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('locations_amenities', 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('locations_amenities', 'amenity_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'amenities',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
