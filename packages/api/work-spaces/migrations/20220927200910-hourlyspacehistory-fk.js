'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hourly_space_history', 'space_id', {
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
