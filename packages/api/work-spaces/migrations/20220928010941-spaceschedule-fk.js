'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('space_schedules', 'space_id', {
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
