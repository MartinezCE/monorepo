'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('spaces_amenities', 'amenity_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'amenities',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('spaces_amenities', 'space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'spaces',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
