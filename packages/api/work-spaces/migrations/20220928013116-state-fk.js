'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('states', 'country_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'countries',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
