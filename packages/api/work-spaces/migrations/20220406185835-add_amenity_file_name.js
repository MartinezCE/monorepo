'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('amenities', 'file_name', {
      type: Sequelize.STRING,
      defaultValue: 'Star.svg',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('amenities', 'file_name');
  }
};
