'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats_amenities', 'seat_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'seats',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('seats_amenities', 'amenity_id', {
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
