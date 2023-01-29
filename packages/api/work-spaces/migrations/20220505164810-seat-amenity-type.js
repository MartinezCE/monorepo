'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('amenities', 'type', {
      type: Sequelize.ENUM('LOCATION', 'SPACE', 'SAFETY', 'SEAT', 'CUSTOM'),
      allowNull: false,
      defaultValue: 'CUSTOM',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('amenities', 'type', {
      type: Sequelize.ENUM('LOCATION', 'SPACE', 'SAFETY', 'CUSTOM'),
      allowNull: false,
      defaultValue: 'CUSTOM',
    });
  },
};
