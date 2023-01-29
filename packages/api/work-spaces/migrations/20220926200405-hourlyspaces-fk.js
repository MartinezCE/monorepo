'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hourly_spaces', 'space_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {},
};
