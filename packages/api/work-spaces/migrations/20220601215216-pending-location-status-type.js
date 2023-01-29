'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('locations', 'status', {
      type: Sequelize.DataTypes.ENUM('PENDING', 'IN_PROCESS', 'PUBLISHED'),
      allowNull: true,
      defaultValue: 'IN_PROCESS',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('locations', 'status', {
      type: Sequelize.DataTypes.ENUM('IN_PROCESS', 'PUBLISHED'),
      allowNull: true,
      defaultValue: 'IN_PROCESS',
    });
  },
};
