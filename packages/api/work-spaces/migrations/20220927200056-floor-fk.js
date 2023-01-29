'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('floors', 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
